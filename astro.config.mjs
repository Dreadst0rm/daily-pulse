// @ts-check
import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "http://127.0.0.1:43147";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
});
