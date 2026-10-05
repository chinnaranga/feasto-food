import { EventNames } from './eventNames';

export interface BaseEventPayload {
  timestamp: string;
  path: string;
  pageName: string;
  userRole: 'guest' | 'user';
  userId?: string;
  sessionId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
}

export interface PageViewPayload {
  referrer?: string;
}

export interface HeroCtaClickPayload {
  ctaLabel: string;
  section: string;
}

export interface SearchSubmitPayload {
  queryText: string;
  filterState?: Record<string, any>;
  category?: string;
}

export interface RestaurantCardClickPayload {
  restaurantId: string;
  restaurantName: string;
  index?: number;
  tags?: string[];
}

export interface MenuSectionViewPayload {
  sectionName: string;
  restaurantId: string;
}

export interface MenuItemClickPayload {
  itemId: string;
  itemName: string;
  price: number;
  restaurantId: string;
}

export interface AddToCartPayload {
  itemId: string;
  itemName: string;
  price: number;
  restaurantId: string;
  quantity: number;
  addons?: string[];
}

export interface RemoveFromCartPayload {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface CartOpenPayload {
  itemsCount: number;
  subtotal: number;
}

export interface QuantityChangePayload {
  itemId: string;
  newQuantity: number;
  action: 'increment' | 'decrement';
}

export interface CheckoutStartedPayload {
  itemsCount: number;
  subtotal: number;
}

export interface AddressSelectedPayload {
  addressId: string;
  label: string;
}

export interface PaymentMethodSelectedPayload {
  paymentMethod: string;
}

export interface OrderCompletedPayload {
  orderId: string;
  total: number;
  paymentMethod: string;
  itemsCount: number;
}

export interface OrderReorderedPayload {
  originalOrderId: string;
  restaurantId: string;
}

export interface SettingsUpdatedPayload {
  section: 'account' | 'security' | 'privacy';
  settingKey: string;
  newValue: any;
}

export interface SupportRequestedPayload {
  ticketId?: string;
  category: string;
  subject: string;
}

export interface FunnelStepPayload {
  funnelName: 'conversion' | 'auth' | 'search';
  stepIndex: number;
  stepName: string;
  metadata?: Record<string, any>;
}

// Map EventNames to their strictly typed payload shape
export interface EventPayloadMap {
  [EventNames.PAGE_VIEW]: PageViewPayload;
  [EventNames.HERO_CTA_CLICK]: HeroCtaClickPayload;
  [EventNames.SEARCH_SUBMIT]: SearchSubmitPayload;
  [EventNames.RESTAURANT_CARD_CLICK]: RestaurantCardClickPayload;
  [EventNames.MENU_SECTION_VIEW]: MenuSectionViewPayload;
  [EventNames.MENU_ITEM_CLICK]: MenuItemClickPayload;
  [EventNames.ADD_TO_CART]: AddToCartPayload;
  [EventNames.REMOVE_FROM_CART]: RemoveFromCartPayload;
  [EventNames.CART_OPEN]: CartOpenPayload;
  [EventNames.QUANTITY_CHANGE]: QuantityChangePayload;
  [EventNames.CHECKOUT_STARTED]: CheckoutStartedPayload;
  [EventNames.ADDRESS_SELECTED]: AddressSelectedPayload;
  [EventNames.PAYMENT_METHOD_SELECTED]: PaymentMethodSelectedPayload;
  [EventNames.ORDER_COMPLETED]: OrderCompletedPayload;
  [EventNames.ORDER_REORDERED]: OrderReorderedPayload;
  [EventNames.SETTINGS_UPDATED]: SettingsUpdatedPayload;
  [EventNames.SUPPORT_REQUESTED]: SupportRequestedPayload;
  [EventNames.FUNNEL_STEP]: FunnelStepPayload;
}

export default BaseEventPayload;
