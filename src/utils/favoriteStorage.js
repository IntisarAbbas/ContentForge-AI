import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, auth, storage } from "../firebase";

const FAVORITES_COLLECTION = "favorites";

function requireUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in first.");
  }

  return user;
}

export async function getFavorites() {
  const user = requireUser();

  const favoritesQuery = query(
    collection(db, FAVORITES_COLLECTION),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(favoritesQuery);

  const favorites = snapshot.docs.map((item) => {
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

  return favorites.sort(
    (a, b) =>
      b.createdAtTimestamp - a.createdAtTimestamp
  );
}

async function uploadImage(image, userId) {
  if (!image) {
    return "";
  }

  /*
   * If the image is already a normal URL,
   * save the URL directly.
   */
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  /*
   * If the generated image is a data URL,
   * upload it to Firebase Storage.
   */
  if (image.startsWith("data:")) {
    const response = await fetch(image);
    const blob = await response.blob();

    const extension =
      blob.type === "image/jpeg"
        ? "jpg"
        : blob.type === "image/webp"
        ? "webp"
        : "png";

    const fileRef = ref(
      storage,
      `favorites/${userId}/${Date.now()}.${extension}`
    );

    await uploadBytes(fileRef, blob, {
      contentType:
        blob.type || "image/png",
    });

    return await getDownloadURL(fileRef);
  }

  return "";
}

export async function addFavorite({
  type,
  title,
  prompt = "",
  content = "",
  image = "",
}) {
  const user = requireUser();

  const imageUrl = image
    ? await uploadImage(image, user.uid)
    : "";

  const favoriteRef = await addDoc(
    collection(db, FAVORITES_COLLECTION),
    {
      userId: user.uid,
      type: type || "AI Content",
      title: title || "Favorite",
      prompt,
      content,
      image: imageUrl,
      createdAt: new Date(),
    }
  );

  return favoriteRef.id;
}

export async function removeFavorite(id) {
  requireUser();

  await deleteDoc(
    doc(db, FAVORITES_COLLECTION, id)
  );
}