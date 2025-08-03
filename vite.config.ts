import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AiChat_pwa/', // <- Muss exakt wie dein Repo heißen, MIT Slash am Ende!
  plugins: [react()],
});
