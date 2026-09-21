import Button from '@/Components/ui/Button';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Verify your email</h1>
                <p className="mt-2 text-sm text-text-muted">
                    Thanks for signing up! Before getting started, could you verify your
                    email address by clicking the link we just emailed to you? If you
                    didn&apos;t receive it, we&apos;ll gladly send another.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mt-4 rounded-input border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                        A new verification link has been sent to the email address you
                        provided during registration.
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 flex items-center justify-between gap-4">
                    <Button type="submit" variant="primary" processing={processing}>
                        Resend verification email
                    </Button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-text-muted transition-colors hover:text-text"
                    >
                        Log out
                    </Link>
                </form>
            </motion.div>
        </>
    );
}

VerifyEmail.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
