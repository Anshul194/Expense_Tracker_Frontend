import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { hideNotification } from '../../store/slices/uiSlice';
import { Button } from '../ui';

const GlobalNotification = () => {
    const dispatch = useDispatch();
    const { isOpen, title, message, type } = useSelector(state => state.ui.notification);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-emerald-500" size={32} />;
            case 'error': return <AlertCircle className="text-red-500" size={32} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={32} />;
            default: return <Info className="text-indigo-500" size={32} />;
        }
    };

    const getTheme = () => {
        switch (type) {
            case 'success': return 'border-emerald-100 bg-emerald-50/50 dark:bg-emerald-500/5';
            case 'error': return 'border-red-100 bg-red-50/50 dark:bg-red-500/5';
            case 'warning': return 'border-amber-100 bg-amber-50/50 dark:bg-amber-500/5';
            default: return 'border-indigo-100 bg-indigo-50/50 dark:bg-indigo-500/5';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(hideNotification())}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-[110] pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden pointer-events-auto mx-2 sm:mx-0"
                        >
                            <div className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center border transition-all ${getTheme()}`}>
                                    {getIcon()}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white capitalize">{title}</h3>
                                    <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{message}</p>
                                </div>

                                <Button
                                    onClick={() => dispatch(hideNotification())}
                                    variant={type === 'error' ? 'danger' : 'primary'}
                                    className="w-full py-3 sm:py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] text-sm sm:text-base"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GlobalNotification;
