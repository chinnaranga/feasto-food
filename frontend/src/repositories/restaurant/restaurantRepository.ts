import {
  doc,
  collection,
  onSnapshot,
  getDoc,
  query,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export interface RestaurantPortalData {
  id: string;
  name: string;
  isOnline: boolean;
  activeZone: string;
  rating: number;
}

export const restaurantRepository = {
  subscribePortalOrders(restaurantId: string, onUpdate: (orders: any[]) => void): Unsubscribe {
    if (!restaurantId) {
      onUpdate([]);
      return () => {};
    }
    const ordersRef = collection(db, 'restaurants', restaurantId, 'orders');
    return onSnapshot(
      ordersRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribePortalMenu(restaurantId: string, onUpdate: (menuItems: any[]) => void): Unsubscribe {
    if (!restaurantId) {
      onUpdate([]);
      return () => {};
    }
    const menuRef = collection(db, 'restaurants', restaurantId, 'menu');
    return onSnapshot(
      menuRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribePortalBranches(restaurantId: string, onUpdate: (branches: any[]) => void): Unsubscribe {
    if (!restaurantId) {
      onUpdate([]);
      return () => {};
    }
    const branchesRef = collection(db, 'restaurants', restaurantId, 'branches');
    return onSnapshot(
      branchesRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribePortalFinance(restaurantId: string, onUpdate: (financeData: any) => void): Unsubscribe {
    if (!restaurantId) {
      onUpdate(null);
      return () => {};
    }
    const finRef = doc(db, 'restaurants', restaurantId, 'finance', 'summary');
    return onSnapshot(
      finRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate({ id: snapshot.id, ...snapshot.data() });
        } else {
          onUpdate(null);
        }
      },
      () => {
        onUpdate(null);
      }
    );
  },
};

export default restaurantRepository;
