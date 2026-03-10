import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Cổng mặc định của Vite
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài
  },
})
