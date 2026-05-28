import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const tailwindPostcss = require('@tailwindcss/postcss')
const autoprefixer = require('autoprefixer')

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/main.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/preload.ts')
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    css: {
      postcss: {
        plugins: [tailwindPostcss({ config: './tailwind.config.ts' }), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer'),
        '@shared': resolve(__dirname, 'src/shared')
      }
    },
  plugins: [tailwindcss(), react()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    }
  }
})
