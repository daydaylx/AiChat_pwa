import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ki-chat-pwa-nofilter/', // <- GENAU SO! (dein Repo-Name)
  plugins: [react()],
});
