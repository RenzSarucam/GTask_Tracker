import useCountUp from '@/Hooks/useCountUp';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, change, positiveIsGood, iconClassName }) {
    const count = useCountUp(value);

    const isUp = change > 0;
    const isFlat = change === 0;
    const isGoodDirection = isUp ? positiveIsGood : !positiveIsGood;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
            }}
            className="rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
        >
            <div className="flex items-start justify-between">
                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${iconClassName ?? 'bg-primary/10 text-primary'}`}
                >
                    <Icon className="h-5 w-5" />
                </span>

                {!isFlat && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isGoodDirection ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}
                    >
                        {isUp ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>

            <p className="mt-4 text-3xl font-semibold tabular-nums text-text">{count}</p>
            <p className="mt-1 text-sm text-text-muted">{label}</p>
            <p className="mt-2 text-xs text-text-muted/70">vs last week</p>
        </motion.div>
    );
}
