import Modal from '@/Components/Modal';
import Button from '@/Components/ui/Button';

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    processing = false,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    danger = true,
}) {
    return (
        <Modal show={open} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-text">{title}</h2>
                {message && <p className="mt-2 text-sm text-text-muted">{message}</p>}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-input px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                        Cancel
                    </button>
                    <Button
                        type="button"
                        variant={danger ? 'primary' : 'primary'}
                        processing={processing}
                        onClick={onConfirm}
                        className={`px-5 py-2.5 ${danger ? '!bg-danger hover:!bg-danger/90' : ''}`}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
