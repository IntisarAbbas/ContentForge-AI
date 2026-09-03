import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { auth } from "../firebase";

export async function saveHistory(data) {
  const user = auth.currentUser;

  if (!user) return;

  await addDoc(collection(db, "history"), {
    uid: user.uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getHistory() {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "history"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}