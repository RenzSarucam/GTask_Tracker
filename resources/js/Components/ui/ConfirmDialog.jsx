import Modal from '@/Components/Modal';
import Button from '@/Components/ui/Button';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * Themed replacement for window.confirm() — used for destructive actions
 * (delete team member, reject an application, etc.) where a plain browser
 * dialog would look jarring against the dark UI.
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    processing = false,
}) {
    return (
        <Modal show={open} onClose={processing ? () => {} : onClose} maxWidth="sm">
            <div className="p-6">
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger"
                >
                    <AlertTriangle className="h-6 w-6" />
                </motion.div>

                <h2 className="mt-4 text-lg font-semibold text-text">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{message}</p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-input px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <Button
                        type="button"
                        variant="danger"
                        processing={processing}
                        onClick={onConfirm}
                        className="px-4 py-2.5"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
