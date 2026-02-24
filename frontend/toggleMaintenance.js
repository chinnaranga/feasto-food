import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBvcmUBlpqK2QvVPuk-knI5ALQQf_MCoFI",
    authDomain: "food-platform-b022f.firebaseapp.com",
    projectId: "food-platform-b022f",
    storageBucket: "food-platform-b022f.appspot.com",
    messagingSenderId: "877744102586",
    appId: "1:877744102586:web:ff2a1200e6cc7baa9bb683",
    measurementId: "G-G8LVRKTW15",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        await setDoc(doc(db, "app_config", "global"), {
            maintenance: false,
            message: ""
        }, { merge: true });
        console.log("Maintenance mode reverted via web SDK.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
