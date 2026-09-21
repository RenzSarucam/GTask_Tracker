import Button from '@/Components/ui/Button';
import FloatingInput from '@/Components/ui/FloatingInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Forgot your password?</h1>
                <p className="mt-2 text-sm text-text-muted">
                    No problem. Let us know your email address and we&apos;ll email you a
                    password reset link.
                </p>

                {status && (
                    <div className="mt-4 rounded-input border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <FloatingInput
                        id="email"
                        type="email"
                        label="Email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        className="w-full py-3"
                    >
                        Email password reset link
                    </Button>
                </form>
            </motion.div>
        </>
    );
}

ForgotPassword.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
