import ComingSoonPanel from '@/Components/ComingSoonPanel';
import PositionsManager from '@/Components/Settings/PositionsManager';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings({ departments, canManagePositions }) {
    return (
        <>
            <Head title="Settings" />

            {canManagePositions ? (
                <div>
                    <h2 className="text-sm font-semibold text-text">Positions</h2>
                    <p className="mt-1 text-sm text-text-muted">
                        Manage the job positions available within each department. Assign them to
                        team members from the Team page.
                    </p>
                    <div className="mt-4">
                        <PositionsManager departments={departments} />
                    </div>
                </div>
            ) : (
                <>
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
            )}
        </>
    );
}

Settings.layout = (page) => (
    <AuthenticatedLayout title="Settings" subtitle="App preferences">
        {page}
    </AuthenticatedLayout>
);
