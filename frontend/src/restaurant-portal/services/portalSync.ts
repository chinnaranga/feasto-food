import { db } from '@/services/firebase';
import { collection, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import { usePortalCustomerStore } from '../store/portalCustomerStore';
import { usePortalCategoryStore } from '../store/portalCategoryStore';
import { usePortalStaffStore } from '../store/portalStaffStore';
import { usePortalInventoryStore } from '../store/portalInventoryStore';
import { usePortalMenuStore } from '../store/portalMenuStore';
import { subscribePortalOrders } from '../store/portalOrderStore';
import { usePortalStore } from '../store/portalStore';

import {
  SEED_CATEGORIES,
  SEED_SECTIONS,
  SEED_MENU_ITEMS,
  SEED_STOCK_ITEMS,
  SEED_STAFF,
  SEED_SHIFTS,
  SEED_ROLES,
  SEED_CUSTOMERS,
  SEED_SEGMENTS
} from '../data/portalMockSeed';

let unsubscribers: (() => void)[] = [];

const rebuildAndSyncRestaurantMenu = async () => {
  const restaurantId = usePortalStore.getState().selectedRestaurant?.id;
  if (!restaurantId) return;

  const categories = usePortalCategoryStore.getState().categories;
  const items = usePortalMenuStore.getState().items;

  if (categories.length === 0 || items.length === 0) return;

  // 1. Get root categories (no parentId)
  const rootCats = categories.filter((c) => !c.parentId && c.status === 'published');
  
  // Sort them by priority
  rootCats.sort((a, b) => a.priority - b.priority);

  // 2. Build the nested array of MenuCategory for the Customer App
  const menuCategories = rootCats.map((parentCat) => {
    // Get all subcategories of this parent
    const subCats = categories.filter((c) => c.parentId === parentCat.id && c.status === 'published');
    const allowedNames = [parentCat.name.toLowerCase(), ...subCats.map((sc) => sc.name.toLowerCase())];

    // Filter published menu items belonging to this category or its subcategories
    const categoryItems = items.filter((item) => {
      const isPublished = item.status === 'published';
      const matchesCategory = item.category && allowedNames.includes(item.category.toLowerCase());
      const matchesSubcategory = item.subcategory && allowedNames.includes(item.subcategory.toLowerCase());
      return isPublished && (matchesCategory || matchesSubcategory);
    });

    // Map each portal item to the customer app's MenuItem format
    const mappedItems = categoryItems.map((pItem) => {
      const tags: string[] = [];
      if (pItem.dietary === 'vegan') tags.push('Vegan');
      if (pItem.dietary === 'veg') tags.push('Vegetarian');
      if (pItem.dietary === 'halal') tags.push('Halal');
      if (pItem.tags) {
        pItem.tags.forEach((t: string) => {
          const capitalized = t.charAt(0).toUpperCase() + t.slice(1);
          if (!tags.includes(capitalized)) {
            tags.push(capitalized);
          }
        });
      }

      let emoji = pItem.primaryImage || '🍽️';
      const nameLower = pItem.name.toLowerCase();
      if (nameLower.includes('sushi') || nameLower.includes('salmon') || nameLower.includes('tuna') || nameLower.includes('nigiri')) {
        emoji = '🍣';
      } else if (nameLower.includes('roll')) {
        emoji = '🌯';
      } else if (nameLower.includes('dumpling') || nameLower.includes('gyoza') || nameLower.includes('dimsum')) {
        emoji = '🥟';
      } else if (nameLower.includes('rice') || nameLower.includes('noodle') || nameLower.includes('mains') || nameLower.includes('bowl')) {
        emoji = '🍜';
      } else if (nameLower.includes('salad') || nameLower.includes('edamame') || nameLower.includes('tempura')) {
        emoji = '🥗';
      } else if (nameLower.includes('tea') || nameLower.includes('beverage') || nameLower.includes('oolong') || nameLower.includes('soda')) {
        emoji = '🍵';
      } else if (nameLower.includes('mochi') || nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('cake')) {
        emoji = '🍡';
      }

      const addonGroups = pItem.addons ? pItem.addons.map((a: any) => ({
        id: a.id || `group-${Math.random().toString(36).substr(2, 9)}`,
        name: a.name || 'Add-ons',
        required: false,
        maxSelections: 5,
        options: [
          { id: a.id || `opt-${Math.random().toString(36).substr(2, 9)}`, name: a.name || 'Extra option', price: a.price || 0 }
        ]
      })) : [];

      return {
        id: pItem.id,
        name: pItem.name,
        description: pItem.description || '',
        price: pItem.discountPrice || pItem.basePrice || 0,
        tags: tags,
        spiceLevel: nameLower.includes('spicy') || nameLower.includes('hot') ? 'medium' : 'mild',
        cookingTime: 15,
        nutrition: {
          calories: pItem.calories || 0,
          protein: pItem.protein || 0,
          carbs: pItem.carbs || 0,
          fat: pItem.fat || 0,
        },
        isAvailable: pItem.status === 'published' && !pItem.availability?.tempDisabled,
        emoji: emoji,
        addonGroups: addonGroups,
      };
    });

    return {
      id: parentCat.id,
      name: parentCat.name,
      description: parentCat.description || '',
      emoji: parentCat.name.toLowerCase().includes('starter') || parentCat.name.toLowerCase().includes('appetizer') ? '🫔' :
             parentCat.name.toLowerCase().includes('main') || parentCat.name.toLowerCase().includes('platter') ? '🍜' :
             parentCat.name.toLowerCase().includes('dessert') || parentCat.name.toLowerCase().includes('sweet') ? '🍡' :
             parentCat.name.toLowerCase().includes('beverage') || parentCat.name.toLowerCase().includes('drink') ? '🍵' : '🍣',
      items: mappedItems,
    };
  });

  // 3. Write to restaurants/{restaurantId}
  console.log(`📡 Synced updated menu layout to customer-facing restaurants/${restaurantId}`);
  await setDoc(doc(db, 'restaurants', restaurantId), { menuCategories }, { merge: true });
};

export const portalSyncService = {
  initializePortalSync: async () => {
    // 1. Unsubscribe any existing listeners
    portalSyncService.terminatePortalSync();

    console.log('🔄 Cloud Firestore: Initializing real-time sync with portal stores...');

    try {
      // ─── A. Seed Categories & Sections if empty ───
      const catCol = collection(db, 'portal_categories');
      const catSnap = await getDocs(catCol);
      if (catSnap.empty) {
        console.log('🌱 Seeding portal categories...');
        for (const cat of SEED_CATEGORIES) {
          await setDoc(doc(db, 'portal_categories', cat.id), cat);
        }
      }

      const secCol = collection(db, 'portal_sections');
      const secSnap = await getDocs(secCol);
      if (secSnap.empty) {
        console.log('🌱 Seeding portal menu sections...');
        for (const sec of SEED_SECTIONS) {
          await setDoc(doc(db, 'portal_sections', sec.id), sec);
        }
      }

      // ─── B. Seed Menu Items if empty ───
      const menuCol = collection(db, 'portal_menu_items');
      const menuSnap = await getDocs(menuCol);
      if (menuSnap.empty) {
        console.log('🌱 Seeding portal menu items...');
        for (const item of SEED_MENU_ITEMS) {
          await setDoc(doc(db, 'portal_menu_items', item.id), item);
        }
      }

      // ─── C. Seed Stock / Inventory if empty ───
      const stockCol = collection(db, 'portal_stock_items');
      const stockSnap = await getDocs(stockCol);
      if (stockSnap.empty) {
        console.log('🌱 Seeding portal inventory items...');
        for (const item of SEED_STOCK_ITEMS) {
          await setDoc(doc(db, 'portal_stock_items', item.id), item);
        }
      }

      // ─── D. Seed Staff, Shifts & Roles if empty ───
      const staffCol = collection(db, 'portal_staff');
      const staffSnap = await getDocs(staffCol);
      if (staffSnap.empty) {
        console.log('🌱 Seeding portal staff...');
        for (const s of SEED_STAFF) {
          await setDoc(doc(db, 'portal_staff', s.id), s);
        }
      }

      const shiftCol = collection(db, 'portal_shifts');
      const shiftSnap = await getDocs(shiftCol);
      if (shiftSnap.empty) {
        console.log('🌱 Seeding portal shifts...');
        for (const s of SEED_SHIFTS) {
          await setDoc(doc(db, 'portal_shifts', s.id), s);
        }
      }

      const roleCol = collection(db, 'portal_roles');
      const roleSnap = await getDocs(roleCol);
      if (roleSnap.empty) {
        console.log('🌱 Seeding portal roles...');
        for (const r of SEED_ROLES) {
          await setDoc(doc(db, 'portal_roles', r.id), r);
        }
      }

      // ─── E. Seed Customers & Segments if empty ───
      const custCol = collection(db, 'portal_customers');
      const custSnap = await getDocs(custCol);
      if (custSnap.empty) {
        console.log('🌱 Seeding portal customers...');
        for (const c of SEED_CUSTOMERS) {
          await setDoc(doc(db, 'portal_customers', c.id), c);
        }
      }

      const segCol = collection(db, 'portal_segments');
      const segSnap = await getDocs(segCol);
      if (segSnap.empty) {
        console.log('🌱 Seeding portal segments...');
        for (const s of SEED_SEGMENTS) {
          await setDoc(doc(db, 'portal_segments', s.id), s);
        }
      }

    } catch (e) {
      console.warn('⚠️ Cloud Firestore seeding failed/skipped. Syncing directly.', e);
    }

    // ─── 2. Bind Live Listeners ───

    // A. Categories
    const unsubCategories = onSnapshot(collection(db, 'portal_categories'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalCategoryStore.setState({ categories: list });
      rebuildAndSyncRestaurantMenu();
    });
    unsubscribers.push(unsubCategories);

    // B. Menu Sections
    const unsubSections = onSnapshot(collection(db, 'portal_sections'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalCategoryStore.setState({ sections: list });
    });
    unsubscribers.push(unsubSections);

    // C. Menu Items
    const unsubMenuItems = onSnapshot(collection(db, 'portal_menu_items'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalMenuStore.setState({ items: list });
      rebuildAndSyncRestaurantMenu();
    });
    unsubscribers.push(unsubMenuItems);

    // D. Stock Items
    const unsubStock = onSnapshot(collection(db, 'portal_stock_items'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalInventoryStore.setState({ items: list });
    });
    unsubscribers.push(unsubStock);

    // E. Staff
    const unsubStaff = onSnapshot(collection(db, 'portal_staff'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalStaffStore.setState({ staff: list });
    });
    unsubscribers.push(unsubStaff);

    // F. Shifts
    const unsubShifts = onSnapshot(collection(db, 'portal_shifts'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalStaffStore.setState({ shifts: list });
    });
    unsubscribers.push(unsubShifts);

    // G. Roles
    const unsubRoles = onSnapshot(collection(db, 'portal_roles'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalStaffStore.setState({ roles: list });
    });
    unsubscribers.push(unsubRoles);

    // H. Customers
    const unsubCustomers = onSnapshot(collection(db, 'portal_customers'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalCustomerStore.setState({ customers: list });
    });
    unsubscribers.push(unsubCustomers);

    // I. Segments
    const unsubSegments = onSnapshot(collection(db, 'portal_segments'), (snap) => {
      const list: any[] = [];
      snap.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
      usePortalCustomerStore.setState({ segments: list });
    });
    unsubscribers.push(unsubSegments);

    // J. Live Orders (root collection — bridges Customer App → Restaurant Portal)
    const restaurantId = usePortalStore.getState().selectedRestaurant?.id || '';
    const unsubOrders = subscribePortalOrders(restaurantId);
    unsubscribers.push(unsubOrders);

    console.log('✅ Cloud Firestore: Real-time listeners successfully connected.');
  },

  terminatePortalSync: () => {
    if (unsubscribers.length > 0) {
      console.log('🔌 Terminating portal real-time sync listeners...');
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
    }
  }
};

export default portalSyncService;
