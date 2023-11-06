import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssnesting from "postcss-nesting";
import postcss100vhFix from "postcss-100vh-fix";
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    tailwindcss("./tailwind.config.ts"),
    postcssnesting,
    postcss100vhFix,
    autoprefixer,
  ],
};
