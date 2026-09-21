import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

const variantClasses = {
    primary:
        'relative overflow-hidden text-white bg-primary shadow-[0_0_0_1px_var(--primary)] disabled:opacity-60 disabled:cursor-not-allowed',
    secondary:
        'bg-surface-2 text-text border border-border hover:border-primary/60 disabled:opacity-60 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-surface-2 disabled:opacity-60',
    danger: 'text-white bg-danger shadow-[0_0_0_1px_var(--danger)] disabled:opacity-60 disabled:cursor-not-allowed',
};

const Button = forwardRef(function Button(
    {
        variant = 'primary',
        className = '',
        children,
        processing = false,
        disabled = false,
        type = 'button',
        ...props
    },
    ref,
) {
    const isDisabled = disabled || processing;

    return (
        <motion.button
            ref={ref}
            type={type}
            whileHover={isDisabled ? undefined : { y: -2 }}
            whileTap={isDisabled ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            disabled={isDisabled}
            className={`group inline-flex items-center justify-center gap-2 rounded-input px-5 py-2.5 text-sm font-medium transition-shadow duration-200 focus:outline-none ${variant === 'danger' ? 'hover:shadow-[0_0_20px_-4px_rgba(239,68,68,0.55)]' : 'hover:shadow-glow focus-visible:shadow-glow'} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {variant === 'primary' && (
                <span className="pointer-events-none absolute inset-0 -z-0 bg-gradient-shimmer bg-shimmer opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-shimmer" />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </span>
        </motion.button>
    );
});

export default Button;
