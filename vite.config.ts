import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

function repositoryBase() {
  // Actions supplies the current owner/repository, including forks and renames.
  let repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    try {
      repository = execFileSync("git", ["remote", "get-url", "origin"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      // Source archives without Git keep relative asset paths.
      return "./";
    }
  }
  const name = repository
    .replace(/\/$/, "")
    .replace(/\.git$/, "")
    .split("/")
    .pop();
  return !name || name.toLowerCase().endsWith(".github.io")
    ? "/"
    : "/" + name + "/";
}

export default defineConfig({
  plugins: [react()],
  base: repositoryBase(),
  define: {
    "import.meta.env.VITE_HAS_MUSIC": JSON.stringify(
      existsSync("public/music.mp3"),
    ),
  },
});
