import { defineConfig } from 'vite';

export default defineConfig({
  // This is the most important part for itch.io and GitHub!
  // It tells Vite to look for assets in the same folder as the index.html.
  base: './', 
  
  build: {
    // This ensures your assets are bundled cleanly
    outDir: 'dist',
    assetsDir: 'assets',
  },
  
  // This keeps your pixel art sharp when scaling
  server: {
    host: true
  }
});