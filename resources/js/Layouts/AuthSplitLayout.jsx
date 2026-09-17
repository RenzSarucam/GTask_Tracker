import ShowcasePanel from '@/Components/Auth/ShowcasePanel';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListChecks } from 'lucide-react';

export default function AuthSplitLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="flex min-h-screen w-full items-stretch justify-center bg-bg p-4 lg:p-6">
            {/* Mobile top banner (left panel collapses into this) */}
            <Link
                href="/"
                className="fixed left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 lg:hidden"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary shadow-glow">
                    <ListChecks className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-text">
                    GAISANO Task Tracker
                </span>
            </Link>

            <div className="flex w-full max-w-6xl gap-6">
                <div className="hidden w-[45%] lg:block">
                    <ShowcasePanel />
                </div>

                <div className="flex w-full items-start justify-center pt-24 lg:w-[55%] lg:items-center lg:pt-0">
                    <div className="w-full max-w-md">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
