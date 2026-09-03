import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Firebase user check complete hone tak loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0F]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  // Login nahi hai
  // Dashboard ko chhor kar baaki protected pages par
  // login page show hoga
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Login hai → current page open rahega
  return children;
}

export default ProtectedRoute;