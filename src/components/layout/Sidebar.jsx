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
    title: "ContentForge AI",
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

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* =========================
          BACKDROP / CONTENT BLOCK
      ========================== */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
          className="
            fixed inset-0
            z-[60]
            bg-black/65
            backdrop-blur-[3px]
            lg:block
          "
        />
      )}

      {/* =========================
          SIDEBAR DRAWER
      ========================== */}
      <aside
        className={`
          fixed
          left-0
          top-16
          z-[70]

          flex
          h-[calc(100vh-4rem)]
          w-[240px]
          flex-col

          overflow-hidden

          border-r
          border-white/5

          bg-[#0A0A0D]

          shadow-2xl
          shadow-black/40

          transform
          transition-transform
          duration-300
          ease-out

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* =========================
            BRAND
        ========================== */}
        <div className="shrink-0 border-b border-white/5 px-5 py-5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-linear-to-br
                from-violet-600
                to-fuchsia-500
                text-white
                shadow-lg
                shadow-violet-600/20
              "
            >
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
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-zinc-600
            "
          >
            Workspace
          </p>

          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `
                      group
                      flex
                      h-11
                      items-center
                      gap-3
                      rounded-xl
                      px-3.5
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-linear-to-r
                            from-violet-600/20
                            to-fuchsia-500/10
                            text-white
                            ring-1
                            ring-violet-500/20
                          `
                          : `
                            text-zinc-500
                            hover:bg-white/5
                            hover:text-zinc-200
                          `
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition

                          ${
                            isActive
                              ? `
                                bg-violet-600/20
                                text-violet-300
                              `
                              : `
                                text-zinc-500
                                group-hover:text-zinc-200
                              `
                          }
                        `}
                      >
                        <Icon size={18} />
                      </span>

                      <span className="truncate">
                        {item.title}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =========================
            BOTTOM AREA
        ========================== */}
        <div className="shrink-0 border-t border-white/5 p-3">
          {/* USER */}
          {user && (
            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/5
                bg-white/[0.03]
                p-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-linear-to-br
                  from-violet-600
                  to-fuchsia-500
                  text-sm
                  font-bold
                  text-white
                "
              >
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

          {/* LOGOUT */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-3
                flex
                h-10
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/5
                bg-white/[0.03]
                text-sm
                font-medium
                text-zinc-400
                transition
                hover:bg-red-500/10
                hover:text-red-400
              "
            >
              <HiArrowRightOnRectangle size={18} />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* =========================
          FIXED UPGRADE CARD
          DOES NOT SLIDE
      ========================== */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-3
            left-3
            z-[80]
            w-[216px]

            rounded-2xl
            border
            border-violet-500/20

            bg-[#151018]/95

            p-3.5

            shadow-2xl
            shadow-black/40

            backdrop-blur-xl

            lg:hidden
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-violet-600/20
                text-violet-300
              "
            >
              <HiSparkles size={16} />
            </div>

            <span className="text-sm font-semibold text-white">
              Pro
            </span>
          </div>

          <p className="mt-2 text-xs leading-4 text-zinc-500">
            Unlock advanced AI tools and premium features.
          </p>

          <button
            type="button"
            onClick={() => {
              navigate("/pricing");
              toggleSidebar();
            }}
            className="
              mt-3
              w-full
              rounded-xl
              bg-linear-to-r
              from-violet-600
              to-fuchsia-500
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            Upgrade
          </button>
        </div>
      )}
    </>
  );
}

export default Sidebar;