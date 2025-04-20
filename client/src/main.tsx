import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-toggle";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="theme">
    <App />
  </ThemeProvider>
);
