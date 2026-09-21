import SelectOrCreate from '@/Components/ui/SelectOrCreate';
import { router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

const inputClass =
    'w-full rounded-input border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text hover:border-primary/50';

export default function PendingApprovalCard({ applicant, departments }) {
    const [busy, setBusy] = useState(false);
    const [departmentId, setDepartmentId] = useState(applicant.department_id ?? '');
    const [newDepartmentName, setNewDepartmentName] = useState(applicant.requested_department_name ?? '');
    const [positionId, setPositionId] = useState(applicant.position_id ?? '');
    const [newPositionName, setNewPositionName] = useState(applicant.requested_position_name ?? '');
    const [errors, setErrors] = useState({});

    const availablePositions = departments.find((d) => String(d.id) === String(departmentId))?.positions ?? [];

    function approve() {
        setBusy(true);
        router.post(
            route('users.approve', applicant.id),
            {
                department_id: departmentId || null,
                new_department_name: departmentId ? null : newDepartmentName || null,
                position_id: positionId || null,
                new_position_name: positionId ? null : newPositionName || null,
            },
            {
                preserveScroll: true,
                onError: setErrors,
                onFinish: () => setBusy(false),
            },
        );
    }

    function reject() {
        if (!confirm(`Reject ${applicant.name}'s registration? This deletes the pending account.`)) return;

        setBusy(true);
        router.post(
            route('users.reject', applicant.id),
            {},
            { preserveScroll: true, onFinish: () => setBusy(false) },
        );
    }

    return (
        <div className="rounded-card border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{applicant.name}</p>
                    <p className="truncate text-xs text-text-muted">{applicant.email}</p>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-text-muted">
                        Department
                        {applicant.requested_department_name && !applicant.department_id && (
                            <span className="ml-1 text-accent">(requested: {applicant.requested_department_name})</span>
                        )}
                    </label>
                    <SelectOrCreate
                        options={departments.map((d) => ({ value: d.id, label: d.name }))}
                        value={departmentId}
                        onChange={(v) => {
                            setDepartmentId(v);
                            setPositionId('');
                        }}
                        newValue={newDepartmentName}
                        onNewValueChange={(v) => {
                            setNewDepartmentName(v);
                            setPositionId('');
                        }}
                        placeholder="Select department"
                        newPlaceholder="e.g. Marketing"
                        addNewLabel="+ Create new department"
                        disabled={busy}
                        buttonClassName={inputClass}
                    />
                    {(errors.department_id || errors.new_department_name) && (
                        <p className="mt-1 text-[11px] text-danger">
                            {errors.department_id || errors.new_department_name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-[11px] font-medium text-text-muted">
                        Position
                        {applicant.requested_position_name && !applicant.position_id && (
                            <span className="ml-1 text-accent">(requested: {applicant.requested_position_name})</span>
                        )}
                    </label>
                    <SelectOrCreate
                        options={availablePositions.map((p) => ({ value: p.id, label: p.name }))}
                        value={positionId}
                        onChange={setPositionId}
                        newValue={newPositionName}
                        onNewValueChange={setNewPositionName}
                        placeholder="No position"
                        newPlaceholder="e.g. Web Developer"
                        addNewLabel="+ Create new position"
                        disabled={busy}
                        buttonClassName={inputClass}
                    />
                    {errors.position_id && <p className="mt-1 text-[11px] text-danger">{errors.position_id}</p>}
                </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
                <button
                    type="button"
                    disabled={busy}
                    onClick={reject}
                    className="inline-flex items-center gap-1 rounded-input px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
                >
                    <X className="h-3.5 w-3.5" />
                    Reject
                </button>
                <button
                    type="button"
                    disabled={busy}
                    onClick={approve}
                    className="inline-flex items-center gap-1 rounded-input bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                </button>
            </div>
        </div>
    );
}
