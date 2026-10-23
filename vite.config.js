import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                level: resolve(__dirname, "level.html"),
                difficulty: resolve(__dirname, "difficulty.html"),
                stats: resolve(__dirname, "stats.html"),
                local: resolve(__dirname, "local.html"),
                easy: resolve(__dirname, "easy.html"),
                medium: resolve(__dirname, "medium.html"),
                hard: resolve(__dirname, "hard.html"),
                impossible: resolve(__dirname, "impossible.html"),
                documentation: resolve(__dirname, "documentation.html")
            }
        }
    }
});