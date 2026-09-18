import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsUpDown, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function UserDropdown({ collapsed, user, initials }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] overflow-hidden rounded-input border border-border bg-surface-2 py-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]"
                    >
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text"
                            onClick={() => setOpen(false)}
                        >
                            <UserIcon className="h-4 w-4" />
                            Profile
                        </Link>
                        <button
                            type="button"
                            onClick={() => router.post(route('logout'))}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-2.5 rounded-input px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-2"
            >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {initials}
                </span>
                {!collapsed && (
                    <>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-text">
                                {user?.name}
                            </span>
                            <span className="block truncate text-xs text-text-muted">
                                {user?.email}
                            </span>
                        </span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-text-muted" />
                    </>
                )}
            </button>
        </div>
    );
}
