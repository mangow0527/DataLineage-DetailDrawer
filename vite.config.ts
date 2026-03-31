import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // TODO(API): 如果需要在开发期调用后端，开启如下代理。
    // 例如将 /api 转发到 http://localhost:8080
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true
    //   }
    // }
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        job: resolve(__dirname, 'job.html'),
        dataset: resolve(__dirname, 'dataset.html')
      }
    }
  }
})
