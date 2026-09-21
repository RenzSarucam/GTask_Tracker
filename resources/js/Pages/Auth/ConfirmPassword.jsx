import Button from '@/Components/ui/Button';
import FloatingInput from '@/Components/ui/FloatingInput';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h1 className="text-2xl font-semibold text-text">Confirm password</h1>
                <p className="mt-2 text-sm text-text-muted">
                    This is a secure area. Please confirm your password before continuing.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <FloatingInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={data.password}
                        autoComplete="current-password"
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

                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                        className="w-full py-3"
                    >
                        Confirm
                    </Button>
                </form>
            </motion.div>
        </>
    );
}

ConfirmPassword.layout = (page) => <AuthSplitLayout>{page}</AuthSplitLayout>;
