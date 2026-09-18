import { motion } from 'framer-motion';
import {
    CheckSquare,
    LogIn,
    LogOut,
    ShieldAlert,
    XCircle,
} from 'lucide-react';

const ICONS = {
    login: { icon: LogIn, className: 'bg-success/10 text-success' },
    logout: { icon: LogOut, className: 'bg-surface-2 text-text-muted' },
    login_failed: { icon: XCircle, className: 'bg-danger/10 text-danger' },
    login_lockout: { icon: ShieldAlert, className: 'bg-warning/10 text-warning' },
    task_created: { icon: CheckSquare, className: 'bg-primary/10 text-primary' },
};

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function RecentActivity({ items }) {
    return (
        <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-text">Recent activity</h2>

            {items.length === 0 ? (
                <p className="mt-6 text-sm text-text-muted">Nothing to show yet.</p>
            ) : (
                <ul className="mt-4 space-y-1">
                    {items.map((item, i) => {
                        const { icon: Icon, className } = ICONS[item.type] ?? ICONS.task_created;

                        return (
                            <motion.li
                                key={`${item.type}-${item.at}-${i}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.25 }}
                                className="flex items-start gap-3 rounded-input px-2 py-2.5 transition-colors hover:bg-surface-2"
                            >
                                <span
                                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${className}`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm text-text">
                                        {item.description}
                                    </span>
                                    <span className="text-xs text-text-muted">{timeAgo(item.at)}</span>
                                </span>
                            </motion.li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
