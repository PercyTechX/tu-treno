import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',                 // rutas relativas: obligatorio dentro del APK
  build: { outDir: 'dist', assetsInlineLimit: 0 },
  server: { host: true },     // host:true permite abrirlo desde el movil por wifi
});
