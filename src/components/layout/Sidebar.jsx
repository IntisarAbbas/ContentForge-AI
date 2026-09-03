import {
  HiHome,
  HiChatBubbleLeftRight,
  HiCog6Tooth,
  HiClock,
  HiHeart,
  HiSparkles,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth";

const menu = [
  {
    title: "Dashboard",
    icon: HiHome,
    path: "/",
  },
  {
    title: "ContentForg-AI",
    icon: HiChatBubbleLeftRight,
    path: "/ai-generator",
  },
  {
    title: "History",
    icon: HiClock,
    path: "/history",
  },
  {
    title: "Favorites",
    icon: HiHeart,
    path: "/favorites",
  },
  {
    title: "Settings",
    icon: HiCog6Tooth,
    path: "/settings",
  },
];

function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 z-50
          flex h-[calc(100vh-4rem)] w-[240px]
          flex-col
          border-r border-white/5
          bg-[#0A0A0D]
          shadow-2xl shadow-black/20
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5 md:hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-600/20">
            <HiSparkles size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">
              ContentForge AI
            </h2>

            <p className="mt-0.5 text-[11px] text-zinc-500">
              AI Workspace
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </p>

          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    `group flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-violet-600/20 to-fuchsia-500/10 text-white ring-1 ring-violet-500/20"
                        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-violet-600/20 text-violet-300"
                            : "text-zinc-500 group-hover:text-zinc-200"
                        }`}
                      >
                        <Icon size={18} />
                      </span>

                      <span>{item.title}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="space-y-3 border-t border-white/5 p-3">

          {/* User */}
          {user && (
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.displayName || "User"}
                </p>

                <p className="truncate text-[11px] text-zinc-500">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="py-2">
          {user && (
            <button
              onClick={handleLogout}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <HiArrowRightOnRectangle size={18} />
              Logout
            </button>
          )}
          </div>

          {/* Upgrade */}
          <div className="rounded-2xl border border-violet-500/15 bg-linear-to-br from-violet-600/15 via-fuchsia-500/10 to-transparent p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-300">
                <HiSparkles size={16} />
              </div>

              <span className="text-sm font-semibold text-white">
                Pro
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Unlock advanced AI tools and premium features.
            </p>

            <button
              onClick={() => navigate("/pricing")}
              className="mt-3 w-full rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-500 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Upgrade
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;