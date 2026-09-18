import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarClock } from 'lucide-react';

const PRIORITY_STYLES = {
    high: 'bg-danger/10 text-danger',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success',
};

const AVATAR_COLORS = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-danger'];

function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

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

function formatDue(dateStr, isOverdue) {
    const date = new Date(dateStr + 'T00:00:00');
    return (
        (isOverdue ? 'Overdue · ' : '') +
        date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );
}

export default function TaskCard({ task, disabled, onClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        disabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`rounded-input border border-border bg-surface-2 p-3 transition-shadow duration-200 ${
                disabled ? (onClick ? 'cursor-pointer' : 'cursor-default') : 'cursor-grab active:cursor-grabbing'
            } ${
                isDragging
                    ? 'z-10 opacity-90 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]'
                    : 'hover:border-primary/40 hover:shadow-glow'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-text-muted">
                    {task.department ?? 'General'}
                </span>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
                >
                    {task.priority}
                </span>
            </div>

            <p className="mt-2.5 text-sm font-medium leading-snug text-text">{task.title}</p>

            <div className="mt-3 flex items-center justify-between">
                {task.due_date ? (
                    <span
                        className={`inline-flex items-center gap-1 text-xs ${
                            task.is_overdue ? 'text-danger' : 'text-text-muted'
                        }`}
                    >
                        <CalendarClock className="h-3.5 w-3.5" />
                        {formatDue(task.due_date, task.is_overdue)}
                    </span>
                ) : (
                    <span />
                )}

                <div className="flex -space-x-1.5">
                    {task.assignees.slice(0, 3).map((a) => (
                        <span
                            key={a.id}
                            title={a.name}
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white ring-2 ring-surface-2 ${avatarColor(a.id)}`}
                        >
                            {initials(a.name)}
                        </span>
                    ))}
                </div>
            </div>

            {task.status === 'in_progress' && (
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
