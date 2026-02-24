import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
    // ⚡ persistent cache (BIG win on rebuilds)
    cacheDir: "node_modules/.vite",

    plugins: [react()],
    publicDir: "public",

    server: {
        ...(command === "serve" && {
            watch: {
                usePolling: true,
            },
        }),
        host: true,
    },

    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: false,
        target: "esnext",

        minify: "terser",   // 🔥 use terser instead of esbuild
        reportCompressedSize: false,
        cssCodeSplit: false,

        chunkSizeWarningLimit: 2000,

        rollupOptions: {
            output: {
                manualChunks: undefined, // 🔥 prevents freeze
            },
        },
    },

    optimizeDeps: {
        include: ["react-phone-number-input"],
    },

    esbuild: {
        legalComments: "none",
    },
}));