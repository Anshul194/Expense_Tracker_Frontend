import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { login, clearError } from '../store/slices/authSlice';
import { Button, Input, Card } from '../components/ui';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { error, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const result = await dispatch(login(data));
        if (!result.error) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
            {/* Left Side: Branding (Visible on large screens) */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
                        <span className="font-extrabold text-2xl">N</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">NexPrism</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                        Smart expenses,<br />better future.
                    </h1>
                    <p className="text-indigo-100/80 text-xl max-w-md leading-relaxed">
                        Take control of your finances with AI-powered insights and professional tracking.
                    </p>
                </div>

                <div className="relative z-10 text-indigo-200/60 text-sm">
                    © 2026 NexPrism Financial. Premium Expense Management.
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
                {/* Mobile Logo */}
                <div className="absolute top-10 left-10 lg:hidden flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <span className="font-bold">N</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">NexPrism</span>
                </div>

                <Card className="w-full max-w-md p-8 lg:p-10 border-none lg:border shadow-none lg:shadow-premium bg-transparent lg:bg-white dark:lg:bg-slate-900">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@company.com"
                                    {...register("email", { required: "Email is required" })}
                                    error={errors.email?.message}
                                />
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                                    <button type="button" className="text-xs text-indigo-600 font-semibold hover:underline">Forgot?</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
                                        placeholder="••••••••"
                                        {...register("password", { required: "Password is required" })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                            <label>Remember me for 30 days</label>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" loading={loading} className="w-full py-3.5 text-lg font-bold">
                            Sign In
                            <ArrowRight size={20} />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Join NexPrism</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Login;
