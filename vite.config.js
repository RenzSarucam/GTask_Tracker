import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

// LAN IP of the dev machine, so teammates on the same network can open
// the app and Vite's HMR client can reach the dev server correctly.
const LAN_HOST = '10.10.88.33';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
            host: LAN_HOST,
        },
    },
});
