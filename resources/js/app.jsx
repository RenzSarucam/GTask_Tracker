import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { MotionConfig } from 'framer-motion';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import PageTransition from './Components/PageTransition';

const appName = import.meta.env.VITE_APP_NAME || 'GAISANO Task Tracker';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Pages that define a persistent `Component.layout` (e.g. auth split
        // layout, authenticated app shell) keep Inertia's default layout
        // wrapping so the layout itself stays mounted across navigations and
        // owns its own transition. Pages without a layout fall back to the
        // generic fade+slide PageTransition.
        root.render(
            // reducedMotion="user" makes every Framer Motion animation in the
            // app (not just the ones that manually check useReducedMotion)
            // honor the OS/browser prefers-reduced-motion setting.
            <MotionConfig reducedMotion="user">
                <App
                    {...props}
                    children={({ Component, props: pageProps, key }) => {
                        const page = createElement(Component, { ...pageProps, key });

                        if (typeof Component.layout === 'function') {
                            return Component.layout(page);
                        }

                        if (Array.isArray(Component.layout)) {
                            return Component.layout
                                .concat(page)
                                .reverse()
                                .reduce((children, Layout) =>
                                    createElement(Layout, { ...pageProps }, children),
                                );
                        }

                        return <PageTransition pageKey={key}>{page}</PageTransition>;
                    }}
                />
            </MotionConfig>,
        );
    },
    progress: {
        color: '#7C5CFF',
    },
});
