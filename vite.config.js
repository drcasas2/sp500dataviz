import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import reactRefresh from '@vitejs/plugin-react-refresh';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/sp500dataviz",
  plugins: [
    react(),
    reactRefresh(),
    tailwindcss(),
    //autoprefixer(),
  ],
});
