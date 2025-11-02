import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";


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
    }
  }
});
