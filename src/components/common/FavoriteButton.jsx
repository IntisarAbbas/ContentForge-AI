import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiHeart } from "react-icons/hi2";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../utils/favoriteStorage";

function FavoriteButton({
  type,
  title,
  prompt = "",
  content = "",
  image = "",
}) {
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await getFavorites();

        const existing = favorites.find(
          (item) =>
            item.type === type &&
            item.title === title
        );

        if (existing) {
          setFavoriteId(existing.id);
        }
      } catch (error) {
        console.error(
          "Favorite check error:",
          error
        );
      }
    };

    checkFavorite();
  }, [type, title]);

  const handleFavorite = async () => {
    try {
      setLoading(true);

      if (favoriteId) {
        await removeFavorite(favoriteId);

        setFavoriteId(null);

        toast.success("Removed from favorites");
      } else {
        const id = await addFavorite({
          type,
          title,
          prompt,
          content,
          image,
        });

        setFavoriteId(id);

        toast.success("Saved to favorites!");
      }
    } catch (error) {
      console.error(
        "Favorite action error:",
        error
      );

      toast.error(
        error?.message ||
          "Could not update favorite."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        favoriteId
          ? "bg-pink-500/15 text-pink-400 hover:bg-pink-500/20"
          : "bg-zinc-800 text-zinc-400 hover:bg-pink-500/10 hover:text-pink-400"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <HiHeart
        size={18}
        className={
          favoriteId ? "fill-current" : ""
        }
      />

      {favoriteId
        ? "Saved"
        : "Add to Favorites"}
    </button>
  );
}

export default FavoriteButton;