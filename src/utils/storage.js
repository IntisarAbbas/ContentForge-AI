import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

const HISTORY_COLLECTION = "history";

const requireUser = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in first.");
  }

  return user;
};

export const getHistory = async () => {
  const user = requireUser();

  const historyQuery = query(
    collection(db, HISTORY_COLLECTION),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(historyQuery);

  const items = snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.().toLocaleString() ||
        "Recently",
      createdAtTimestamp:
        data.createdAt?.toMillis?.() || 0,
    };
  });

  return items.sort(
    (a, b) =>
      b.createdAtTimestamp - a.createdAtTimestamp
  );
};

export const saveToHistory = async (item) => {
  const user = requireUser();

  await addDoc(collection(db, HISTORY_COLLECTION), {
    userId: user.uid,
    category: item.category || "AI Generation",
    title:
      item.title ||
      item.category ||
      "AI Generation",
    prompt: item.prompt || "",
    result: item.result || "",
    createdAt: new Date(),
  });
};

export const deleteHistory = async (id) => {
  requireUser();

  await deleteDoc(
    doc(db, HISTORY_COLLECTION, id)
  );
};

export const clearHistory = async () => {
  const user = requireUser();

  const historyQuery = query(
    collection(db, HISTORY_COLLECTION),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(historyQuery);

  await Promise.all(
    snapshot.docs.map((item) =>
      deleteDoc(
        doc(db, HISTORY_COLLECTION, item.id)
      )
    )
  );
};