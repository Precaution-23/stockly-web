import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  // Listen on all interfaces so other devices on the LAN can reach the dev server
  server: { host: true, port: 5173 },
  plugins: [
    vue(),
    vueJsx(),
    vuetify({ autoImport: false }),
    Pages({
      dirs: [{ dir: 'src/pages', baseRoute: '' }],
      extensions: ['vue']
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default'
    }),
    Components({
      dirs: ['src/components', 'src/@core/components'],
      dts: 'src/components.d.ts'
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dirs: ['src/composables', 'src/store'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts'
    }),
    DefineOptions()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['vuetify']
  }
})
