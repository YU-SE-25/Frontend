import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "java", "cpp"],
    }),
  ],

  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["unide.kro.kr"],
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
