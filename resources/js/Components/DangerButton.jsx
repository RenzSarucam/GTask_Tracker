export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center gap-2 rounded-input bg-danger px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-danger/90 hover:shadow-[0_0_20px_-4px_rgba(239,68,68,0.55)] focus:outline-none active:scale-[0.97] ${
                    disabled && 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
