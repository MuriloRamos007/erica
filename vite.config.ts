import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
    "import.meta.env.VITE_HAS_MUSIC": JSON.stringify(
      existsSync("public/music.mp3"),
    ),
  },
});
