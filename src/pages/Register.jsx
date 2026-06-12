import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { register as registerAction } from '../store/slices/authSlice';
import { Button, Input, Card } from '../components/ui';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { error, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const result = await dispatch(registerAction(data));
        if (!result.error) {
            navigate('/');
        }
    };

    const password = watch("password");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[40px] border-white/30 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
                        <span className="font-extrabold text-2xl">E</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white focus:outline-none">Expense Tracker</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-8">
                        Simplify your<br />financial world.
                    </h1>
                    <div className="space-y-4">
                        {[
                            "Automated receipt tracking",
                            "AI-powered spending insights",
                            "Multi-category budget management",
                            "Cross-platform synchronization"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 text-indigo-100/90 font-medium text-lg">
                                <CheckCircle2 size={24} className="text-indigo-300" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-indigo-200/60 text-sm">
                    Join 25k+ users managing money like billionaires.
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-24 sm:p-6 lg:p-12 relative">
                {/* Mobile Logo */}
                <div className="absolute top-4 left-4 sm:top-10 sm:left-10 lg:hidden flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <span className="font-bold">E</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Expense Tracker</span>
                </div>

                <Card className="w-full max-w-lg p-6 sm:p-8 lg:p-10 border-none lg:border shadow-none lg:shadow-premium bg-transparent lg:bg-white dark:lg:bg-slate-900">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Join Expense Tracker today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register("fullName", { required: "Name is required" })}
                            error={errors.fullName?.message}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                            })}
                            error={errors.email?.message}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none pr-12 transition-all"
                                        placeholder="••••••••"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Min 6 characters" }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm</label>
                                <div className="relative mt-1.5">
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        {...register("confirmPassword", {
                                            validate: value => value === password || "Passwords don't match"
                                        })}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" loading={loading} className="w-full py-3 sm:py-3.5 text-base sm:text-lg font-bold">
                            Get Started
                            <ArrowRight size={20} />
                        </Button>
                    </form>

                    <p className="mt-6 sm:mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign In Instead</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Register;
