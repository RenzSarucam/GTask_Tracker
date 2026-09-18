import Sidebar from '@/Components/Layout/Sidebar';
import Topbar from '@/Components/Layout/Topbar';
import { TopbarProvider, useTopbarActions } from '@/Contexts/TopbarContext';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout(props) {
    return (
        <TopbarProvider>
            <AuthenticatedLayoutInner {...props} />
        </TopbarProvider>
    );
}

function AuthenticatedLayoutInner({ title, subtitle, children }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const topbarActions = useTopbarActions();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const stored = window.localStorage?.getItem('sidebar-collapsed');
        if (stored === '1') setCollapsed(true);
    }, []);

    useEffect(() => {
        try {
            window.localStorage?.setItem('sidebar-collapsed', collapsed ? '1' : '0');
        } catch {
            // ignore (private browsing, storage disabled, etc.)
        }
    }, [collapsed]);

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    return (
        <div className="flex min-h-screen bg-bg">
            <Sidebar
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed((v) => !v)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                user={user}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setMobileOpen(true)}
                    {...topbarActions}
                />

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
