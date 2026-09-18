import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';

const PRIORITY_STYLES = {
    high: 'bg-danger/10 text-danger',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success',
};

function formatDue(dateStr, isOverdue) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((date - today) / 86400000);

    if (isOverdue) return `Overdue · ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;

    return `Due ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

export default function DueSoonList({ items, title = 'My tasks due soon', viewAllRoute = 'my-tasks' }) {
    return (
        <div className="rounded-card border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text">{title}</h2>
                <Link
                    href={route(viewAllRoute)}
                    className="text-xs font-medium text-primary hover:text-primary-hover"
                >
                    View all
                </Link>
            </div>

            {items.length === 0 ? (
                <p className="mt-6 text-sm text-text-muted">Nothing due soon. You&apos;re all caught up.</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {items.map((task, i) => (
                        <motion.li
                            key={task.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25 }}
                            className="rounded-input border border-border/70 bg-surface-2 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="min-w-0 truncate text-sm font-medium text-text">
                                    {task.title}
                                </p>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
                                >
                                    {task.priority}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span
                                    className={`inline-flex items-center gap-1 text-xs ${
                                        task.is_overdue ? 'text-danger' : 'text-text-muted'
                                    }`}
                                >
                                    <CalendarClock className="h-3.5 w-3.5" />
                                    {formatDue(task.due_date, task.is_overdue)}
                                </span>

                                {task.department && (
                                    <span className="text-xs text-text-muted">{task.department}</span>
                                )}
                            </div>

                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );
}
