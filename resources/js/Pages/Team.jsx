import ComingSoonPanel from '@/Components/ComingSoonPanel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function Team() {
    return (
        <>
            <Head title="Team" />

            <ComingSoonPanel
                icon={Users}
                message="A list of team members with role and assigned-task counts is coming in Phase 9."
            />
        </>
    );
}

Team.layout = (page) => (
    <AuthenticatedLayout title="Team" subtitle="Everyone on the ICT/R&D team">
        {page}
    </AuthenticatedLayout>
);
