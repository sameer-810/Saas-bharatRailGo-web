import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// index.html uses %VITE_SITE_URL% for canonical / Open Graph URLs.
process.env.VITE_SITE_URL ??= "https://bharatrailgo.in";

export default defineConfig({ plugins: [react()] });
