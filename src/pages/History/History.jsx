import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiTrash,
  HiClipboardDocument,
  HiArrowPath,
} from "react-icons/hi2";

import {
  getHistory,
  deleteHistory,
  clearHistory,
} from "../../utils/storage";

import { useAuth } from "../../context/AuthContext";

function History() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);

      if (!user) {
        setHistory([]);
        return;
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Firebase history request timed out. Check your Firestore connection and rules."
            )
          );
        }, 10000);
      });

      const data = await Promise.race([
        getHistory(),
        timeoutPromise,
      ]);

      setHistory(data);
    } catch (error) {
      console.error("History load error:", error);

      setHistory([]);

      toast.error(
        error?.message ||
          "Could not load history from Firebase."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleRefresh = async () => {
    await loadHistory();
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await deleteHistory(id);

      setHistory((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("History deleted");
    } catch (error) {
      console.error("Delete history error:", error);

      toast.error(
        error?.message || "Could not delete history."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleClear = async () => {
    if (!history.length || clearing) return;

    try {
      setClearing(true);

      await clearHistory();

      setHistory([]);

      toast.success("History cleared");
    } catch (error) {
      console.error("Clear history error:", error);

      toast.error(
        error?.message || "Could not clear history."
      );
    } finally {
      setClearing(false);
    }
  };

  const copyContent = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      toast.success("Copied");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy content.");
    }
  };

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
            History
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Review your previous AI generations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || clearing}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiArrowPath
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            <span className="hidden sm:block">
              Refresh
            </span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing || loading}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiTrash size={17} />

              <span className="hidden sm:block">
                {clearing
                  ? "Clearing..."
                  : "Clear History"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-sm text-zinc-500">
                  Loading your history...
                </p>

                <p className="pt-2 text-xs text-zinc-700">
                  Connecting to Firebase...
                </p>
              </div>
            </div>
          )}

          {/* No User */}
          {!loading && !user && (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">
                  Login required
                </h2>

                <p className="pt-2 text-sm text-zinc-500">
                  Please log in to view your history.
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && user && history.length === 0 && (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
              <div className="max-w-md px-6 text-center">
                <h2 className="text-xl font-bold text-white">
                  No history yet
                </h2>

                <p className="pt-3 text-sm leading-6 text-zinc-500">
                  Your AI chats, generated content, code,
                  images and other creations will appear here.
                </p>
              </div>
            </div>
          )}

          {/* History Cards */}
          {!loading &&
            user &&
            history.length > 0 && (
              <div className="flex flex-col gap-5">
                {history.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
                  >
                    {/* Card Header */}
                    <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                          {item.category ||
                            "AI Generation"}
                        </p>

                        <h2 className="pt-1 truncate text-lg font-bold text-white sm:text-xl">
                          {item.title ||
                            item.category ||
                            "AI Generation"}
                        </h2>

                        <p className="pt-1 text-xs text-zinc-500">
                          {item.createdAt ||
                            "Recently"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            copyContent(item.result)
                          }
                          className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                        >
                          <HiClipboardDocument
                            size={18}
                          />

                          <span className="hidden sm:block">
                            Copy
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          disabled={
                            deletingId === item.id
                          }
                          className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <HiTrash size={18} />

                          <span className="hidden sm:block">
                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Prompt */}
                    {item.prompt && (
                      <div className="border-b border-zinc-800 px-5 py-5 sm:px-6">
                        <p className="pb-2 text-sm font-semibold text-zinc-300">
                          Prompt
                        </p>

                        <div className="rounded-2xl border border-zinc-800 bg-[#09090C] px-4 py-3">
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-500">
                            {item.prompt}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    <div className="px-5 py-5 sm:px-6">
                      <p className="pb-3 text-sm font-semibold text-zinc-300">
                        Result
                      </p>

                      <div className="max-h-[460px] overflow-auto rounded-2xl border border-zinc-800 bg-[#09090C] p-4 sm:p-5">
                        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
                          {item.result ||
                            "No result available."}
                        </pre>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

export default History;