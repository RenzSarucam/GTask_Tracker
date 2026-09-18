export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-[6px] border-border bg-surface-2 text-primary shadow-sm focus:ring-primary focus:ring-offset-0 ' +
                className
            }
        />
    );
}
