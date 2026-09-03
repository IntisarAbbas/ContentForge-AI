import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiHeart,
  HiTrash,
  HiCodeBracket,
  HiDocumentText,
  HiPhoto,
  HiArrowPath,
} from "react-icons/hi2";

import {
  getFavorites,
  removeFavorite,
} from "../../utils/favoriteStorage";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const data = await getFavorites();

      setFavorites(data);
    } catch (error) {
      console.error(
        "Favorites load error:",
        error
      );

      toast.error(
        error?.message ||
          "Could not load favorites."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      setDeletingId(id);

      await removeFavorite(id);

      setFavorites((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Removed from favorites");
    } catch (error) {
      console.error(
        "Favorite delete error:",
        error
      );

      toast.error(
        error?.message ||
          "Could not remove favorite."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type) => {
    if (type === "Code") {
      return <HiCodeBracket size={20} />;
    }

    if (type === "Image") {
      return <HiPhoto size={20} />;
    }

    return <HiDocumentText size={20} />;
  };

  const filteredFavorites =
    filter === "All"
      ? favorites
      : favorites.filter(
          (item) => item.type === filter
        );

  return (
    <div
      className="
        fixed
        left-3
        right-3
        top-20
        bottom-4
        flex
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-zinc-800
        bg-[#0A0A0D]
        lg:left-[256px]
        lg:right-6
      "
    >
      {/* Header */}
      <div className="flex h-[98px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0A0A0D] px-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Favorites
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Access your saved AI creations.
          </p>
        </div>

        <button
          onClick={loadFavorites}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
        >
          <HiArrowPath
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          <span className="hidden sm:block">
            Refresh
          </span>
        </button>
      </div>

      {/* Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 pb-8">
            {[
              "All",
              "Social Media",
              "Blog Writer",
              "Fashion Ideas",
              "Website Design",
              "Code",
              "Image",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  filter === item
                    ? "bg-violet-600 text-white"
                    : "border border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-sm text-zinc-500">
                  Loading favorites...
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            filteredFavorites.length === 0 && (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
                <div className="max-w-md px-6 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                    <HiHeart size={30} />
                  </div>

                  <h2 className="pt-5 text-xl font-bold text-white">
                    No favorites yet
                  </h2>

                  <p className="pt-3 text-sm leading-6 text-zinc-500">
                    Save your favorite AI content,
                    generated code, or images and
                    they will appear here.
                  </p>

                </div>
              </div>
            )}

          {/* Cards */}
          {!loading &&
            filteredFavorites.length > 0 && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {filteredFavorites.map(
                  (item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-violet-500/30"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            {getIcon(item.type)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
                              {item.type}
                            </p>

                            <h3 className="truncate pt-1 text-base font-semibold text-white">
                              {item.title}
                            </h3>
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            handleRemove(
                              item.id
                            )
                          }
                          disabled={
                            deletingId ===
                            item.id
                          }
                          className="shrink-0 rounded-xl p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          <HiTrash size={18} />
                        </button>

                      </div>

                      {item.prompt && (
                        <div className="pt-5">
                          <p className="pb-2 text-xs font-semibold text-zinc-500">
                            Prompt
                          </p>

                          <p className="text-sm leading-6 text-zinc-400">
                            {item.prompt}
                          </p>
                        </div>
                      )}

                      {item.content && (
                        <div className="pt-4">
                          <div className="max-h-[220px] overflow-auto rounded-2xl border border-zinc-800 bg-[#09090C] p-4">
                            <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                              {item.content}
                            </pre>
                          </div>
                        </div>
                      )}

                      {item.image && (
                        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black pt-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="block h-auto w-full object-cover"
                          />
                        </div>
                      )}

                      <p className="pt-4 text-xs text-zinc-600">
                        {item.createdAt}
                      </p>
                    </article>
                  )
                )}
              </div>
            )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

export default Favorites;