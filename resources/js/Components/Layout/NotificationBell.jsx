import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCircle2, ClipboardList, UserCheck } from 'lucide-react';

function initials(name = '') {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join('') || '?'
    );
}

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
    const { props } = usePage();
    const user = props.auth?.user;
    const approvalsCount = props.pendingApprovalsCount ?? 0;
    const approvalsPreview = props.pendingApprovalsPreview ?? [];
    const taskCount = props.taskNotificationsCount ?? 0;
    const taskPreview = props.taskNotificationsPreview ?? [];
    const total = approvalsCount + taskCount;

    if (!user) return null;

    return (
        <Popover className="relative">
            <PopoverButton
                className="relative shrink-0 rounded-input p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus:outline-none"
                aria-label={total > 0 ? `${total} notification${total === 1 ? '' : 's'}` : 'Notifications'}
            >
                <Bell className="h-5 w-5" />
                {total > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
                        {total}
                    </span>
                )}
            </PopoverButton>

            <PopoverPanel
                transition
                anchor={{ to: 'bottom end', gap: 10 }}
                className="z-50 w-80 overflow-hidden rounded-input border border-border bg-surface-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] transition duration-150 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {total === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                        <p className="text-xs text-text-muted">You're all caught up.</p>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        {approvalsCount > 0 && (
                            <div>
                                <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                                    <UserCheck className="h-3.5 w-3.5 text-warning" />
                                    <p className="text-xs font-semibold text-text">
                                        Pending approvals ({approvalsCount})
                                    </p>
                                </div>
                                {approvalsPreview.map((applicant) => (
                                    <Link
                                        key={`approval-${applicant.id}`}
                                        href={route('team')}
                                        className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {initials(applicant.name)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-text">
                                                {applicant.name}
                                            </p>
                                            <p className="truncate text-[11px] text-text-muted">
                                                {applicant.department
                                                    ? `Requested ${applicant.department}`
                                                    : applicant.email}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                {approvalsCount > approvalsPreview.length && (
                                    <Link
                                        href={route('team')}
                                        className="block px-4 py-2 text-center text-[11px] font-medium text-primary transition-colors hover:text-primary-hover"
                                    >
                                        View all {approvalsCount} →
                                    </Link>
                                )}
                            </div>
                        )}

                        {taskCount > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <ClipboardList className="h-3.5 w-3.5 text-primary" />
                                        <p className="text-xs font-semibold text-text">
                                            Task assignments ({taskCount})
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(route('notifications.readAll'), {}, { preserveScroll: true })
                                        }
                                        className="text-[11px] font-medium text-text-muted transition-colors hover:text-text"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                {taskPreview.map((notification) => (
                                    <Link
                                        key={`task-${notification.id}`}
                                        href={route('notifications.read', notification.id)}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                                    >
                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <ClipboardList className="h-3.5 w-3.5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-text">
                                                {notification.task_title ?? 'A task'}
                                            </p>
                                            <p className="truncate text-[11px] text-text-muted">
                                                Assigned by {notification.assigned_by} ·{' '}
                                                {timeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                {taskCount > taskPreview.length && (
                                    <Link
                                        href={route('my-tasks')}
                                        className="block px-4 py-2 text-center text-[11px] font-medium text-primary transition-colors hover:text-primary-hover"
                                    >
                                        View all {taskCount} →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </PopoverPanel>
        </Popover>
    );
}
