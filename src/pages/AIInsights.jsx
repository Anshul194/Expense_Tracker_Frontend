import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrainCircuit, Sparkles, RefreshCcw, ShieldAlert, HeartPulse, Info } from 'lucide-react';
import { fetchLatestInsight, generateInsight } from '../store/slices/aiSlice';
import { Card, Button, Badge, cn } from '../components/ui';

const AIInsights = () => {
    const dispatch = useDispatch();
    const { insight, loading, error } = useSelector(state => state.ai);

    useEffect(() => {
        dispatch(fetchLatestInsight());
    }, [dispatch]);

    const handleGenerate = () => {
        dispatch(generateInsight());
    };

    const ScoreRing = ({ score }) => (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/20"
                />
                <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={314}
                    strokeDashoffset={314 - (314 * score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 text-white"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{score}</span>
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Score</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Minimal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Auditor</h1>
                    <p className="text-slate-500 font-medium mt-1">Intelligent spending analysis and risk assessment.</p>
                </div>
                <Button
                    onClick={handleGenerate}
                    loading={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl font-bold"
                >
                    <RefreshCcw size={18} className={cn("mr-2", loading && "animate-spin")} />
                    {insight ? 'Regenerate Analysis' : 'Run Audit'}
                </Button>
            </div>

            {/* Empty State */}
            {!insight && !loading && (
                <Card className="p-16 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <BrainCircuit size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">No active insights</h2>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm">Initiate an audit to let our AI analyze your transaction data and provide optimization strategies.</p>
                    </div>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-6">
                    <div className="h-48 bg-slate-50 dark:bg-slate-900 rounded-3xl animate-pulse" />
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-3xl animate-pulse" />
                        <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-3xl animate-pulse" />
                    </div>
                </div>
            )}

            {/* Insight Result */}
            {insight && !loading && (
                <div className="space-y-8">

                    {/* Master Insight Card */}
                    <Card className="p-10 border-none bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="space-y-8 flex-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-200" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Audit Complete</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight leading-none">Your portfolio efficiency is {insight.budgetScore > 70 ? 'high' : 'at risk'}.</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <p className="text-indigo-100 text-[9px] font-black uppercase tracking-widest mb-1">Monthly Forecast</p>
                                        <p className="text-2xl font-black">₹{insight.predictedMonthlySpending?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <p className="text-indigo-100 text-[9px] font-black uppercase tracking-widest mb-1">Critical Sector</p>
                                        <p className="text-2xl font-black truncate">{insight.highestRiskCategory}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <ScoreRing score={insight.budgetScore} />
                            </div>
                        </div>
                    </Card>

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold mb-4">
                                <ShieldAlert size={18} className="text-red-500" />
                                <span>Risk Assessment</span>
                            </div>
                            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {insight.riskExplanation}
                                </p>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold mb-4">
                                <HeartPulse size={18} className="text-emerald-500" />
                                <span>Optimization</span>
                            </div>
                            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {insight.savingsRecommendation}
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            This audit is generated using your historical spending data via OpenAI models. It should be used as a guideline for financial planning and optimization, not as absolute financial advice.
                        </p>
                    </div>
                </div>
            )}

            {error && !loading && (
                <Card className="p-6 border-red-100 bg-red-50 dark:bg-red-500/5 text-red-600 font-bold text-center">
                    {error}
                </Card>
            )}
        </div>
    );
};

export default AIInsights;

