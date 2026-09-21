import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, UserCheck } from 'lucide-react';

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

export default function NotificationBell() {
    const { props } = usePage();
    const count = props.pendingApprovalsCount ?? 0;
    const preview = props.pendingApprovalsPreview ?? [];

    if (count === 0) return null;

    return (
        <Popover className="relative">
            <PopoverButton
                className="relative shrink-0 rounded-input p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus:outline-none"
                aria-label={`${count} pending approval${count === 1 ? '' : 's'}`}
            >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
                    {count}
                </span>
            </PopoverButton>

            <PopoverPanel
                transition
                anchor={{ to: 'bottom end', gap: 10 }}
                className="z-50 w-80 overflow-hidden rounded-input border border-border bg-surface-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] transition duration-150 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <UserCheck className="h-4 w-4 text-warning" />
                    <p className="text-sm font-semibold text-text">
                        Pending approvals ({count})
                    </p>
                </div>

                <div className="max-h-72 overflow-y-auto py-1">
                    {preview.map((applicant) => (
                        <Link
                            key={applicant.id}
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
                </div>

                <Link
                    href={route('team')}
                    className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                >
                    {count > preview.length ? `View all ${count} →` : 'Review in Team →'}
                </Link>
            </PopoverPanel>
        </Popover>
    );
}
