import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import { terser } from 'rollup-plugin-terser'
import { VitePWA } from 'vite-plugin-pwa'

const path = require("path")

export default defineConfig({

  build: {
    outDir: 'dist', //Storage path of packaged files
    brotliSize: false,// =>Enable / disable brotli compressed size reporting
    minify: 'terser',
    //Remove console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    vue(),
    viteCompression({
      // Turn on gzip mode
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    VitePWA({
      includeAssets: ['robots.txt'],
      manifest: {
        name: "Visor de expedientes",
        short_name: "VisorEE",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#394551",
        description: "Visor de expedientes electrónicos",
        icons: [
          {
            src: "/escudos/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/escudos/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/escudos/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          }
        ]
      }
    })
  ]
})
