import ComingSoonPanel from '@/Components/ComingSoonPanel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart3 } from 'lucide-react';

export default function Reports() {
    return (
        <>
            <Head title="Reports" />

            <ComingSoonPanel icon={BarChart3} message="Team workload and throughput reports are coming soon." />
        </>
    );
}

Reports.layout = (page) => (
    <AuthenticatedLayout title="Reports" subtitle="Workload and progress insights">
        {page}
    </AuthenticatedLayout>
);
