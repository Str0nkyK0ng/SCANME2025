import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  root: '.', // Ensure the project root is set correctly
  css: {
    postcss: './postcss.config.js', // Explicitly point to PostCSS configuration
  },
  server: {
    watch: {
      ignored: ['!**/*.html', '!**/*.css', '!**/*.js', '!**/*.ts'], // Include all relevant file types for live reloading
    },
  },
});
