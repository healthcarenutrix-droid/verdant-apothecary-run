import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initContentStore } from "@/data/dashboard-data";
import { refreshStorefrontData } from "@/data/products";

async function bootstrap() {
  try {
    await initContentStore();
  } catch (err) {
    console.error("Failed to load catalogue content", err);
  }
  refreshStorefrontData();

  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
  );
}

bootstrap();
