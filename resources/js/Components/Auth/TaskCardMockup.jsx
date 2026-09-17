import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const PRIORITY_STYLES = {
    high: 'bg-danger/15 text-danger',
    medium: 'bg-warning/15 text-warning',
    low: 'bg-success/15 text-success',
};

const STATUS_ICON = {
    done: CheckCircle2,
    progress: Clock,
    todo: Circle,
};

export default function TaskCardMockup({
    title,
    tag,
    priority = 'medium',
    progress,
    status = 'todo',
    avatarColor = 'bg-primary',
    className = '',
    floatDelay = 0,
    floatDuration = 9,
    floatDistance = 16,
}) {
    const StatusIcon = STATUS_ICON[status];

    return (
        <motion.div
            animate={{ y: [0, -floatDistance, 0], x: [0, floatDistance * 0.6, 0] }}
            transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatDelay,
            }}
            className={`w-48 rounded-[14px] border border-white/10 bg-surface/80 p-3 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-text-muted">
                    {tag}
                </span>
                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${PRIORITY_STYLES[priority]}`}
                >
                    {priority}
                </span>
            </div>

            <div className="mt-2.5 flex items-start gap-1.5">
                <StatusIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                <p className="text-xs font-medium leading-snug text-text">{title}</p>
            </div>

            {typeof progress === 'number' && (
                <div className="mt-3">
                    <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted">{progress}%</span>
                        <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold text-white ${avatarColor}`}
                        >
                            {tag?.[0] ?? 'G'}
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
