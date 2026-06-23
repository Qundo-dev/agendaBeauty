import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import App from "@/App";
import "@/index.css";

// Punto de entrada de la app.
// Orden de los providers (de afuera hacia adentro):
// 1. BrowserRouter -> habilita el ruteo en toda la app
// 2. QueryClientProvider -> habilita React Query (cache de datos del servidor)
// 3. AuthProvider -> expone el usuario logueado y funciones de auth a toda la app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
