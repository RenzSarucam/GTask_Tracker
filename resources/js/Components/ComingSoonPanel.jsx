import { motion } from 'framer-motion';

export default function ComingSoonPanel({ icon: Icon, message }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-6 py-20 text-center"
        >
            {Icon && (
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                </span>
            )}
            <p className="text-lg font-semibold text-text">Coming soon</p>
            <p className="mt-1 max-w-sm text-sm text-text-muted">{message}</p>
        </motion.div>
    );
}
