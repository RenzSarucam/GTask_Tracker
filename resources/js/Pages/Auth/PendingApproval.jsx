import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, XCircle } from 'lucide-react';

export default function PendingApproval({ accountStatus, departmentName, positionName }) {
    const rejected = accountStatus === 'rejected';

    return (
        <>
            <Head title={rejected ? 'Account not approved' : 'Awaiting approval'} />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-center"
            >
                <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                        rejected ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                    }`}
                >
                    {rejected ? <XCircle className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
                </div>

                <h1 className="mt-5 text-2xl font-semibold text-text">
                    {rejected ? 'Account not approved' : 'Awaiting admin approval'}
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
                    {rejected
                        ? 'Your registration was not approved. Contact your ICT/R&D admin if you think this is a mistake.'
                        : "Your account has been created and is waiting for an admin to confirm your department and position. You'll be able to sign in as soon as it's approved."}
                </p>

                {!rejected && (departmentName || positionName) && (
                    <div className="mx-auto mt-5 inline-flex flex-col gap-1 rounded-input border border-border bg-surface-2 px-4 py-3 text-left text-sm">
                        {departmentName && (
                            <p className="text-text-muted">
                                Department: <span className="text-text">{departmentName}</span>
                            </p>
                        )}
                        {positionName && (
                            <p className="text-text-muted">
                                Position: <span className="text-text">{positionName}</span>
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-8 flex items-center justify-center gap-5 text-sm">
                    {!rejected && (
                        <button
                            type="button"
                            onClick={() => router.reload()}
                            className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary-hover"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Check again
                        </button>
                    )}

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="font-medium text-text-muted transition-colors hover:text-text"
                    >
                        Log out
                    </Link>
                </div>
            </motion.div>
        </>
    );
}

PendingApproval.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
