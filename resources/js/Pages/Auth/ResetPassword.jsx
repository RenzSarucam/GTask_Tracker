import Button from '@/Components/ui/Button';
import FloatingInput from '@/Components/ui/FloatingInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Reset your password</h1>
                <p className="mt-2 text-sm text-text-muted">Choose a new password below.</p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <FloatingInput
                        id="email"
                        type="email"
                        label="Email"
                        value={data.email}
                        autoComplete="username"
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <FloatingInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={data.password}
                        autoComplete="new-password"
                        autoFocus
                        error={errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                        rightSlot={
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-text-muted transition-colors hover:text-text"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />

                    <FloatingInput
                        id="password_confirmation"
                        type={showConfirm ? 'text' : 'password'}
                        label="Confirm password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        error={errors.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        rightSlot={
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowConfirm((v) => !v)}
                                className="text-text-muted transition-colors hover:text-text"
                                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                            >
                                {showConfirm ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        className="w-full py-3"
                    >
                        Reset password
                    </Button>
                </form>
            </motion.div>
        </>
    );
}

ResetPassword.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
