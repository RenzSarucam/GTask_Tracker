import Modal from '@/Components/Modal';
import Button from '@/Components/ui/Button';
import FloatingInput from '@/Components/ui/FloatingInput';
import SelectOrCreate from '@/Components/ui/SelectOrCreate';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useMemo } from 'react';

const inputClass =
    'w-full rounded-input border border-border bg-surface-2 px-3 py-2.5 text-sm text-text hover:border-primary/50';

const ROLE_OPTIONS = [
    { value: 'staff', label: 'Staff' },
    { value: 'manager', label: 'Manager' },
];

export default function AddMemberModal({ open, onClose, departments = [] }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        role: 'staff',
        department_id: '',
        new_department_name: '',
        position_id: '',
        new_position_name: '',
    });

    const availablePositions = useMemo(() => {
        const department = departments.find((d) => String(d.id) === String(data.department_id));
        return department?.positions ?? [];
    }, [departments, data.department_id]);

    function close() {
        clearErrors();
        reset();
        onClose();
    }

    function submit(e) {
        e.preventDefault();

        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: close,
        });
    }

    return (
        <Modal show={open} onClose={close} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">Add team member</h2>
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-input p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="mt-1 text-sm text-text-muted">
                    Creates the account immediately — no approval step needed since you're the admin.
                    Login details are emailed to them.
                </p>

                <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FloatingInput
                            id="first_name"
                            label="First name"
                            value={data.first_name}
                            autoFocus
                            error={errors.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <FloatingInput
                            id="last_name"
                            label="Last name"
                            value={data.last_name}
                            error={errors.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                    </div>

                    <FloatingInput
                        id="email"
                        type="email"
                        label="Email"
                        value={data.email}
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-text-muted">Role</label>
                        <div className="flex gap-2">
                            {ROLE_OPTIONS.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setData('role', r.value)}
                                    className={`flex-1 rounded-input border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                        data.role === r.value
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-border bg-surface-2 text-text-muted hover:text-text'
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                        {errors.role && <p className="mt-1.5 text-xs text-danger">{errors.role}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Department <span className="text-text-muted/60">(optional)</span>
                            </label>
                            <SelectOrCreate
                                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                                value={data.department_id}
                                onChange={(v) => {
                                    setData((prev) => ({ ...prev, department_id: v, position_id: '' }));
                                }}
                                newValue={data.new_department_name}
                                onNewValueChange={(v) => {
                                    setData((prev) => ({ ...prev, new_department_name: v, position_id: '' }));
                                }}
                                placeholder="Select department"
                                newPlaceholder="e.g. Marketing"
                                addNewLabel="+ Add new department"
                                buttonClassName={inputClass}
                            />
                            {(errors.department_id || errors.new_department_name) && (
                                <p className="mt-1.5 text-xs text-danger">
                                    {errors.department_id || errors.new_department_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Position <span className="text-text-muted/60">(optional)</span>
                            </label>
                            <SelectOrCreate
                                options={availablePositions.map((p) => ({ value: p.id, label: p.name }))}
                                value={data.position_id}
                                onChange={(v) => setData('position_id', v)}
                                newValue={data.new_position_name}
                                onNewValueChange={(v) => setData('new_position_name', v)}
                                placeholder="Select position"
                                newPlaceholder="e.g. Web Developer"
                                addNewLabel="+ Add new position"
                                buttonClassName={inputClass}
                            />
                            {errors.position_id && (
                                <p className="mt-1.5 text-xs text-danger">{errors.position_id}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-input px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                        Cancel
                    </button>
                    <Button type="submit" variant="primary" processing={processing} className="px-5 py-2.5">
                        Create account
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
