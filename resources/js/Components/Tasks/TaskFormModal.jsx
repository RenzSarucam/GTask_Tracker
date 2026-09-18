import Modal from '@/Components/Modal';
import Button from '@/Components/ui/Button';
import Checkbox from '@/Components/ui/Checkbox';
import FloatingInput from '@/Components/ui/FloatingInput';
import { useForm } from '@inertiajs/react';
import { Trash2, X } from 'lucide-react';
import { useEffect } from 'react';

const PRIORITIES = [
    { value: 'low', label: 'Low', activeClass: 'bg-success text-white' },
    { value: 'medium', label: 'Medium', activeClass: 'bg-warning text-white' },
    { value: 'high', label: 'High', activeClass: 'bg-danger text-white' },
];

const STATUSES = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

export default function TaskFormModal({
    open,
    onClose,
    task = null,
    defaultStatus = 'todo',
    departments = [],
    assignableUsers = [],
    staffLimited = false,
    onDelete,
}) {
    const isEdit = Boolean(task);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        department_id: '',
        priority: 'medium',
        status: defaultStatus,
        due_date: '',
        progress: 0,
        assignee_ids: [],
    });

    useEffect(() => {
        if (!open) return;

        clearErrors();
        if (task) {
            setData({
                title: task.title ?? '',
                description: task.description ?? '',
                department_id: task.department_id ?? '',
                priority: task.priority ?? 'medium',
                status: task.status ?? 'todo',
                due_date: task.due_date ?? '',
                progress: task.progress ?? 0,
                assignee_ids: task.assignees?.map((a) => a.id) ?? [],
            });
        } else {
            reset();
            setData('status', defaultStatus);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task]);

    function toggleAssignee(id) {
        setData(
            'assignee_ids',
            data.assignee_ids.includes(id)
                ? data.assignee_ids.filter((a) => a !== id)
                : [...data.assignee_ids, id],
        );
    }

    function submit(e) {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: onClose };

        if (isEdit) {
            patch(route('tasks.update', task.id), options);
        } else {
            post(route('tasks.store'), options);
        }
    }

    return (
        <Modal show={open} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">
                        {isEdit ? 'Edit task' : 'New task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-input p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    {!staffLimited && (
                        <>
                            <FloatingInput
                                id="title"
                                label="Title"
                                value={data.title}
                                autoFocus
                                error={errors.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-1.5 block text-xs font-medium text-text-muted"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-input border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder-text-muted transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                                    placeholder="Optional details..."
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-danger">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                        Department
                                    </label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className="w-full rounded-input border border-border bg-surface-2 px-3 py-2.5 text-sm text-text transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                                    >
                                        <option value="">None</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <FloatingInput
                                    id="due_date"
                                    type="date"
                                    label="Due date"
                                    value={data.due_date ?? ''}
                                    error={errors.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                    Priority
                                </label>
                                <div className="flex gap-2">
                                    {PRIORITIES.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setData('priority', p.value)}
                                            className={`flex-1 rounded-input border px-3 py-2 text-sm font-medium capitalize transition-all duration-150 ${
                                                data.priority === p.value
                                                    ? `${p.activeClass} border-transparent`
                                                    : 'border-border bg-surface-2 text-text-muted hover:text-text'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-text-muted">
                            Status
                        </label>
                        <div className="flex gap-2">
                            {STATUSES.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => setData('status', s.value)}
                                    className={`flex-1 rounded-input border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                        data.status === s.value
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-border bg-surface-2 text-text-muted hover:text-text'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        {errors.status && <p className="mt-1.5 text-xs text-danger">{errors.status}</p>}
                    </div>

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-xs font-medium text-text-muted">Progress</label>
                            <span className="text-xs font-medium text-text">{data.progress}%</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={data.progress}
                            onChange={(e) => setData('progress', Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        {errors.progress && <p className="mt-1.5 text-xs text-danger">{errors.progress}</p>}
                    </div>

                    {!staffLimited && assignableUsers.length > 0 && (
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Assignees
                            </label>
                            <div className="max-h-36 space-y-1 overflow-y-auto rounded-input border border-border bg-surface-2 p-2">
                                {assignableUsers.map((u) => (
                                    <label
                                        key={u.id}
                                        className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-sm text-text transition-colors hover:bg-white/5"
                                    >
                                        <Checkbox
                                            checked={data.assignee_ids.includes(u.id)}
                                            onChange={() => toggleAssignee(u.id)}
                                        />
                                        {u.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {isEdit && task.can_delete && onDelete ? (
                        <button
                            type="button"
                            onClick={() => onDelete(task)}
                            className="inline-flex items-center gap-1.5 rounded-input px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    ) : (
                        <span />
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-input px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                        >
                            Cancel
                        </button>
                        <Button type="submit" variant="primary" processing={processing} className="px-5 py-2.5">
                            {isEdit ? 'Save changes' : 'Create task'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
