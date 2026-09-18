import ComingSoonPanel from '@/Components/ComingSoonPanel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';

export default function Calendar() {
    return (
        <>
            <Head title="Calendar" />

            <ComingSoonPanel icon={CalendarDays} message="A calendar view of task due dates is coming soon." />
        </>
    );
}

Calendar.layout = (page) => (
    <AuthenticatedLayout title="Calendar" subtitle="Upcoming due dates at a glance">
        {page}
    </AuthenticatedLayout>
);
