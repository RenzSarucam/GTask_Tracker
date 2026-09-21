import ConfirmDialog from '@/Components/ConfirmDialog';
import TaskFormModal from '@/Components/Tasks/TaskFormModal';
import Select from '@/Components/ui/Select';
import { useRegisterTopbar } from '@/Contexts/TopbarContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, ListTodo, Pencil, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const PRIORITY_STYLES = {
    high: 'bg-danger/10 text-danger',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success',
};

const STATUS_STYLES = {
    todo: 'bg-white/10 text-text-muted',
    in_progress: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success',
};

const STATUS_LABELS = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function MyTasks({ tasks, departments, assignableUsers, canCreate }) {
    const { auth } = usePage().props;
    const isStaff = auth.user.role === 'staff';

    const [search, setSearch] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const [modalState, setModalState] = useState({ open: false, task: null });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useRegisterTopbar({
        search,
        onSearchChange: setSearch,
        onFilterClick: () => setFiltersOpen((v) => !v),
        onNewTask: canCreate ? () => setModalState({ open: true, task: null }) : undefined,
    });

    const filtered = useMemo(() => {
        return tasks.filter((task) => {
            if (statusFilter && task.status !== statusFilter) return false;
            if (priorityFilter && task.priority !== priorityFilter) return false;
            if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [tasks, search, statusFilter, priorityFilter]);

    function openEdit(task) {
        setModalState({ open: true, task });
    }

    function closeModal() {
        setModalState((prev) => ({ ...prev, open: false }));
    }

    function confirmDelete() {
        setDeleting(true);
        router.delete(route('tasks.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
                closeModal();
            },
        });
    }

    return (
        <>
            <Head title="My Tasks" />

            <AnimatePresence>
                {filtersOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface p-4">
                            <SlidersHorizontal className="h-4 w-4 text-text-muted" />
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="All statuses"
                                options={[
                                    { value: '', label: 'All statuses' },
                                    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
                                        value,
                                        label,
                                    })),
                                ]}
                                buttonClassName="rounded-input border border-border bg-surface-2 px-3 py-2 text-sm text-text hover:border-primary/50"
                            />
                            <Select
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                                placeholder="All priorities"
                                options={[
                                    { value: '', label: 'All priorities' },
                                    { value: 'low', label: 'Low' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'high', label: 'High' },
                                ]}
                                buttonClassName="rounded-input border border-border bg-surface-2 px-3 py-2 text-sm text-text hover:border-primary/50"
                            />
                            {(statusFilter || priorityFilter) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter('');
                                        setPriorityFilter('');
                                    }}
                                    className="text-xs font-medium text-primary hover:text-primary-hover"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 py-20 text-center">
                    <ListTodo className="mb-3 h-8 w-8 text-text-muted" />
                    <p className="text-sm font-medium text-text">No tasks match</p>
                    <p className="mt-1 text-sm text-text-muted">
                        {tasks.length === 0
                            ? "You don't have any tasks assigned yet."
                            : 'Try adjusting your search or filters.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-card border border-border bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                                    <th className="px-4 py-3 font-medium">Task</th>
                                    <th className="px-4 py-3 font-medium">Department</th>
                                    <th className="px-4 py-3 font-medium">Priority</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Due date</th>
                                    <th className="px-4 py-3 font-medium">Progress</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((task, i) => (
                                    <motion.tr
                                        key={task.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03, duration: 0.2 }}
                                        className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2"
                                    >
                                        <td className="max-w-xs px-4 py-3">
                                            <p className="truncate font-medium text-text">{task.title}</p>
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {task.department ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
                                            >
                                                {STATUS_LABELS[task.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 ${
                                                    task.is_overdue ? 'text-danger' : 'text-text-muted'
                                                }`}
                                            >
                                                <CalendarClock className="h-3.5 w-3.5" />
                                                {formatDate(task.due_date)}
                                                {task.is_overdue && ' · Overdue'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-text-muted">
                                                    {task.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {task.can_update && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(task)}
                                                        className="rounded-input p-1.5 text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                                                        aria-label="Edit task"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {task.can_delete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(task)}
                                                        className="rounded-input p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                                                        aria-label="Delete task"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <TaskFormModal
                open={modalState.open}
                onClose={closeModal}
                task={modalState.task}
                departments={departments}
                assignableUsers={assignableUsers}
                staffLimited={isStaff}
                onDelete={(task) => setDeleteTarget(task)}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                title="Delete this task?"
                message={`"${deleteTarget?.title}" will be permanently removed.`}
                confirmLabel="Delete task"
            />
        </>
    );
}

MyTasks.layout = (page) => (
    <AuthenticatedLayout title="My Tasks" subtitle="Tasks assigned to you">
        {page}
    </AuthenticatedLayout>
);
