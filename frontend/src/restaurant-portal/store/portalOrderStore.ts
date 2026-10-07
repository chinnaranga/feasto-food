import { create } from "zustand";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export type PortalOrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled";

export interface PortalOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  dietary?: string[];
}

export interface PortalOrder {
  id: string;
  orderNumber?: string;
  restaurantId: string;
  restaurantName: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: PortalOrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  totalAmount?: number;
  status: PortalOrderStatus;
  eta: number;
  estimatedPrepTimeMins?: number;
  address: {
    fullAddress: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  deliveryAddress?: string;
  paymentMethod: string;
  placedAt: string;
  acceptedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
  isPriority?: boolean;
}

interface PortalOrderState {
  orders: PortalOrder[];
  isLoading: boolean;
  selectedOrderId: string | null;
  statusFilter: PortalOrderStatus | "all";
  setStatusFilter: (filter: PortalOrderStatus | "all") => void;
  selectOrder: (id: string | null) => void;
  acceptOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: PortalOrderStatus, eta?: number) => Promise<void>;
  rejectOrder: (orderId: string, reason?: string) => Promise<void>;
  markPriority: (orderId: string, priority: boolean) => Promise<void>;
}

let _unsubOrders: (() => void) | null = null;

export function subscribePortalOrders(restaurantId: string): () => void {
  if (_unsubOrders) { _unsubOrders(); _unsubOrders = null; }
  const q = query(collection(db, "orders"), orderBy("placedAt", "desc"));
  _unsubOrders = onSnapshot(
    q,
    (snap) => {
      const all: PortalOrder[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (!restaurantId || d.restaurantId === restaurantId) {
          all.push({
            ...d,
            id: docSnap.id,
            placedAt:
              d.placedAt instanceof Timestamp
                ? d.placedAt.toDate().toISOString()
                : d.placedAt ?? new Date().toISOString(),
          } as PortalOrder);
        }
      });
      usePortalOrderStore.setState({ orders: all, isLoading: false });
    },
    (err) => {
      console.warn("Firestore orders listener error:", err.message);
      usePortalOrderStore.setState({ isLoading: false });
    }
  );
  return () => { if (_unsubOrders) { _unsubOrders(); _unsubOrders = null; } };
}

export const usePortalOrderStore = create<PortalOrderState>((set, get) => ({
  orders: [],
  isLoading: true,
  selectedOrderId: null,
  statusFilter: "all",

  setStatusFilter: (filter) => set({ statusFilter: filter }),
  selectOrder: (id) => set({ selectedOrderId: id }),

  acceptOrder: async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "confirmed", acceptedAt: serverTimestamp() });
      const order = get().orders.find((o) => o.id === orderId);
      if (order?.customerId) {
        await updateDoc(doc(db, `users/${order.customerId}/orders/${orderId}`), { status: "confirmed" });
      }
    } catch (err) { console.error("acceptOrder failed:", err); }
  },

  updateOrderStatus: async (orderId, status, eta) => {
    const now = serverTimestamp();
    const payload: Record<string, unknown> = { status };
    if (eta !== undefined) payload.eta = eta;
    if (status === "preparing") payload.preparingAt = now;
    if (status === "ready")     payload.readyAt     = now;
    if (status === "picked_up") payload.pickedUpAt  = now;
    if (status === "delivered") payload.deliveredAt = now;
    if (status === "cancelled") payload.cancelledAt = now;
    try {
      await updateDoc(doc(db, "orders", orderId), payload);
      const order = get().orders.find((o) => o.id === orderId);
      if (order?.customerId) {
        const cp: Record<string, unknown> = { status };
        if (eta !== undefined)      cp.eta         = eta;
        if (status === "delivered") cp.deliveredAt = now;
        if (status === "cancelled") cp.cancelledAt = now;
        await updateDoc(doc(db, `users/${order.customerId}/orders/${orderId}`), cp);
      }
    } catch (err) { console.error("updateOrderStatus failed:", err); }
  },

  rejectOrder: async (orderId, _reason) => { await get().updateOrderStatus(orderId, "cancelled"); },

  markPriority: async (orderId, priority) => {
    try { await updateDoc(doc(db, "orders", orderId), { isPriority: priority }); }
    catch (err) { console.error("markPriority failed:", err); }
  },
}));

export default usePortalOrderStore;
