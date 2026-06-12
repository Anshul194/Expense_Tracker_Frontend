import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../ui';

const METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'];

const ExpenseModal = ({ isOpen, onClose, onSubmit, editData, categories, loading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (editData) {
            // transform date for input type=date (YYYY-MM-DD)
            const date = new Date(editData.expenseDate).toISOString().split('T')[0];
            reset({
                title: editData.title,
                amount: editData.amount,
                categoryId: editData.categoryId?._id || editData.categoryId,
                description: editData.description || '',
                paymentMethod: editData.paymentMethod,
                expenseDate: date
            });
        } else {
            reset({
                title: '',
                amount: '',
                categoryId: '',
                description: '',
                paymentMethod: 'Cash',
                expenseDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [editData, reset, isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Expense' : 'Add New Expense'}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <Input
                    label="Expense Title"
                    placeholder="e.g. Starbucks Coffee"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2 block">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                placeholder="0.00"
                                {...register('amount', { required: 'Amount is required', min: 0.01 })}
                            />
                        </div>
                        {errors.amount && <p className="text-xs text-red-500 mt-1 ml-1">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2 block">Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            {...register('expenseDate', { required: 'Date is required' })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2 block">Category</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            {...register('categoryId', { required: 'Select a category' })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.categoryId.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2 block">Method</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                            {...register('paymentMethod')}
                        >
                            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Description (Optional)</label>
                    <textarea
                        rows="2"
                        placeholder="Add details about this expense..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        {...register('description')}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="flex-1 py-3 text-lg" loading={loading}>
                        {editData ? 'Save Changes' : 'Create Expense'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseModal;
