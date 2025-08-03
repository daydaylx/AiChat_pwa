import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AiChat_pwa/', // <-- exakt Repo-Name, Slash am Ende!
  plugins: [react()],
});
