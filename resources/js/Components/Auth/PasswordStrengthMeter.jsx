import { motion } from 'framer-motion';
import { useMemo } from 'react';

function scorePassword(password) {
    if (!password) return 0;

    const checks = [
        password.length >= 12,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^a-zA-Z0-9]/.test(password),
    ];

    return checks.filter(Boolean).length;
}

const LEVELS = [
    { label: 'Too short', color: 'bg-danger' },
    { label: 'Weak', color: 'bg-danger' },
    { label: 'Fair', color: 'bg-warning' },
    { label: 'Good', color: 'bg-warning' },
    { label: 'Strong', color: 'bg-success' },
    { label: 'Excellent', color: 'bg-success' },
];

export default function PasswordStrengthMeter({ password }) {
    const score = useMemo(() => scorePassword(password), [password]);
    const level = LEVELS[score];

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: i < score ? 1 : 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{ originX: 0 }}
                            className={`h-full ${level.color}`}
                        />
                    </div>
                ))}
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
                Strength: <span className="font-medium text-text">{level.label}</span> — use
                12+ characters with upper &amp; lower case, a number, and a symbol.
            </p>
        </div>
    );
}
