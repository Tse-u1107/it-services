import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://wiki.it.shanghai.nyu.edu',
        changeOrigin: true,
        secure: false,
      },
      '/jsonapi': {
        target: 'https://wiki.it.shanghai.nyu.edu',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'https://review.shanghai.nyu.edu',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers['authorization']) {
              proxyReq.setHeader('authorization', req.headers['authorization']);
            }
          });
        },

      }
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
});
