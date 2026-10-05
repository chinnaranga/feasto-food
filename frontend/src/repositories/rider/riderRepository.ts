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
import type { DeliveryOfferItem } from '../../rider/types/orders';
import type { ActiveDeliveryTask } from '../../rider/types/active';
import type { EarningsSummary, RiderWalletState } from '../../rider/types/earnings';

export const riderRepository = {
  subscribeRiderProfile(riderId: string, onUpdate: (profile: any) => void): Unsubscribe {
    if (!riderId) {
      onUpdate(null);
      return () => {};
    }
    const riderRef = doc(db, 'riders', riderId);
    return onSnapshot(
      riderRef,
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

  subscribeAvailableOffers(zoneName: string, onUpdate: (offers: DeliveryOfferItem[]) => void): Unsubscribe {
    const offersRef = collection(db, 'deliveryOffers');
    const q = query(offersRef, where('status', '==', 'available'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as DeliveryOfferItem[];
        onUpdate(list);
      },
      () => {
        onUpdate([]);
      }
    );
  },

  subscribeActiveDeliveryTask(riderId: string, onUpdate: (task: ActiveDeliveryTask | null) => void): Unsubscribe {
    if (!riderId) {
      onUpdate(null);
      return () => {};
    }
    const activeRef = collection(db, 'activeDeliveries');
    const q = query(activeRef, where('riderId', '==', riderId), where('status', 'in', ['in_transit', 'pickup', 'assigned']));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          onUpdate({ id: docSnap.id, ...docSnap.data() } as ActiveDeliveryTask);
        } else {
          onUpdate(null);
        }
      },
      () => {
        onUpdate(null);
      }
    );
  },

  subscribeRiderEarnings(riderId: string, onUpdate: (data: { summary: EarningsSummary; wallet: RiderWalletState } | null) => void): Unsubscribe {
    if (!riderId) {
      onUpdate(null);
      return () => {};
    }
    const earnRef = doc(db, 'riderEarnings', riderId);
    return onSnapshot(
      earnRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as any);
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

export default riderRepository;
