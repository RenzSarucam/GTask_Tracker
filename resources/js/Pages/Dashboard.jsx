import DueSoonList from '@/Components/Dashboard/DueSoonList';
import RecentActivity from '@/Components/Dashboard/RecentActivity';
import StatCard from '@/Components/Dashboard/StatCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListChecks, TriangleAlert } from 'lucide-react';

export default function Dashboard({ stats, dueSoon, recentActivity }) {
    const { auth } = usePage().props;
    const isStaff = auth.user.role === 'staff';

    const cards = [
        {
            key: 'total',
            label: 'Total Tasks',
            icon: ListChecks,
            iconClassName: 'bg-primary/10 text-primary',
        },
        {
            key: 'in_progress',
            label: 'In Progress',
            icon: Clock,
            iconClassName: 'bg-warning/10 text-warning',
        },
        {
            key: 'completed',
            label: 'Completed',
            icon: CheckCircle2,
            iconClassName: 'bg-success/10 text-success',
        },
        {
            key: 'overdue',
            label: 'Overdue',
            icon: TriangleAlert,
            iconClassName: 'bg-danger/10 text-danger',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                {cards.map((card) => (
                    <StatCard
                        key={card.key}
                        icon={card.icon}
                        label={card.label}
                        iconClassName={card.iconClassName}
                        value={stats[card.key].value}
                        change={stats[card.key].change}
                        positiveIsGood={stats[card.key].positiveIsGood}
                    />
                ))}
            </motion.div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DueSoonList
                    items={dueSoon}
                    title={isStaff ? 'My tasks due soon' : 'Team tasks due soon'}
                    viewAllRoute={isStaff ? 'my-tasks' : 'board'}
                />
                <RecentActivity items={recentActivity} />
            </div>
        </>
    );
}

Dashboard.layout = (page) => (
    <AuthenticatedLayout title="Dashboard" subtitle="Overview of your team's work">
        {page}
    </AuthenticatedLayout>
);
