import { ProxyOptions, UserConfig, defineConfig, loadEnv } from "vite";

import path from "node:path";
import react from "@vitejs/plugin-react";

function getProxy(env): Record<string, string | ProxyOptions> {
  let proxy = {};
  if (env.API_BASE_URL) {
    proxy = Object.assign(proxy, {
      "^/api": {
        target: env.API_BASE_URL,
      },
      "^/sohoa/api": {
        target: env.API_BASE_URL,
        rewrite: (path) => path.replace(/^\/sohoa/, ""),
      },
      "^/storage": {
        target: env.API_BASE_URL,
      },
    });
  }
  return proxy;
}
// https://vitejs.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");
  return {
    base: env.VITE_PREFIX,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react()],
    server: {
      port: +env.PORT,
      proxy: getProxy(env),
    },
    css: {
      devSourcemap: true,
    },
  } as UserConfig;
});
