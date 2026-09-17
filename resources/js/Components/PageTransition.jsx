import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ pageKey, children }) {
    const shouldReduceMotion = useReducedMotion();

    const variants = shouldReduceMotion
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -12 },
          };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pageKey}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.25, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
