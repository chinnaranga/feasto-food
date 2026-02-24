import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { loadAIMemory } from "./aiMemory";

export async function syncAIMemoryToCloud(uid) {
    if (!uid) return;

    const localMemory = loadAIMemory();
    const ref = doc(db, "users", uid, "ai_memory", "profile");

    try {
        await setDoc(ref, {
            ...localMemory,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Failed to sync AI memory to cloud:", error);
    }
}

export async function loadAIMemoryFromCloud(uid) {
    if (!uid) return null;

    try {
        const ref = doc(db, "users", uid, "ai_memory", "profile");
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Failed to load AI memory from cloud:", error);
        return null;
    }
}
