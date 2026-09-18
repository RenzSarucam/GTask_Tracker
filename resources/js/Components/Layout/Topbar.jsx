import Button from '@/Components/ui/Button';
import { LayoutGrid, List, Menu, Plus, Search, SlidersHorizontal } from 'lucide-react';

export default function Topbar({
    title,
    subtitle,
    search,
    onSearchChange,
    view,
    onViewChange,
    onFilterClick,
    onNewTask,
    onMenuClick,
}) {
    return (
        <header className="sticky top-0 z-20 border-b border-border bg-bg/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-input p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0 flex-1">
                    {title && (
                        <h1 className="truncate text-lg font-semibold text-text sm:text-xl">
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="mt-0.5 truncate text-sm text-text-muted">{subtitle}</p>
                    )}
                </div>

                <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                    {onSearchChange && (
                        <div className="relative hidden w-full max-w-xs md:block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                value={search ?? ''}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-input border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text placeholder-text-muted transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                            />
                        </div>
                    )}

                    {onFilterClick && (
                        <button
                            type="button"
                            onClick={onFilterClick}
                            className="inline-flex items-center gap-1.5 rounded-input border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-text"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>
                    )}

                    {onViewChange && (
                        <div className="flex items-center rounded-input border border-border bg-surface-2 p-0.5">
                            <button
                                type="button"
                                onClick={() => onViewChange('list')}
                                aria-label="List view"
                                className={`rounded-[8px] p-1.5 transition-colors duration-150 ${
                                    view === 'list'
                                        ? 'bg-primary text-white'
                                        : 'text-text-muted hover:text-text'
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onViewChange('board')}
                                aria-label="Board view"
                                className={`rounded-[8px] p-1.5 transition-colors duration-150 ${
                                    view === 'board'
                                        ? 'bg-primary text-white'
                                        : 'text-text-muted hover:text-text'
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {onNewTask && (
                        <Button variant="primary" onClick={onNewTask} className="px-4 py-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Task</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
