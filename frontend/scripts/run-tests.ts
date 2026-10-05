// @ts-nocheck
// ─── Setup Global Mocks for Node Environment ───────────────────────────────────
const mockLocalStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockLocalStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockLocalStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockLocalStorage[key];
  },
  clear: () => {
    for (const key in mockLocalStorage) delete mockLocalStorage[key];
  },
};

(global as any).localStorage = localStorageMock;
(global as any).sessionStorage = localStorageMock;
(global as any).window = {
  localStorage: localStorageMock,
  sessionStorage: localStorageMock,
  location: {
    pathname: '/mock-test-path',
    search: '',
  },
  document: {
    documentElement: {
      classList: {
        add: () => {},
        remove: () => {},
      },
    },
  },
} as any;

// Silence the warning from zustand persist during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('zustand persist middleware')) {
    return;
  }
  originalWarn(...args);
};

// ─── Imports ───────────────────────────────────────────────────────────────────
import assert from 'assert';
import { useAuthStore } from '../src/store/authStore';
import { useCartStore } from '../src/store/cartStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { useUserStore } from '../src/store/userStore';
import { useDiscoveryStore } from '../src/store/discoveryStore';
import { analytics } from '../src/services/analytics';
import { isTrackingAllowed } from '../src/utils/analytics/analyticsGuard';
import { z } from 'zod';

// ─── Custom Testing Harness ───────────────────────────────────────────────────
let testsPassed = 0;
let totalTests = 0;

function describe(suiteName: string, suiteFn: () => void) {
  console.log(`\n\x1b[36m⚡ Running Suite: ${suiteName}\x1b[0m`);
  suiteFn();
}

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    const result = fn();
    if (result instanceof Promise) {
      // Async test check
      result
        .then(() => {
          testsPassed++;
          console.log(`  \x1b[32m✓\x1b[0m ${name}`);
        })
        .catch((err) => {
          console.error(`  \x1b[31m✗\x1b[0m ${name} (failed async)`);
          console.error(err);
          process.exit(1);
        });
    } else {
      testsPassed++;
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    }
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ─── Test Suite: Authentication ────────────────────────────────────────────────
describe('Authentication Flow (authStore)', () => {
  test('verify initial state', () => {
    const state = useAuthStore.getState();
    assert.strictEqual(state.isAuthenticated, false);
    assert.strictEqual(state.token, null);
    assert.strictEqual(state.user, null);
  });

  test('login updates state correctly', () => {
    const store = useAuthStore;
    store.getState().login('test-token', { uid: 'u1', email: 'test@feasto.ai', displayName: 'Jane' });
    const state = store.getState();
    assert.strictEqual(state.isAuthenticated, true);
    assert.strictEqual(state.token, 'test-token');
    assert.deepStrictEqual(state.user, { uid: 'u1', email: 'test@feasto.ai', displayName: 'Jane' });
  });

  test('logout clears auth credentials', () => {
    const store = useAuthStore;
    store.getState().logout();
    const state = store.getState();
    assert.strictEqual(state.isAuthenticated, false);
    assert.strictEqual(state.token, null);
    assert.strictEqual(state.user, null);
  });

  test('mockAuthenticate executes login flow', async () => {
    const store = useAuthStore;
    await store.getState().mockAuthenticate('test@feasto.ai', 'Test User');
    const state = store.getState();
    assert.strictEqual(state.isAuthenticated, true);
    assert.strictEqual(state.token, 'mock-jwt-token-xyz');
    assert.strictEqual(state.user?.email, 'test@feasto.ai');
    assert.strictEqual(state.user?.displayName, 'Test User');
  });
});

// ─── Test Suite: Discovery ─────────────────────────────────────────────────────
describe('Search & Discovery (discoveryStore)', () => {
  test('initial query and cuisine state are empty', () => {
    const state = useDiscoveryStore.getState();
    assert.strictEqual(state.searchQuery, '');
    assert.strictEqual(state.selectedCuisine, null);
  });

  test('setSearchQuery correctly updates state', () => {
    const store = useDiscoveryStore;
    store.getState().setSearchQuery('Organic Salads');
    assert.strictEqual(store.getState().searchQuery, 'Organic Salads');
  });

  test('setSelectedCuisine updates selected cuisine', () => {
    const store = useDiscoveryStore;
    store.getState().setSelectedCuisine('Japanese');
    assert.strictEqual(store.getState().selectedCuisine, 'Japanese');
  });
});

// ─── Test Suite: Cart Operations ───────────────────────────────────────────────
describe('Cart Operations (cartStore)', () => {
  test('verify initial empty cart state', () => {
    const state = useCartStore.getState();
    assert.strictEqual(state.items.length, 0);
    assert.strictEqual(state.promoCode, '');
  });

  test('addItem appends item and updates quantity', () => {
    const store = useCartStore;
    const testItem = {
      cartItemId: 'item-1',
      restaurantId: 'sora-sushi',
      restaurantName: 'Sora Sushi',
      item: { id: 'dish-1', name: 'Salmon Maki', price: 250, description: 'Sushi', isVeg: false, category: 'Main' },
      quantity: 2,
      selectedAddons: [],
      spiceLevel: 'medium',
      specialInstructions: 'extra soy',
      unitPrice: 250,
      totalPrice: 500,
    };
    store.getState().addItem(testItem);
    assert.strictEqual(store.getState().items.length, 1);
    assert.strictEqual(store.getState().items[0].quantity, 2);
    assert.strictEqual(store.getState().items[0].totalPrice, 500);

    // Duplicate item triggers quantity bump
    store.getState().addItem(testItem);
    assert.strictEqual(store.getState().items.length, 1);
    assert.strictEqual(store.getState().items[0].quantity, 4);
    assert.strictEqual(store.getState().items[0].totalPrice, 1000);
  });

  test('updateQuantity adjusts quantity correctly', () => {
    const store = useCartStore;
    store.getState().updateQuantity('item-1', 5);
    assert.strictEqual(store.getState().items[0].quantity, 5);
    assert.strictEqual(store.getState().items[0].totalPrice, 1250);
  });

  test('applyPromo codes validator logic', () => {
    const store = useCartStore;
    const invalidResult = store.getState().applyPromo('WRONGCODE');
    assert.strictEqual(invalidResult.success, false);
    assert.strictEqual(store.getState().promoCode, '');

    const validResult = store.getState().applyPromo('FEASTO20');
    assert.strictEqual(validResult.success, true);
    assert.strictEqual(store.getState().promoCode, 'FEASTO20');
    assert.strictEqual(store.getState().promoDiscount, 20);
  });

  test('removeItem removes item from items list', () => {
    const store = useCartStore;
    store.getState().removeItem('item-1');
    assert.strictEqual(store.getState().items.length, 0);
  });
});

// ─── Test Suite: User Store & Profile Address ──────────────────────────────────
describe('User Store & Profile Updates (userStore)', () => {
  test('updateProfile correctly saves name and email updates', () => {
    const store = useUserStore;
    store.getState().updateProfile({ name: 'Alex Cooper', email: 'alex@cooper.ai' });
    const profile = store.getState().profile;
    assert.strictEqual(profile.name, 'Alex Cooper');
    assert.strictEqual(profile.email, 'alex@cooper.ai');
  });

  test('addAddress appends a address to addresses list', () => {
    const store = useUserStore;
    const countBefore = store.getState().addresses.length;
    store.getState().addAddress({
      label: 'Home 2',
      fullAddress: 'No 45, Green Meadows, outer ring rd',
      city: 'Bengaluru',
      pincode: '560037',
      landmark: 'Multiplex',
      isDefault: false,
    });
    assert.strictEqual(store.getState().addresses.length, countBefore + 1);
  });

  test('toggleFavorite toggles restaurant ID favorites list', () => {
    const store = useUserStore;
    const initialFavorites = [...store.getState().favorites];
    store.getState().toggleFavorite('burger-joint');
    assert.ok(store.getState().favorites.includes('burger-joint'));
    store.getState().toggleFavorite('burger-joint');
    assert.deepStrictEqual(store.getState().favorites, initialFavorites);
  });
});

// ─── Test Suite: Settings Toggles & Preferences ───────────────────────────────
describe('Settings & App Customizations (settingsStore)', () => {
  test('setLanguage and setRegion changes states', () => {
    const store = useSettingsStore;
    store.getState().setLanguage('hi');
    assert.strictEqual(store.getState().language, 'hi');
    store.getState().setRegion('us');
    assert.strictEqual(store.getState().region, 'us');
  });

  test('updateAccessibility correctly configures options', () => {
    const store = useSettingsStore;
    store.getState().updateAccessibility({ reducedMotion: true, largeText: true });
    assert.strictEqual(store.getState().accessibility.reducedMotion, true);
    assert.strictEqual(store.getState().accessibility.largeText, true);
  });

  test('toggleTwoFactor updates 2FA state', () => {
    const store = useSettingsStore;
    const initial = store.getState().twoFactorEnabled;
    store.getState().toggleTwoFactor();
    assert.strictEqual(store.getState().twoFactorEnabled, !initial);
  });
});

// ─── Test Suite: Zod Schema Validators ─────────────────────────────────────────
describe('Zod Validation Schemas', () => {
  const accountDetailsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  });

  test('valid account data passes validation', () => {
    const validData = {
      name: 'Ravi Patichinnaranga',
      email: 'ravi.patichinnaranga@feasto.ai',
      phone: '9876543210',
    };
    const parsed = accountDetailsSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  test('invalid email returns validation error', () => {
    const invalidData = {
      name: 'Ravi',
      email: 'not-an-email',
      phone: '9876543210',
    };
    const parsed = accountDetailsSchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false);
    if (!parsed.success) {
      const emailErr = parsed.error.format().email?._errors[0];
      assert.strictEqual(emailErr, 'Enter a valid email address');
    }
  });

  test('invalid phone range fails regex format check', () => {
    const invalidData = {
      name: 'Ravi',
      email: 'ravi@gmail.com',
      phone: '5876543210', // Starts with 5 (needs to start with 6-9 in India)
    };
    const parsed = accountDetailsSchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false);
  });
});

// ─── Test Suite: Analytics (services/analytics) ──────────────────────────────
describe('Product Analytics & Tracking Privacy (analyticsClient)', () => {
  test('isTrackingAllowed respects Settings privacy choices', () => {
    const settingsStore = useSettingsStore.getState();
    
    // Set analytics to true
    settingsStore.updatePrivacy({ dataUsageAnalytics: true });
    assert.strictEqual(isTrackingAllowed(), true);

    // Disable analytics tracking
    settingsStore.updatePrivacy({ dataUsageAnalytics: false });
    assert.strictEqual(isTrackingAllowed(), false);
  });

  test('analytics.trackEvent sends events when allowed', () => {
    const settingsStore = useSettingsStore.getState();
    settingsStore.updatePrivacy({ dataUsageAnalytics: true });
    let sentPayload: any = null;
    (analytics as any).sendTelemetry = (payload: any) => {
      sentPayload = payload;
    };

    analytics.trackEvent('add_to_cart', {
      itemId: 'dish-1',
      itemName: 'Salmon Maki',
      price: 250,
      restaurantId: 'sora-sushi',
      quantity: 1
    }, 'Test Restaurant Menu');

    assert.ok(sentPayload);
    assert.strictEqual(sentPayload.event, 'add_to_cart');
    assert.strictEqual(sentPayload.properties.itemId, 'dish-1');
  });
});


// ─── Finish Runner ─────────────────────────────────────────────────────────────
setTimeout(() => {
  console.log(`\n\x1b[32m🎉 All ${testsPassed}/${totalTests} unit and integration tests passed successfully!\x1b[0m\n`);
  process.exit(0);
}, 1200);
