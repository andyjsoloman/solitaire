import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0'
    port: 5173, // optional
    strictPort: true, // optional, avoids fallback
    allowedHosts: [
      ".ngrok.io", // wildcard for any ngrok subdomain
      "localhost",
      "127.0.0.1",
      "4c03-135-12-199-92.ngrok-free.app",
      // or add specific hosts like:
      // 'abcd1234.ngrok.io',
      // '192.168.0.123' (your local IP if testing on LAN)
    ],
  },
});
