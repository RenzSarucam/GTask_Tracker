import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                'surface-2': 'var(--surface-2)',
                border: 'var(--border)',
                primary: {
                    DEFAULT: 'var(--primary)',
                    hover: 'var(--primary-hover)',
                },
                accent: 'var(--accent)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                danger: 'var(--danger)',
                text: {
                    DEFAULT: 'var(--text)',
                    muted: 'var(--text-muted)',
                },
            },
            borderRadius: {
                card: '12px',
                input: '10px',
            },
            boxShadow: {
                glow: '0 0 0 1px var(--primary), 0 0 20px -4px rgba(124, 92, 255, 0.55)',
                'glow-lg': '0 0 0 1px var(--primary), 0 0 40px -8px rgba(124, 92, 255, 0.65)',
            },
            backgroundImage: {
                grid: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                'gradient-shimmer': 'linear-gradient(110deg, var(--primary) 0%, var(--primary-hover) 40%, #A78BFA 50%, var(--primary-hover) 60%, var(--primary) 100%)',
            },
            backgroundSize: {
                grid: '32px 32px',
                shimmer: '200% 100%',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                'skeleton-pulse': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                },
            },
            animation: {
                shimmer: 'shimmer 2.5s linear infinite',
                'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};
