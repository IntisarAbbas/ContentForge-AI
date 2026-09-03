import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

const CHATS_COLLECTION = "chats";

function requireUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in first.");
  }

  return user;
}

export async function createChat(firstMessage = "") {
  const user = requireUser();

  const cleanMessage = firstMessage.trim();

  const title = cleanMessage
    ? cleanMessage.length > 45
      ? `${cleanMessage.slice(0, 45)}...`
      : cleanMessage
    : "New Chat";

  const chatRef = await addDoc(
    collection(db, CHATS_COLLECTION),
    {
      userId: user.uid,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: cleanMessage || "",
    }
  );

  return chatRef.id;
}

export async function getChats() {
  const user = requireUser();

  const chatsQuery = query(
    collection(db, CHATS_COLLECTION),
    where("userId", "==", user.uid),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(chatsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.().toLocaleString() || "",
      updatedAt:
        data.updatedAt?.toDate?.().toLocaleString() || "",
    };
  });
}

export async function addMessage(
  chatId,
  role,
  content
) {
  const user = requireUser();

  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  if (!content?.trim()) {
    return;
  }

  await addDoc(
    collection(
      db,
      CHATS_COLLECTION,
      chatId,
      "messages"
    ),
    {
      userId: user.uid,
      role,
      content,
      createdAt: serverTimestamp(),
    }
  );

  await updateDoc(
    doc(db, CHATS_COLLECTION, chatId),
    {
      updatedAt: serverTimestamp(),
      lastMessage: content.slice(0, 120),
    }
  );
}

export async function getChatMessages(chatId) {
  const user = requireUser();

  if (!chatId) {
    return [];
  }

  const messagesQuery = query(
    collection(
      db,
      CHATS_COLLECTION,
      chatId,
      "messages"
    ),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(messagesQuery);

  return snapshot.docs
    .map((item) => {
      const data = item.data();

      return {
        id: item.id,
        ...data,
      };
    })
    .filter((message) => message.userId === user.uid);
}

export async function deleteChat(chatId) {
  requireUser();

  if (!chatId) {
    return;
  }

  const messagesRef = collection(
    db,
    CHATS_COLLECTION,
    chatId,
    "messages"
  );

  const messagesSnapshot = await getDocs(
    query(messagesRef)
  );

  await Promise.all(
    messagesSnapshot.docs.map((item) =>
      deleteDoc(
        doc(
          db,
          CHATS_COLLECTION,
          chatId,
          "messages",
          item.id
        )
      )
    )
  );

  await deleteDoc(
    doc(db, CHATS_COLLECTION, chatId)
  );
}

export async function clearChats() {
  const user = requireUser();

  const chatsQuery = query(
    collection(db, CHATS_COLLECTION),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(chatsQuery);

  for (const chat of snapshot.docs) {
    await deleteChat(chat.id);
  }
}