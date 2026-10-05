export const EventNames = {
  PAGE_VIEW: 'page_view',
  HERO_CTA_CLICK: 'hero_cta_click',
  SEARCH_SUBMIT: 'search_submit',
  RESTAURANT_CARD_CLICK: 'restaurant_card_click',
  MENU_SECTION_VIEW: 'menu_section_view',
  MENU_ITEM_CLICK: 'menu_item_click',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CART_OPEN: 'cart_open',
  QUANTITY_CHANGE: 'quantity_change',
  CHECKOUT_STARTED: 'checkout_started',
  ADDRESS_SELECTED: 'address_selected',
  PAYMENT_METHOD_SELECTED: 'payment_method_selected',
  ORDER_COMPLETED: 'order_completed',
  ORDER_REORDERED: 'order_reordered',
  SETTINGS_UPDATED: 'settings_updated',
  SUPPORT_REQUESTED: 'support_requested',
  FUNNEL_STEP: 'funnel_step',
} as const;

export type EventName = typeof EventNames[keyof typeof EventNames];

export default EventNames;
