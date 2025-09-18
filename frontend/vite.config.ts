// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';


import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  base:'/aumigos-vet/',
  build: {
    outDir: '../docs',
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls,
        compilerOptions: {
          isCustomElement: (tag: string) => tag.includes('*-*') || tag.includes('v-list-item-content')
        }
      }
    }),
    vuetify({ autoImport: true })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@helpers': fileURLToPath(new URL('./src/modules/commons/helpers', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/modules/commons/components', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/modules/commons/services', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/modules/commons/store', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  css: {
    preprocessorOptions: { scss: {} }
  },
  server: {
    port: 9081,
    proxy: {
      '/api': {
        target: 'https://controlepet.onrender.com', // URL do backend
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // mantém o mesmo path
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'vuetify.config.js',
    deps: { inline: ['vuetify'] },
    globals: true
  }
})
