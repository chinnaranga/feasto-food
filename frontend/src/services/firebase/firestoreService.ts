/**
 * @deprecated Legacy Firestore DB service.
 * Do not add new Firestore reads/writes.
 * Application data is migrating to MongoDB Express backend APIs (`/api/v1/*`).
 */
import { db } from './index';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { MOCK_RESTAURANTS } from '../../data/restaurants';

export const firestoreService = {
  // Seeder to populate initial menus and restaurants list if DB collection is empty
  ensureDefaultDataSeeded: async (): Promise<void> => {
    try {
      const colRef = collection(db, 'restaurants');
      const snapshot = await getDocs(colRef);
      
      if (snapshot.empty) {
        console.log('🌱 Cloud Firestore: Initializing empty database with menu templates...');
        for (const rest of MOCK_RESTAURANTS) {
          // Keep structure identical to types definition
          await setDoc(doc(db, 'restaurants', rest.id), rest);
        }
        console.log('✅ Cloud Firestore: Menu templates populated successfully.');
      }
    } catch (e) {
      console.error('❌ Cloud Firestore seeding error:', e);
    }
  },

  // Document listener helper
  listenDoc: (
    path: string,
    onNext: (snapshot: DocumentSnapshot<DocumentData>) => void,
    onError?: (error: Error) => void
  ) => {
    const docRef = doc(db, path);
    return onSnapshot(docRef, onNext, onError);
  },

  // Collection listener helper
  listenCollection: (
    path: string,
    onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
    onError?: (error: Error) => void,
    queryConstraints: any[] = []
  ) => {
    const colRef = collection(db, path);
    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;
    return onSnapshot(q, onNext, onError);
  },

  // Set document data helper
  setDocument: async (path: string, data: any): Promise<void> => {
    const docRef = doc(db, path);
    await setDoc(docRef, data, { merge: true });
  },

  // Update document helper
  updateDocument: async (path: string, data: any): Promise<void> => {
    const docRef = doc(db, path);
    await updateDoc(docRef, data);
  },

  // Delete document helper
  deleteDocument: async (path: string): Promise<void> => {
    const docRef = doc(db, path);
    await deleteDoc(docRef);
  },
};
export default firestoreService;
