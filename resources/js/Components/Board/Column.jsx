import TaskCard from '@/Components/Board/TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const DOT_COLORS = {
    todo: 'bg-text-muted',
    in_progress: 'bg-warning',
    done: 'bg-success',
};

export default function Column({ id, title, tasks, onTaskClick }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div className="flex w-full min-w-[280px] flex-1 flex-col rounded-card border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${DOT_COLORS[id]}`} />
                    <h3 className="text-sm font-semibold text-text">{title}</h3>
                </div>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-muted">
                    {tasks.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={`min-h-[120px] flex-1 space-y-2.5 p-3 pb-4 transition-colors duration-150 ${
                    isOver ? 'bg-primary/5' : ''
                }`}
            >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            disabled={!task.can_update}
                            onClick={() => onTaskClick?.(task)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
