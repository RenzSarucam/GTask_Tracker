import PasswordStrengthMeter from '@/Components/Auth/PasswordStrengthMeter';
import Button from '@/Components/ui/Button';
import Checkbox from '@/Components/ui/Checkbox';
import FloatingInput from '@/Components/ui/FloatingInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Create an account</h1>
                <p className="mt-2 text-sm text-text-muted">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        Log in
                    </Link>
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FloatingInput
                            id="first_name"
                            label="First name"
                            value={data.first_name}
                            autoComplete="given-name"
                            autoFocus
                            error={errors.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />

                        <FloatingInput
                            id="last_name"
                            label="Last name"
                            value={data.last_name}
                            autoComplete="family-name"
                            error={errors.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                    </div>

                    <FloatingInput
                        id="email"
                        type="email"
                        label="Email"
                        value={data.email}
                        autoComplete="username"
                        error={errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <div>
                        <FloatingInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            value={data.password}
                            autoComplete="new-password"
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
                        <PasswordStrengthMeter password={data.password} />
                    </div>

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

                    <label className="flex items-start gap-2.5 text-sm text-text-muted">
                        <Checkbox
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-0.5"
                            required
                        />
                        <span>
                            I agree to the{' '}
                            <a href="#" className="font-medium text-primary hover:text-primary-hover">
                                Terms &amp; Conditions
                            </a>
                        </span>
                    </label>

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        disabled={!agreed}
                        className="w-full py-3"
                    >
                        Create account
                    </Button>
                </form>
            </motion.div>
        </>
    );
}

Register.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
