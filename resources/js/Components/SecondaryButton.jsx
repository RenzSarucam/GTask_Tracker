export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center gap-2 rounded-input border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 focus:outline-none focus-visible:shadow-glow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
