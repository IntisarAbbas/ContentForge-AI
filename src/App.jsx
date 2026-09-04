import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { useSidebar } from "./context/SidebarContext";

function App() {
  const location = useLocation();
  const { isOpen } = useSidebar();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  // Lock background scrolling while mobile sidebar is open
  useEffect(() => {
    if (isAuthPage) return;

    const isMobile = window.innerWidth < 1024;

    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isAuthPage]);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#07070A] text-white">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07070A] text-white">
      <Navbar />
      <Sidebar />

      <main className="relative min-h-screen pt-20 lg:pl-[240px]">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default App;