import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../ui';

const ICONS = ['🍔', '🚗', '🛍️', '💊', '🎬', '💡', '📦', '🏠', '🎮', '✈️', '🎓', '💪'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F06292', '#81C784', '#64B5F6', '#FFD54F'];

const CategoryModal = ({ isOpen, onClose, onSubmit, editData, loading }) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                icon: editData.icon,
                color: editData.color,
                monthlyBudget: editData.monthlyBudget
            });
        } else {
            reset({
                name: '',
                icon: '🍔',
                color: '#FF6B6B',
                monthlyBudget: 0
            });
        }
    }, [editData, reset, isOpen]);

    const selectedIcon = watch('icon');
    const selectedColor = watch('color');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Category' : 'New Category'}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Category Name"
                    placeholder="e.g. Groceries"
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                />

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2 block">Monthly Budget (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="0"
                            {...register('monthlyBudget', { min: 0 })}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-3 block">Choose Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                        {ICONS.map(icon => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setValue('icon', icon)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${selectedIcon === icon
                                    ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-3 block">Theme Color</label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setValue('color', color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-indigo-600 scale-125' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="flex-1" loading={loading}>
                        {editData ? 'Save Changes' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
