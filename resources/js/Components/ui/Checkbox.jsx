import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Checkbox({ checked, onChange, className = '', ...props }) {
    return (
        <label className={`inline-flex cursor-pointer items-center ${className}`}>
            <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded-[6px] border border-border bg-surface-2 transition-colors duration-150 checked:border-primary checked:bg-primary focus:outline-none focus-visible:shadow-glow"
                    {...props}
                />
                <motion.span
                    initial={false}
                    animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </motion.span>
            </span>
        </label>
    );
}
