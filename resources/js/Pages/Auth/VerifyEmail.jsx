import Button from '@/Components/ui/Button';
import OtpInput from '@/Components/ui/OtpInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function maskEmail(email) {
    const [user, domain] = (email ?? '').split('@');
    if (!user || !domain) return email ?? '';
    const visible = user.slice(0, Math.min(2, user.length));
    return `${visible}${'*'.repeat(Math.max(user.length - visible.length, 3))}@${domain}`;
}

export default function VerifyEmail({ status, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });
    const [resendCooldown, setResendCooldown] = useState(0);

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.otp'), {
            onError: () => reset('code'),
        });
    };

    function resend(e) {
        e.preventDefault();
        reset('code');
        setResendCooldown(30);
        post(route('verification.send'), { preserveScroll: true, only: ['status'] });
    }

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    useEffect(() => {
        if (data.code.length === 6 && !processing) {
            post(route('verification.otp'), {
                onError: () => reset('code'),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.code]);

    return (
        <>
            <Head title="Verify Email" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Enter your code</h1>
                <p className="mt-2 text-sm text-text-muted">
                    We emailed a 6-digit code to <span className="text-text">{maskEmail(email)}</span>.
                </p>

                {status === 'otp-sent' && (
                    <div className="mt-4 rounded-input border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                        A new code has been sent to your email.
                    </div>
                )}

                <form onSubmit={submit} className="mt-8">
                    <OtpInput
                        value={data.code}
                        onChange={(code) => setData('code', code)}
                        error={errors.code}
                        disabled={processing}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        disabled={data.code.length !== 6}
                        className="mt-6 w-full py-3"
                    >
                        Verify email
                    </Button>
                </form>

                <div className="mt-6 flex items-center justify-between text-sm">
                    <button
                        type="button"
                        onClick={resend}
                        disabled={resendCooldown > 0}
                        className="font-medium text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:text-text-muted"
                    >
                        {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Didn't get a code? Resend"}
                    </button>

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

VerifyEmail.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
