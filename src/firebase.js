import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAw0wBz_XCg5mquR27bVJiUIadLYoMbtAs",
  authDomain: "contentforge-ai-d2a85.firebaseapp.com",
  projectId: "contentforge-ai-d2a85",
  storageBucket:
    "contentforge-ai-d2a85.firebasestorage.app",
  messagingSenderId: "594222068850",
  appId:
    "1:594222068850:web:4594473d6f289adc7e3eeb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;