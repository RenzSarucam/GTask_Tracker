export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center gap-2 rounded-input bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow focus:outline-none focus-visible:shadow-glow active:scale-[0.97] ${
                    disabled && 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
