import AddMemberModal from '@/Components/Team/AddMemberModal';
import PendingApprovalCard from '@/Components/Team/PendingApprovalCard';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import Select from '@/Components/ui/Select';
import { useRegisterTopbar } from '@/Contexts/TopbarContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, ListChecks, ShieldCheck, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
];

const ROLE_STYLES = {
    admin: 'bg-primary/10 text-primary',
    manager: 'bg-warning/10 text-warning',
    staff: 'bg-white/10 text-text-muted',
};

const ROLE_LABELS = {
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
};

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

const AVATAR_COLORS = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-danger'];

function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function Team({
    members,
    positionsByDepartment,
    departments,
    pendingApprovals,
    canManage,
    status,
}) {
    const [pendingId, setPendingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [addMemberOpen, setAddMemberOpen] = useState(false);

    useRegisterTopbar({
        onNewTask: canManage ? () => setAddMemberOpen(true) : undefined,
        newTaskLabel: 'Add member',
    });

    function changeRole(member, role) {
        if (role === member.role) return;
        setPendingId(member.id);
        router.patch(
            route('users.update', member.id),
            { role },
            { preserveScroll: true, onFinish: () => setPendingId(null) },
        );
    }

    function changePosition(member, positionId) {
        setPendingId(member.id);
        router.patch(
            route('users.update', member.id),
            { position_id: positionId || null },
            { preserveScroll: true, onFinish: () => setPendingId(null) },
        );
    }

    function toggleActive(member) {
        setPendingId(member.id);
        router.patch(
            route('users.update', member.id),
            { is_active: !member.is_active },
            { preserveScroll: true, onFinish: () => setPendingId(null) },
        );
    }

    function confirmDelete() {
        if (!deleteTarget) return;

        setDeleting(true);
        router.delete(route('users.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onError: (errors) => setDeleteError(errors.delete ?? 'Something went wrong.'),
            onFinish: () => setDeleting(false),
        });
    }

    return (
        <>
            <Head title="Team" />

            {status && (
                <div className="mb-6 rounded-input border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            {canManage && pendingApprovals?.length > 0 && (
                <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-warning" />
                        <h2 className="text-sm font-semibold text-text">
                            Pending approvals ({pendingApprovals.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {pendingApprovals.map((applicant) => (
                            <PendingApprovalCard
                                key={applicant.id}
                                applicant={applicant}
                                departments={departments}
                            />
                        ))}
                    </div>
                </div>
            )}

            <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
                {members.map((member) => (
                    <motion.div
                        key={member.id}
                        variants={{
                            hidden: { opacity: 0, y: 12 },
                            show: { opacity: 1, y: 0 },
                        }}
                        className={`rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 ${
                            !member.is_active ? 'opacity-60' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(member.id)}`}
                            >
                                {initials(member.name)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-text">
                                    {member.name}
                                    {member.is_self && (
                                        <span className="ml-1.5 text-xs font-normal text-text-muted">
                                            (you)
                                        </span>
                                    )}
                                </p>
                                <p className="truncate text-xs text-text-muted">{member.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-text-muted">
                            {member.department && (
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    {member.department}
                                    {member.employee_id && ` · ${member.employee_id}`}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <ListChecks className="h-3.5 w-3.5" />
                                {member.tasks_count} assigned {member.tasks_count === 1 ? 'task' : 'tasks'}
                            </div>
                            {!member.is_active && (
                                <div className="flex items-center gap-1.5 text-danger">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Deactivated
                                </div>
                            )}
                        </div>

                        {(() => {
                            const availablePositions = positionsByDepartment?.[member.department_id] ?? [];

                            if (canManage && !member.is_self && availablePositions.length > 0) {
                                return (
                                    <div className="mt-3">
                                        <Select
                                            value={member.position_id ?? ''}
                                            disabled={pendingId === member.id}
                                            onChange={(v) => changePosition(member, v)}
                                            placeholder="No position"
                                            options={[
                                                { value: '', label: 'No position' },
                                                ...availablePositions.map((p) => ({
                                                    value: p.id,
                                                    label: p.name,
                                                })),
                                            ]}
                                            buttonClassName="w-full rounded-input border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text hover:border-primary/50"
                                        />
                                    </div>
                                );
                            }

                            if (member.position) {
                                return (
                                    <p className="mt-3 text-xs font-medium text-text-muted">
                                        {member.position}
                                    </p>
                                );
                            }

                            return null;
                        })()}

                        <div className="mt-4 flex items-center justify-between">
                            {canManage && !member.is_self ? (
                                <Select
                                    value={member.role}
                                    disabled={pendingId === member.id}
                                    onChange={(v) => changeRole(member, v)}
                                    options={ROLE_OPTIONS}
                                    buttonClassName={`rounded-full px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary ${ROLE_STYLES[member.role]}`}
                                />
                            ) : (
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[member.role]}`}
                                >
                                    {ROLE_LABELS[member.role]}
                                </span>
                            )}

                            {canManage && !member.is_self && (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={pendingId === member.id}
                                        onClick={() => toggleActive(member)}
                                        className="text-xs font-medium text-text-muted transition-colors hover:text-text disabled:opacity-50"
                                    >
                                        {member.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={pendingId === member.id}
                                        onClick={() => {
                                            setDeleteError(null);
                                            setDeleteTarget(member);
                                        }}
                                        title={
                                            member.created_tasks_count > 0
                                                ? "Created tasks — can't be deleted until those are reassigned or removed"
                                                : 'Delete permanently'
                                        }
                                        className="text-text-muted transition-colors hover:text-danger disabled:opacity-50"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AddMemberModal
                open={addMemberOpen}
                onClose={() => setAddMemberOpen(false)}
                departments={departments}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => {
                    setDeleteTarget(null);
                    setDeleteError(null);
                }}
                onConfirm={confirmDelete}
                processing={deleting}
                confirmLabel="Delete permanently"
                title={`Delete ${deleteTarget?.name ?? 'this member'}?`}
                message={
                    deleteError ??
                    "This permanently removes their account and can't be undone. Consider Deactivate instead if you might need this account again."
                }
            />
        </>
    );
}

Team.layout = (page) => (
    <AuthenticatedLayout title="Team" subtitle="Everyone across all departments">
        {page}
    </AuthenticatedLayout>
);
