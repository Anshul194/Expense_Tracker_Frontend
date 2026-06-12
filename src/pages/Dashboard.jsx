import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    IndianRupee,
    Calendar,
    Plus,
    TrendingUp,
    List,
    Clock,
    Zap,
    ArrowUpRight,
    ArrowRight,
    Target
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
    Bar
} from 'recharts';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import { Card, Button, Badge, cn } from '../components/ui';

// --- Professional Custom Tooltip --------------------------------------------
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 capitalize mb-1">
                    {new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { summary, breakdown, trends, loading } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    if (loading && !summary) {
        return <div className="flex items-center justify-center h-[70vh]"><div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" /></div>;
    }

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];

    return (
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 pb-24">

            {/* Unique Identity Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 pt-4 sm:pt-6">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Live Financial Pulse</span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-950 dark:text-white leading-[1]">Overview.</h1>
                        <p className="text-xs sm:text-base text-slate-500 font-medium ml-1">Account synchronized for current billing cycle</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => navigate('/expenses')} className="h-10 sm:h-14 px-4 sm:px-8 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[9px] sm:text-[10px] shadow-2xl transition-transform active:scale-95">
                        <Plus size={14} className="sm:mr-2" /> <span className="hidden sm:inline">Record Transaction</span><span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </div>

            {/* Unique Asymmetric Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

                {/* Principal Spend Module (8 columns) */}
                <Card className="lg:col-span-8 p-0 border-none bg-indigo-600 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />

                    <div className="p-6 sm:p-10 relative z-10 flex flex-col md:flex-row justify-between gap-6 sm:gap-10">
                        <div className="space-y-6 sm:space-y-10">
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Periodic Consumption</p>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">₹{summary?.currentMonthTotalSpending?.toLocaleString()}</h2>
                                <p className="text-indigo-100/60 text-xs font-medium mt-3">Monthly cycle expenditure</p>
                            </div>

                            <div className="flex gap-4 sm:gap-10 flex-wrap">
                                <div>
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Burn Velocity</p>
                                    <p className="text-white text-lg sm:text-xl font-bold">₹{summary?.averageDailySpending?.toLocaleString()}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                                <div>
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Transaction Index</p>
                                    <p className="text-white text-lg sm:text-xl font-bold">{summary?.currentMonthExpenseCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-48 self-end w-full md:w-auto">
                            <ResponsiveContainer width="100%" height={80}>
                                <AreaChart data={trends}>
                                    <Area type="monotone" dataKey="totalAmount" stroke="#fff" strokeWidth={2} fill="#fff" fillOpacity={0.1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-950/20 backdrop-blur-md p-4 sm:p-6 flex justify-between items-center px-6 sm:px-10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">ledger system active</span>
                        </div>
                        <div className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:translate-x-1 transition-transform" onClick={() => navigate('/expenses')}>
                            Full History <ArrowRight size={14} />
                        </div>
                    </div>
                </Card>

                {/* Intelligence Trigger (4 columns) */}
                <Card className="lg:col-span-4 p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200/60 flex flex-col justify-between h-full group cursor-pointer" onClick={() => navigate('/ai')}>
                    <div className="space-y-4 sm:space-y-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                            <Zap size={22} className="fill-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Semantic <br className="hidden sm:block" />Audit.</h3>
                            <p className="text-slate-500 text-xs font-medium mt-3 sm:mt-4 leading-relaxed">Launch AI audit to discover latent spending vectors across your billing cycles.</p>
                        </div>
                    </div>
                    <div className="pt-6 sm:pt-10 flex justify-between items-center text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                        Initialize Analysis <ArrowUpRight size={14} />
                    </div>
                </Card>
            </div>

            {/* Analysis Center */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Spending Vector Chart */}
                <Card className="lg:col-span-2 p-6 sm:p-10 border-slate-200/60">
                    <div className="flex items-start justify-between mb-6 sm:mb-12 gap-4">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Spending Velocity</h3>
                            <p className="text-xs text-slate-500 font-medium">Daily transaction dynamics (Last 7 Sessions)</p>
                        </div>
                        <Badge variant="indigo" className="rounded-lg px-2 sm:px-3 py-1 font-black text-[9px] uppercase tracking-widest opacity-60 shrink-0">Linear-Trend</Badge>
                    </div>

                    <div className="h-[220px] sm:h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trends} margin={{ left: -20 }}>
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    dy={15}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="totalAmount" stroke="#6366f1" strokeWidth={4} fill="url(#areaGrad)" animationDuration={1500} />
                                <Bar dataKey="totalAmount" fill="#6366f1" opacity={0.05} barSize={20} radius={[4, 4, 0, 0]} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Categorical Distribution */}
                <Card className="p-6 sm:p-10 border-slate-200/60 flex flex-col justify-between">
                    <div className="mb-6 sm:mb-10">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Breakdown.</h3>
                        <p className="text-xs text-slate-500 font-medium">Portfolio weight classification</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6 flex-1">
                        {breakdown.slice(0, 5).map((item, index) => (
                            <div key={item.name} className="flex flex-col gap-2 group">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-950 dark:text-white shrink-0 ml-2">₹{item.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.percentage}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => navigate('/categories')} className="mt-6 sm:mt-10 py-3 sm:py-4 w-full rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        Global Distribution <ArrowRight size={14} />
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
