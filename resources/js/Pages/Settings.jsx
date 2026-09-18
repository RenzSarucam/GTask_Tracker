import ComingSoonPanel from '@/Components/ComingSoonPanel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    return (
        <>
            <Head title="Settings" />

            <ComingSoonPanel
                icon={SettingsIcon}
                message="App-wide settings are coming soon. In the meantime, manage your account from Profile."
            />

            <div className="mt-4 text-center">
                <Link
                    href={route('profile.edit')}
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                >
                    Go to Profile settings &rarr;
                </Link>
            </div>
        </>
    );
}

Settings.layout = (page) => (
    <AuthenticatedLayout title="Settings" subtitle="App preferences">
        {page}
    </AuthenticatedLayout>
);
