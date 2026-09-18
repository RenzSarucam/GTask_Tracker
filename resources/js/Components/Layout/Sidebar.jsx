import Dropdown from '@/Components/Layout/UserDropdown';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    CalendarDays,
    ChevronsLeft,
    ChevronsRight,
    Columns3,
    LayoutDashboard,
    ListChecks,
    ListTodo,
    Settings,
    Users,
    X,
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', route: 'dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', route: 'my-tasks', icon: ListTodo },
    { label: 'Board', route: 'board', icon: Columns3 },
    { label: 'Calendar', route: 'calendar', icon: CalendarDays },
    { label: 'Team', route: 'team', icon: Users },
    { label: 'Reports', route: 'reports', icon: BarChart3 },
    { label: 'Settings', route: 'settings', icon: Settings },
];

function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'U';
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile, user }) {
    return (
        <>
            {/* Mobile scrim */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <motion.aside
                animate={{ width: collapsed ? 84 : 264 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between px-4">
                    <Link href={route('dashboard')} className="flex min-w-0 items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary shadow-glow">
                            <ListChecks className="h-5 w-5 text-white" />
                        </span>
                        {!collapsed && (
                            <span className="truncate text-sm font-semibold tracking-tight text-text">
                                GAISANO Task Tracker
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="rounded-md p-1 text-text-muted hover:text-text lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = route().current(item.route) || route().current(`${item.route}.*`);

                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`group relative flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-primary text-white shadow-glow'
                                        : 'text-text-muted hover:translate-x-0.5 hover:bg-surface-2 hover:text-text'
                                }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="h-[18px] w-[18px] shrink-0" />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 border-t border-border p-3">
                    <Dropdown collapsed={collapsed} user={user} initials={initials(user?.name)} />
                </div>

                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted shadow-md transition-all duration-200 hover:text-text hover:shadow-glow lg:flex"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <ChevronsRight className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronsLeft className="h-3.5 w-3.5" />
                    )}
                </button>
            </motion.aside>
        </>
    );
}
