import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleCreativeBriefRequest } from "./server/notion.mjs";

function notionApiPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), "");

  const attachHandler = (middlewares) => {
    middlewares.use("/api/creative-brief", async (req, res) => {
      await handleCreativeBriefRequest(req, res, env);
    });
  };

  return {
    name: "notion-api",
    configureServer(server) {
      attachHandler(server.middlewares);
    },
    configurePreviewServer(server) {
      attachHandler(server.middlewares);
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), notionApiPlugin(mode)],
}));
