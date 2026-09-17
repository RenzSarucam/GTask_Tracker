import Button from '@/Components/ui/Button';
import Checkbox from '@/Components/ui/Checkbox';
import FloatingInput from '@/Components/ui/FloatingInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Welcome back</h1>
                <p className="mt-2 text-sm text-text-muted">
                    Don&apos;t have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        Sign up
                    </Link>
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
                        label="Email or Employee ID"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <FloatingInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={data.password}
                        autoComplete="current-password"
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-text-muted">
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        className="w-full py-3"
                    >
                        Log in
                    </Button>
                </form>
            </motion.div>
        </>
    );
}

Login.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
