import {
  HiBars3,
  HiSparkles,
  HiMagnifyingGlass,
  HiBell,
  HiCheck,
  HiTrash,
} from "react-icons/hi2";

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

const searchItems = [
  {
    title: "Social Media",
    description: "Create engaging social media content.",
    path: "/tools/social-media",
  },
  {
    title: "Fashion Ideas",
    description: "Get personalized fashion styling ideas.",
    path: "/tools/fashion-ideas",
  },
  {
    title: "Blog Writer",
    description: "Create SEO-friendly blog posts.",
    path: "/tools/blog-writer",
  },
  {
    title: "Website Design",
    description: "Generate website and UI/UX ideas.",
    path: "/tools/website-design",
  },
  {
    title: "Code Generator",
    description: "Generate code for your projects.",
    path: "/tools/code-generator",
  },
  {
    title: "Image Generator",
    description: "Create AI images from text prompts.",
    path: "/image-generator",
  },
  {
    title: "AI Assistant",
    description: "Chat with ContentForge AI.",
    path: "/ai-generator",
  },
];

const defaultNotifications = [
  {
    id: 1,
    title: "Welcome to ContentForge AI",
    message: "Your AI workspace is ready to use.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "AI tools are ready",
    message: "Explore Blog Writer, Code Generator and more.",
    time: "Today",
    read: false,
  },
  {
    id: 3,
    title: "Image Generator available",
    message: "Create AI images from your prompts.",
    time: "Today",
    read: true,
  },
];

function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  const filteredItems = search.trim()
    ? searchItems.filter((item) => {
        const query = search.toLowerCase();

        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      })
    : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSearchSelect = (path) => {
    setSearch("");
    navigate(path);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-4 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            onClick={toggleSidebar}
            className="rounded-xl p-2 transition hover:bg-zinc-800 lg:hidden"
          >
            <HiBars3 size={28} />
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500">
              <HiSparkles size={22} />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">
                ContentForge AI
              </h1>

              <p className="text-xs text-zinc-400">
                AI Workspace
              </p>
            </div>

          </div>
        </div>

        {/* Search */}
        <div className="hidden flex-1 justify-center px-10 lg:flex">
          <div className="relative w-full max-w-xl">

            <HiMagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI tools..."
              className="h-11 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-11 pr-4 outline-none transition focus:border-violet-500"
            />

            {/* Search Results */}
            {search.trim() && (
              <div className="absolute left-0 right-0 top-14 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">

                {filteredItems.length > 0 ? (
                  <div className="p-2">
                    {filteredItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() =>
                          handleSearchSelect(item.path)
                        }
                        className="flex w-full items-start rounded-xl px-4 py-3 text-left transition hover:bg-zinc-900"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.title}
                          </p>

                          <p className="pt-1 text-xs text-zinc-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center">
                    <p className="text-sm font-medium text-zinc-300">
                      No tools found
                    </p>

                    <p className="pt-1 text-xs text-zinc-600">
                      Try another search.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              onClick={() =>
                setShowNotifications((prev) => !prev)
              }
              className="relative rounded-xl p-2 transition hover:bg-zinc-800"
            >
              <HiBell size={22} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-[340px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Notifications
                    </h3>

                    <p className="pt-1 text-xs text-zinc-500">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "You're all caught up"}
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs font-medium text-violet-400 transition hover:text-violet-300"
                    >
                      <HiCheck size={14} />
                      Read all
                    </button>
                  )}

                </div>

                {/* Notifications */}
                <div className="max-h-[380px] overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
                        <HiBell
                          size={22}
                          className="text-zinc-600"
                        />
                      </div>

                      <p className="pt-4 text-sm font-medium text-zinc-300">
                        No notifications
                      </p>

                      <p className="pt-1 text-xs text-zinc-600">
                        New activity will appear here.
                      </p>

                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className={`w-full border-b border-zinc-900 px-4 py-4 text-left transition hover:bg-zinc-900 ${
                          !notification.read
                            ? "bg-violet-500/5"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">

                          <div
                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                              notification.read
                                ? "bg-zinc-700"
                                : "bg-violet-500"
                            }`}
                          />

                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-white">
                              {notification.title}
                            </p>

                            <p className="pt-1 text-xs leading-5 text-zinc-500">
                              {notification.message}
                            </p>

                            <p className="pt-2 text-[10px] text-zinc-600">
                              {notification.time}
                            </p>

                          </div>

                        </div>
                      </button>
                    ))
                  )}

                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-zinc-800 p-2">
                    <button
                      onClick={clearNotifications}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <HiTrash size={15} />
                      Clear notifications
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* User */}
          {user ? (
            <div className="hidden items-center gap-3 md:flex">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-500 font-bold">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>

              <div className="hidden lg:block">
                <h3 className="font-semibold">
                  {user.displayName || "User"}
                </h3>

                <p className="text-xs text-zinc-500">
                  {user.email}
                </p>
              </div>

            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-violet-600 px-5 py-2 font-semibold transition hover:bg-violet-500"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;