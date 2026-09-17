import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import { useEffect, useState } from 'react';
import TaskCardMockup from './TaskCardMockup';

const TAGLINES = [
    'Organize Work, Deliver Together',
    'Track Progress. Hit Every Deadline.',
    'One Board, Every Task, Total Clarity.',
];

export default function ShowcasePanel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((i) => (i + 1) % TAGLINES.length);
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative hidden h-full w-full overflow-hidden rounded-card bg-surface lg:block">
            {/* Abstract gradient scene */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.35),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(167,139,250,0.25),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(106,72,245,0.35),transparent_55%)]" />
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />

                <motion.div
                    animate={{ y: [0, 22, 0], x: [0, -14, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute right-[10%] top-[14%] h-20 w-20 rounded-full border border-white/10 bg-accent/10 backdrop-blur-sm"
                />
                <motion.div
                    animate={{ y: [0, -14, 0], x: [0, 16, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-[26%] right-[6%] h-16 w-16 rounded-[20px] border border-white/10 bg-primary/10 backdrop-blur-sm"
                />

                <TaskCardMockup
                    title="Redesign employee onboarding flow"
                    tag="ICT/R&D"
                    priority="high"
                    status="progress"
                    progress={65}
                    avatarColor="bg-primary"
                    floatDelay={0}
                    floatDuration={8}
                    className="absolute left-[8%] top-[16%] -rotate-3"
                />
                <TaskCardMockup
                    title="QA pass on POS sync module"
                    tag="Systems"
                    priority="medium"
                    status="todo"
                    avatarColor="bg-accent"
                    floatDelay={0.8}
                    floatDuration={9.5}
                    className="absolute right-[4%] top-[42%] rotate-2"
                />
                <TaskCardMockup
                    title="Deploy monthly sales report"
                    tag="Reports"
                    priority="low"
                    status="done"
                    progress={100}
                    avatarColor="bg-success"
                    floatDelay={1.4}
                    floatDuration={10}
                    className="absolute bottom-[24%] left-[14%] rotate-1"
                />
            </div>

            {/* Logo */}
            <Link
                href="/"
                className="absolute left-8 top-8 z-10 flex items-center gap-2 text-text"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary shadow-glow">
                    <ListChecks className="h-5 w-5 text-white" />
                </span>
                <span className="text-base font-semibold tracking-tight">
                    GAISANO Task Tracker
                </span>
            </Link>

            {/* Tagline carousel */}
            <div className="absolute bottom-10 left-8 right-8 z-10">
                <div className="h-20">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={active}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-2xl font-semibold leading-snug text-text"
                        >
                            {TAGLINES[active]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className="mt-4 flex gap-2">
                    {TAGLINES.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={`Show tagline ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === active ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
