import { forwardRef, useId, useState } from 'react';

const FloatingInput = forwardRef(function FloatingInput(
    {
        label,
        error,
        type = 'text',
        value,
        className = '',
        rightSlot = null,
        onFocus,
        onBlur,
        ...props
    },
    ref,
) {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const id = props.id || generatedId;
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    // Native date/time inputs always render their own placeholder segments
    // (mm/dd/yyyy) regardless of the `placeholder` attribute, so the label
    // must stay floated up top or it overlaps that text even when empty.
    const alwaysFloated = type === 'date' || type === 'time' || type === 'datetime-local';
    const floated = focused || hasValue || alwaysFloated;

    return (
        <div className={className}>
            <div
                className={`relative rounded-input border bg-surface-2 transition-all duration-200 ${
                    error
                        ? 'border-danger shadow-[0_0_0_1px_var(--danger)]'
                        : focused
                          ? 'border-primary shadow-glow'
                          : 'border-border hover:border-text-muted/60'
                }`}
            >
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    value={value}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    className="peer w-full rounded-input border-0 bg-transparent px-4 pb-2 pt-5 text-sm text-text placeholder-transparent outline-none focus:ring-0"
                    placeholder={label}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                        floated
                            ? 'top-2 text-[11px] text-text-muted'
                            : 'top-1/2 -translate-y-1/2 text-sm text-text-muted'
                    } ${focused ? '!text-primary' : ''}`}
                >
                    {label}
                </label>
                {rightSlot && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightSlot}
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
        </div>
    );
});

export default FloatingInput;
