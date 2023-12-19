import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'font-family': "'Raleway', sans-serif",
          'font-size-base': '16px',
          'line-height-base': '1.5',
          'layout-header-background': 'transparent',
          'layout-body-background': 'transparent',
          'body-background': 'transparent',
          'text-color': '#002329',
        },
        javascriptEnabled: true,
      },
    },
  },
});
