import { useCartStore } from '@/store/cartStore';
import { VoiceContextPayload } from '../api/voiceApi';

/**
 * Gathers active application context in real time to ground voice reasoning.
 */
export function getActiveVoiceContext(
  recentHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): VoiceContextPayload {
  const path = window.location.pathname;

  // Extract cart state
  const cartState = useCartStore.getState();
  const cartItems = cartState.items.map((ci) => ({
    id: ci.item.id,
    name: ci.item.name,
    price: ci.unitPrice,
    quantity: ci.quantity,
  }));

  const cartPayload = {
    restaurantId: cartState.items[0]?.restaurantId || undefined,
    restaurantName: cartState.items[0]?.restaurantName || undefined,
    totalPrice: cartState.getTotal(),
    itemCount: cartState.getItemCount(),
    items: cartItems,
  };

  // Extract restaurant context if user is viewing a restaurant page
  let currentRestaurant: { id: string; name: string } | undefined = undefined;
  const restaurantMatch = path.match(/\/restaurants\/([a-zA-Z0-9_-]+)/);
  if (restaurantMatch) {
    const restaurantId = restaurantMatch[1];
    currentRestaurant = {
      id: restaurantId,
      name: cartState.items[0]?.restaurantName || 'Current Kitchen',
    };
  }

  // Active tracking context if on tracking page
  let currentOrder: { orderId?: string; orderNumber?: string; status?: string } | undefined = undefined;
  const orderMatch = path.match(/\/orders\/([a-zA-Z0-9_-]+)/);
  if (orderMatch) {
    currentOrder = {
      orderId: orderMatch[1],
      orderNumber: orderMatch[1],
      status: 'active',
    };
  }

  return {
    currentPage: getPageNameFromPath(path),
    currentRoute: path,
    currentRestaurant,
    currentCart: cartPayload,
    currentOrder,
    recentConversation: recentHistory.slice(-4),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function getPageNameFromPath(path: string): string {
  if (path === '/') return 'Home / Discovery';
  if (path.startsWith('/restaurants/')) return 'Restaurant Menu Detail';
  if (path.startsWith('/restaurants')) return 'Restaurant Directory';
  if (path.startsWith('/cart')) return 'Shopping Cart';
  if (path.startsWith('/checkout')) return 'Checkout';
  if (path.startsWith('/orders')) return 'Order Telemetry & Tracking';
  if (path.startsWith('/discover')) return 'Food Discovery';
  return path;
}
