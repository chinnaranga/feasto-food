/**
 * @deprecated Legacy Firestore Customer Repository.
 * Do not add new Firestore queries here.
 * Migrating to backend REST APIs (`/api/v1/users/me`, `/api/v1/orders`).
 */
import {
  doc,
  collection,
  onSnapshot,
  getDoc,
  setDoc,
  query,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export interface CustomerProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  loyaltyPoints: number;
}

export const customerRepository = {
  async fetchUserProfile(userId: string): Promise<CustomerProfileData | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as CustomerProfileData;
      }
    } catch (e) {
      // Fallback null if document not created yet
    }
    return null;
  },

  subscribeRestaurants(onUpdate: (restaurants: any[]) => void): Unsubscribe {
    const restRef = collection(db, 'restaurants');
    return onSnapshot(
      restRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribeCustomerOrders(userId: string, onUpdate: (orders: any[]) => void): Unsubscribe {
    if (!userId) {
      onUpdate([]);
      return () => {};
    }
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribeUserAddresses(userId: string, onUpdate: (addresses: any[]) => void): Unsubscribe {
    if (!userId) {
      onUpdate([]);
      return () => {};
    }
    const addrRef = collection(db, 'users', userId, 'addresses');
    return onSnapshot(
      addrRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },
};

export default customerRepository;
