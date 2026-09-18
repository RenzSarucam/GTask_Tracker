import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Briefcase, ListChecks, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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

export default function Team({ members, canManage }) {
    const [pendingId, setPendingId] = useState(null);

    function changeRole(member, role) {
        if (role === member.role) return;
        setPendingId(member.id);
        router.patch(
            route('users.update', member.id),
            { role },
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

    return (
        <>
            <Head title="Team" />

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

                        <div className="mt-4 flex items-center justify-between">
                            {canManage && !member.is_self ? (
                                <select
                                    value={member.role}
                                    disabled={pendingId === member.id}
                                    onChange={(e) => changeRole(member, e.target.value)}
                                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${ROLE_STYLES[member.role]}`}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="staff">Staff</option>
                                </select>
                            ) : (
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[member.role]}`}
                                >
                                    {ROLE_LABELS[member.role]}
                                </span>
                            )}

                            {canManage && !member.is_self && (
                                <button
                                    type="button"
                                    disabled={pendingId === member.id}
                                    onClick={() => toggleActive(member)}
                                    className="text-xs font-medium text-text-muted transition-colors hover:text-text disabled:opacity-50"
                                >
                                    {member.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
}

Team.layout = (page) => (
    <AuthenticatedLayout title="Team" subtitle="Everyone on the ICT/R&D team">
        {page}
    </AuthenticatedLayout>
);
