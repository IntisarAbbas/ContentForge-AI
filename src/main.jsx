import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./styles/globals.css";

import { SidebarProvider } from "./context/SidebarContext";
import { HistoryProvider } from "./context/HistoryContext";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SidebarProvider>
       <AuthProvider>
      <HistoryProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          <App />
        </BrowserRouter>
      </HistoryProvider>
      </AuthProvider>
    </SidebarProvider>
  </React.StrictMode>
);