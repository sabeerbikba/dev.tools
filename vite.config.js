import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Specify the host you want the development server to run on
    host: '0.0.0.0',
    // Specify the port you want the development server to listen on
    port: 3000,
    // Set this option to true to allow external access, e.g., from your phone
    open: true,
    // Enable https if needed (e.g., for accessing from a mobile device over HTTPS)
    https: false,
  },
})
