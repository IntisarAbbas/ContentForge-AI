import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import Home from "../pages/Home/Home";
import History from "../pages/History/History";
import Favorites from "../pages/Favorites/Favorites";
import Settings from "../pages/Settings/Settings";
import AIGeneratorPage from "../pages/AIGenerator/AIGenerator";

import SocialMedia from "../pages/Tools/SocialMedia";
import FashionIdeas from "../pages/Tools/FashionIdeas";
import BlogWriter from "../pages/Tools/BlogWriter";
import WebsiteDesign from "../pages/Tools/WebsiteDesign";
import CodeGeneratorTool from "../pages/Tools/CodeGenerator";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ImageGenerator from "../pages/ImageGenerator/ImageGenerator";

function AppRoutes() {
  return (
    <Routes>

      {/* Dashboard - ALWAYS PUBLIC */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Tools */}
      <Route
        path="/ai-generator"
        element={
          <ProtectedRoute>
            <AIGeneratorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
    path="/image-generator"
    element={
    <ProtectedRoute>
    <ImageGenerator />
    </ProtectedRoute>
  }
/>

      <Route
     path="/tools/social-media"
     element={
     <ProtectedRoute>
     <SocialMedia />
     </ProtectedRoute>
  }
/>


      <Route
     path="/tools/fashion-ideas"
     element={
    <ProtectedRoute>
    <FashionIdeas />
    </ProtectedRoute>
  }
/>

      <Route
     path="/tools/blog-writer"
     element={
    <ProtectedRoute>
    <BlogWriter />
    </ProtectedRoute>
  }
/>

      <Route
     path="/tools/website-design"
     element={
    <ProtectedRoute>
    <WebsiteDesign />
    </ProtectedRoute>
  }
/>

     <Route
    path="/tools/code-generator"
    element={
    <ProtectedRoute>
    <CodeGeneratorTool />
    </ProtectedRoute>
  }
/>

      <Route
     path="/image-generator"
     element={
     <ProtectedRoute>
     <ImageGenerator />
     </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default AppRoutes;