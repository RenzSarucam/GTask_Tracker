import Select from '@/Components/ui/Select';
import { useState } from 'react';

/**
 * Pick an existing option, or type a brand new one (e.g. a department that
 * doesn't exist yet). Manages its own select/create mode internally so
 * callers only track two form fields: the picked id and the typed name.
 */
export default function SelectOrCreate({
    options,
    value,
    onChange,
    newValue,
    onNewValueChange,
    placeholder = 'Select...',
    newPlaceholder = 'Type a new one',
    addNewLabel = '+ Add new',
    disabled = false,
    buttonClassName = '',
}) {
    const [creating, setCreating] = useState(Boolean(newValue));

    if (creating) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newValue}
                    onChange={(e) => onNewValueChange(e.target.value)}
                    placeholder={newPlaceholder}
                    disabled={disabled}
                    autoFocus
                    className="w-full rounded-input border border-border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder-text-muted transition-all duration-150 focus:border-primary focus:shadow-glow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                    type="button"
                    onClick={() => {
                        setCreating(false);
                        onNewValueChange('');
                    }}
                    disabled={disabled}
                    className="shrink-0 whitespace-nowrap text-xs font-medium text-text-muted transition-colors hover:text-text"
                >
                    Use existing
                </button>
            </div>
        );
    }

    return (
        <Select
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(v) => {
                if (v === '__new__') {
                    setCreating(true);
                    onChange('');
                } else {
                    onChange(v);
                }
            }}
            options={[...options, { value: '__new__', label: addNewLabel }]}
            buttonClassName={buttonClassName}
        />
    );
}
