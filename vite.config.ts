import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AiChat_pwa/', // <-- Exakt Repo-Name, mit Slash am Ende!
  plugins: [react()],
});
