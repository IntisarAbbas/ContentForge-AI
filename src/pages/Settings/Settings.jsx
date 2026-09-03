import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiCog6Tooth,
  HiBell,
  HiSparkles,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth";

function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [detailedResponses, setDetailedResponses] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Logout failed"
      );
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaveLoading(true);

      // Abhi settings local state mein hain.
      // Baad mein Firebase/Firestore se persist kar sakte hain.
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not save settings.");
    } finally {
      setSaveLoading(false);
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
      <div className="flex h-[98px] shrink-0 items-center border-b border-zinc-800 px-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Settings
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Manage your account and AI preferences.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">

          {/* Profile */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <HiCog6Tooth size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Profile
                </h2>

                <p className="pt-1 text-xs text-zinc-500">
                  Your account information
                </p>
              </div>
            </div>

            <div className="grid gap-4 pt-6 sm:grid-cols-2">
              <div>
                <label className="block pb-2 text-sm font-medium text-zinc-400">
                  Name
                </label>

                <input
                  type="text"
                  value={user?.displayName || "User"}
                  readOnly
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block pb-2 text-sm font-medium text-zinc-400">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-white outline-none"
                />
              </div>
            </div>
          </section>

          {/* AI Preferences */}
          <section className="pt-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <HiSparkles size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    AI Preferences
                  </h2>

                  <p className="pt-1 text-xs text-zinc-500">
                    Customize how ContentForge AI responds.
                  </p>
                </div>
              </div>

              {/* Language behavior info */}
              <div className="border-b border-zinc-800 py-5">
                <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-4">
                  <p className="text-sm font-medium text-white">
                    Automatic Language
                  </p>

                  <p className="pt-2 text-xs leading-5 text-zinc-500">
                    ContentForge AI automatically replies in the
                    same language and writing style you use.
                  </p>

                  <p className="pt-2 text-xs leading-5 text-zinc-600">
                    No language selection is required.
                  </p>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between border-b border-zinc-800 py-5">
                <div className="flex items-start gap-3">
                  <HiBell
                    size={20}
                    className="text-zinc-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Notifications
                    </p>

                    <p className="pt-1 text-xs leading-5 text-zinc-500">
                      Receive updates about activity and AI tools.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) => !prev)
                  }
                  aria-label="Toggle notifications"
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications
                      ? "bg-violet-600"
                      : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Detailed Responses */}
              <div className="flex items-center justify-between py-5">
                <div className="flex items-start gap-3">
                  <HiSparkles
                    size={20}
                    className="text-zinc-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Detailed AI Responses
                    </p>

                    <p className="pt-1 text-xs leading-5 text-zinc-500">
                      Prefer detailed explanations for complex
                      questions and coding tasks.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDetailedResponses((prev) => !prev)
                  }
                  aria-label="Toggle detailed AI responses"
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    detailedResponses
                      ? "bg-violet-600"
                      : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      detailedResponses
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Save */}
          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saveLoading}
              className="rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveLoading
                ? "Saving..."
                : "Save Settings"}
            </button>
          </div>

          {/* Account */}
          <section className="pb-8 pt-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="font-semibold text-white">
                  Sign out
                </h3>

                <p className="pt-1 text-sm leading-6 text-zinc-500">
                  Sign out from your ContentForge AI account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                <HiArrowRightOnRectangle size={18} />
                Logout
              </button>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Settings;