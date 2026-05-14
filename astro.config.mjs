import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://linktree.bekirkoncak.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
