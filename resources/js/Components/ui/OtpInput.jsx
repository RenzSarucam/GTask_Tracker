import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * 6-digit code entry: one box per digit, auto-advancing focus, paste support,
 * and a small pop/flip animation per box when a digit lands (or clears).
 */
export default function OtpInput({ length = 6, value, onChange, error, disabled }) {
    const inputRefs = useRef([]);
    const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function setDigitAt(index, char) {
        const next = digits.slice();
        next[index] = char;
        onChange(next.join(''));
    }

    function handleChange(index, e) {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) {
            setDigitAt(index, '');
            return;
        }

        const chars = raw.split('');
        const next = digits.slice();
        let cursor = index;
        for (const char of chars) {
            if (cursor >= length) break;
            next[cursor] = char;
            cursor++;
        }
        onChange(next.join(''));

        const focusIndex = Math.min(cursor, length - 1);
        inputRefs.current[focusIndex]?.focus();
    }

    function handleKeyDown(index, e) {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                setDigitAt(index, '');
            } else if (index > 0) {
                setDigitAt(index - 1, '');
                inputRefs.current[index - 1]?.focus();
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const raw = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
        if (!raw) return;

        const next = raw.split('').concat(Array(length).fill('')).slice(0, length);
        onChange(next.join(''));
        inputRefs.current[Math.min(raw.length, length - 1)]?.focus();
    }

    return (
        <div>
            <div className="flex justify-center gap-2.5">
                {digits.map((digit, index) => (
                    <div key={index} className="relative h-14 w-11 sm:w-12">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={digit ? `filled-${digit}-${index}` : `empty-${index}`}
                                initial={{ opacity: 0, scale: 0.6, rotateX: -90 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="absolute inset-0"
                            >
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={length}
                                    value={digit}
                                    disabled={disabled}
                                    onChange={(e) => handleChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`h-14 w-11 sm:w-12 rounded-input border bg-surface-2 text-center text-xl font-semibold text-text transition-all duration-150 focus:shadow-glow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                                        error
                                            ? 'border-danger'
                                            : digit
                                              ? 'border-primary'
                                              : 'border-border focus:border-primary'
                                    }`}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            {error && <p className="mt-3 text-center text-xs text-danger">{error}</p>}
        </div>
    );
}
