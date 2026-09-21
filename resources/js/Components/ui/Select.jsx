import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Custom-styled dropdown replacing the native <select>, whose option list
 * is rendered by the OS and can't be themed (shows up as a jarring white
 * popup in an otherwise dark app).
 *
 * ListboxOptions uses Headless UI's `anchor` positioning, which renders the
 * panel into a portal on <body>. This is deliberate, not just cosmetic: a
 * plain `position: absolute` panel gets silently clipped by any ancestor
 * with `overflow-hidden` (e.g. the animated height wrapper around the My
 * Tasks filter row), cutting the option list down to whatever sliver of
 * space happens to be visible.
 */
export default function Select({
    value,
    onChange,
    options,
    disabled,
    placeholder = 'Select...',
    buttonClassName = '',
    align = 'left',
}) {
    const selected = options.find((o) => String(o.value) === String(value));

    return (
        <Listbox value={value} onChange={onChange} disabled={disabled}>
            <ListboxButton
                className={`flex items-center justify-between gap-1.5 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
            >
                <span className="truncate">{selected?.label ?? placeholder}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
            </ListboxButton>

            <ListboxOptions
                transition
                anchor={{ to: align === 'right' ? 'bottom end' : 'bottom start', gap: 6 }}
                className="z-50 w-[var(--button-width)] min-w-[10rem] overflow-hidden rounded-input border border-border bg-surface-2 py-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] transition duration-150 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {options.map((option) => (
                    <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="group flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm text-text data-[focus]:bg-white/5"
                    >
                        <span className="truncate">{option.label}</span>
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary opacity-0 group-data-[selected]:opacity-100" />
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}
