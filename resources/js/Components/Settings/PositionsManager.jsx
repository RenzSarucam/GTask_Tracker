import ConfirmDialog from '@/Components/ConfirmDialog';
import { router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

function AddDepartmentForm() {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    function submit(e) {
        e.preventDefault();
        post(route('departments.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    }

    return (
        <div className="mb-4 rounded-card border border-dashed border-border bg-surface p-5">
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text">New department</h3>
            </div>
            <form onSubmit={submit} className="mt-3 flex max-w-md gap-2">
                <div className="flex-1">
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g. Finance"
                        className="w-full rounded-input border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder-text-muted transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                </div>
                <button
                    type="submit"
                    disabled={processing || !data.name.trim()}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-input bg-primary px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    <Plus className="h-4 w-4" />
                    Add department
                </button>
            </form>
        </div>
    );
}

function AddPositionForm({ departmentId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        department_id: departmentId,
        name: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('positions.store'), {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    }

    return (
        <form onSubmit={submit} className="mt-3 flex gap-2">
            <div className="flex-1">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Add a position..."
                    className="w-full rounded-input border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder-text-muted transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>
            <button
                type="submit"
                disabled={processing || !data.name.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-input bg-primary px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
                <Plus className="h-4 w-4" />
                Add
            </button>
        </form>
    );
}

export default function PositionsManager({ departments }) {
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const filteredDepartments = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return departments;

        return departments.filter(
            (department) =>
                department.name.toLowerCase().includes(query) ||
                department.positions.some((p) => p.name.toLowerCase().includes(query)),
        );
    }, [departments, search]);

    function confirmDelete() {
        setDeleting(true);
        router.delete(route('positions.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    }

    return (
        <div>
            <AddDepartmentForm />

            <div className="relative mb-4 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search departments or positions..."
                    className="w-full rounded-input border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text placeholder-text-muted transition-all duration-200 focus:border-primary focus:shadow-glow focus:outline-none"
                />
            </div>

            {filteredDepartments.length === 0 ? (
                <p className="rounded-card border border-dashed border-border bg-surface p-5 text-sm text-text-muted">
                    No departments or positions match &quot;{search}&quot;.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredDepartments.map((department, i) => (
                        <motion.div
                            key={department.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25 }}
                            className="rounded-card border border-border bg-surface p-5"
                        >
                            <h3 className="text-sm font-semibold text-text">{department.name}</h3>

                            {department.positions.length === 0 ? (
                                <p className="mt-2 text-xs text-text-muted">No positions yet.</p>
                            ) : (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {department.positions.map((position) => (
                                        <span
                                            key={position.id}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-3 pr-1.5 text-xs font-medium text-text"
                                        >
                                            {position.name}
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(position)}
                                                className="rounded-full p-0.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                                                aria-label={`Remove ${position.name}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <AddPositionForm departmentId={department.id} />
                        </motion.div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                title="Remove this position?"
                message={`"${deleteTarget?.name}" will be removed. Team members currently holding it will have no position assigned.`}
                confirmLabel="Remove"
            />
        </div>
    );
}
