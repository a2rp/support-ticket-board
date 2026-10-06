import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/support-ticket-board/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
