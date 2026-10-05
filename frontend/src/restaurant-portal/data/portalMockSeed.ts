import { Category, MenuSection } from '../store/portalCategoryStore';
import { MenuItem } from '../store/portalMenuStore';
import { StockItem } from '../store/portalInventoryStore';
import { StaffMember, Shift, RoleDefinition } from '../store/portalStaffStore';
import { Customer, CustomerSegment } from '../store/portalCustomerStore';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-mains',
    name: 'Mains & Platters',
    description: 'Hearty chef selections, signature custom platter options, and specialty rice noodles.',
    priority: 1,
    status: 'published',
    visibility: { startTime: '11:00', endTime: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'cat-rolls',
    name: 'Special Sushi Rolls',
    description: 'Artisanal hand-crafted custom sushi rolls loaded with fresh premium ingredients.',
    parentId: 'cat-mains',
    priority: 2,
    status: 'published',
    visibility: { startTime: '11:00', endTime: '23:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'cat-starters',
    name: 'Appetizers & Starters',
    description: 'Crispy tempura fritters, pan-seared dumplings, and small sharing bites.',
    priority: 2,
    status: 'published',
    visibility: { startTime: '09:00', endTime: '23:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'cat-dumplings',
    name: 'Pan-Fried Dumplings',
    description: 'Crispy steamed gyoza buns and dimsums paired with vinegar soy dipping caps.',
    parentId: 'cat-starters',
    priority: 4,
    status: 'published',
    visibility: { startTime: '11:00', endTime: '23:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'cat-desserts',
    name: 'Sweet Desserts',
    description: 'Traditional mochi ice cream, fresh matcha cheesecakes, and red bean delicacies.',
    priority: 3,
    status: 'published',
    visibility: { startTime: '11:00', endTime: '23:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'cat-beverages',
    name: 'Cold & Hot Beverages',
    description: 'Brewed oolong tea, custom boba cups, and imported sodas.',
    priority: 4,
    status: 'published',
    visibility: { startTime: '08:00', endTime: '23:59', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
];

export const SEED_SECTIONS: MenuSection[] = [
  {
    id: 'sec-featured',
    name: 'Featured Specials',
    description: 'Items spotlighted at the top of the menu catalog for improved brand conversions.',
    itemIds: ['item-1', 'item-4'],
    status: 'active',
    priority: 1,
  },
  {
    id: 'sec-popular',
    name: 'Bestselling Favorites',
    description: 'Highly-rated chef picks verified by delivery volume.',
    itemIds: ['item-1', 'item-2'],
    status: 'active',
    priority: 2,
  },
  {
    id: 'sec-promo',
    name: 'Limited-Time Offers',
    description: 'Seasonal specials with discounted pricing applied.',
    itemIds: ['item-4'],
    status: 'active',
    priority: 3,
  },
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Signature Dragon Sushi Roll',
    description: 'Premium rolls with fresh eel, cucumber, and avocado topped with thin avocado slices, spicy garlic mayo, tobiko, and unagi sweet soy sauce drizzle.',
    category: 'Mains & Platters',
    subcategory: 'Special Sushi Rolls',
    basePrice: 850,
    packagingCharge: 30,
    status: 'published',
    dietary: 'non-veg',
    calories: 420,
    protein: 18,
    carbs: 48,
    fat: 16,
    allergens: ['Soy', 'Wheat', 'Seafood', 'Egg'],
    tags: ['Best Seller', 'Signature', 'Spicy'],
    images: [],
    variants: [
      { id: 'v-1', label: '8 Pieces (Full)', priceAdjustment: 0, available: true },
      { id: 'v-2', label: '4 Pieces (Half)', priceAdjustment: -380, available: true },
    ],
    addons: [
      { id: 'a-1', name: 'Extra Avocado', price: 60, available: true },
      { id: 'a-2', name: 'Spicy Garlic Mayo', price: 20, available: true },
    ],
    availability: {
      breakfast: false,
      lunch: true,
      dinner: true,
      lateNight: false,
      weekdays: true,
      weekends: true,
      tempDisabled: false,
    },
  },
  {
    id: 'item-2',
    name: 'Vegetable Gyoza (Pan-Fried)',
    description: 'Delicate wheat wrappers filled with finely chopped cabbage, carrots, mushrooms, and spring onions. Served pan-seared with premium sesame dipping sauce.',
    category: 'Appetizers & Starters',
    subcategory: 'Pan-Fried Dumplings',
    basePrice: 380,
    packagingCharge: 20,
    status: 'published',
    dietary: 'vegan',
    calories: 210,
    protein: 6,
    carbs: 32,
    fat: 5,
    allergens: ['Soy', 'Wheat', 'Sesame'],
    tags: ['Crispy', 'Healthy'],
    images: [],
    variants: [],
    addons: [
      { id: 'a-3', name: 'Premium Soy Vinegar Dip', price: 15, available: true },
    ],
    availability: {
      breakfast: false,
      lunch: true,
      dinner: true,
      lateNight: true,
      weekdays: true,
      weekends: true,
      tempDisabled: false,
    },
  },
];

export const SEED_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stock-1',
    name: 'Fresh Atlantic Salmon (Fillet)',
    category: 'ingredients',
    currentQuantity: 38,
    reservedQuantity: 5,
    safetyStock: 15,
    minStock: 10,
    maxStock: 80,
    reorderPoint: 25,
    unit: 'kg',
    location: 'cold-storage',
    supplier: {
      name: 'Pacific Blue Seafoods Ltd',
      contact: 'Marcus Vance',
      phone: '+91 98845 22001',
      email: 'orders@pacificseafoods.com',
      leadTimeDays: 2,
      preferred: true,
    },
    mfgDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    recipeMenuIds: ['item-1'],
    wasteLogs: [
      { id: 'w-1', quantity: 2, reason: 'spoilage', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Trim spoilage during prep.' },
    ],
  },
  {
    id: 'stock-2',
    name: 'Premium Japanese Koshihikari Rice',
    category: 'raw-materials',
    currentQuantity: 120,
    reservedQuantity: 12,
    safetyStock: 40,
    minStock: 30,
    maxStock: 300,
    reorderPoint: 80,
    unit: 'kg',
    location: 'dry-storage',
    supplier: {
      name: 'Nippon Rice Wholesalers',
      contact: 'Kenji Sato',
      phone: '+91 99124 88390',
      email: 'sato@nipponrice.co.jp',
      leadTimeDays: 5,
      preferred: true,
    },
    mfgDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
    recipeMenuIds: ['item-1', 'item-2'],
    wasteLogs: [],
  },
];

export const SEED_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Ananya Deshmukh',
    role: 'manager',
    roleId: 'role-manager',
    email: 'ananya.d@sorasushi.com',
    phone: '9885501234',
    status: 'active',
    attendance: 'present',
    branch: 'Main Branch',
    hourlyRate: 250,
    weeklyHoursLimit: 40,
    emergencyContact: 'Father - +91 98855 01111',
    performance: { tasksCompleted: 10, ordersHandled: 200, avgResponseTimeMin: 12, shiftReliabilityPct: 98, kitchenThroughputPct: 0 }
  },
  {
    id: 'staff-2',
    name: 'Rahul Kulkarni',
    role: 'kitchen-staff',
    roleId: 'role-chef',
    email: 'rahul.k@sorasushi.com',
    phone: '9123456780',
    status: 'active',
    attendance: 'late',
    branch: 'Main Branch',
    hourlyRate: 350,
    weeklyHoursLimit: 45,
    emergencyContact: 'Wife - +91 91234 50000',
    performance: { tasksCompleted: 8, ordersHandled: 150, avgResponseTimeMin: 15, shiftReliabilityPct: 95, kitchenThroughputPct: 88 }
  },
];

export const SEED_SHIFTS: Shift[] = [
  {
    id: 'shift-1',
    staffId: 'staff-1',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    station: 'Counter',
    status: 'scheduled',
  },
  {
    id: 'shift-2',
    staffId: 'staff-2',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '18:00',
    station: 'Sushi Station',
    status: 'scheduled',
  },
];

export const SEED_ROLES: RoleDefinition[] = [
  {
    id: 'role-owner',
    name: 'Owner / Administrator',
    description: 'Full administrative controls across all branches, finance modules, and billing settings.',
    permissions: { menuControl: true, staffControl: true, inventoryControl: true, settingsControl: true, financeControl: true },
  },
  {
    id: 'role-manager',
    name: 'Store Manager',
    description: 'Manages staff directory rosters, edits categories structures, and reviews inventory limits.',
    permissions: { menuControl: true, staffControl: true, inventoryControl: true, settingsControl: true, financeControl: false },
  },
];

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Rohan Mehta',
    phone: '9876543210',
    email: 'rohan.mehta@gmail.com',
    preferredBranch: 'Downtown Flagship',
    preferredCuisine: 'Japanese Fusion',
    favoriteItems: ['Tuna Nigiri', 'Truffle Edamame', 'Spicy Salmon Roll'],
    averageSpend: 3200,
    visitFrequency: 'Weekly',
    lastVisit: '2026-07-18',
    loyaltyStatus: 'VIP',
    joinDate: '2025-01-10',
    riskScore: 8,
    engagementScore: 94,
    lifetimeValue: 84500,
    tags: ['Regular', 'Wine Lover', 'Weekend Diners'],
    notes: [
      {
        id: 'n-001',
        type: 'preference',
        author: 'Chef Kenji',
        content: 'Prefers low-sodium soy sauce. Loves counter seating.',
        timestamp: '2026-06-15 19:30',
      }
    ],
    consent: { email: true, sms: true, whatsapp: true },
    outreach: { preferredWindow: '18:00 - 20:00', timezone: 'IST', language: 'English', nextRemindSuggestion: 'Suggest weekend wine pairings' }
  },
];

export const SEED_SEGMENTS: CustomerSegment[] = [
  { id: 'seg-vip', name: 'VIP Guests', description: 'Customers with LTV > ₹50,000 and low churn risk', rulesCount: 2, customerCount: 1 },
  { id: 'seg-high', name: 'High Spenders', description: 'Average order value above ₹2,500', rulesCount: 1, customerCount: 2 },
];
