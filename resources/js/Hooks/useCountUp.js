import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function useCountUp(target, duration = 900) {
    const shouldReduceMotion = useReducedMotion();
    const [value, setValue] = useState(shouldReduceMotion ? target : 0);
    const frame = useRef(null);

    useEffect(() => {
        if (shouldReduceMotion) {
            setValue(target);
            return;
        }

        const start = performance.now();
        const from = 0;

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(from + (target - from) * eased));

            if (progress < 1) {
                frame.current = requestAnimationFrame(tick);
            }
        };

        frame.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame.current);
    }, [target, duration, shouldReduceMotion]);

    return value;
}
