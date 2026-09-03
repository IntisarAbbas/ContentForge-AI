import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

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

      <main className="min-h-screen pt-20 lg:pl-[240px]">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default App;