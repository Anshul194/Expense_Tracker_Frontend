import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutGrid,
    List,
    Plus,
    Edit3,
    Trash2,
    AlertCircle,
    TrendingUp,
    Target,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearCategoryError
} from '../store/slices/categorySlice';
import { showNotification } from '../store/slices/uiSlice';
import { Card, Button, Badge, Modal, cn } from '../components/ui';
import CategoryModal from '../components/Categories/CategoryModal';

// --- Simple & Professional Progress Bar -------------------------------------
const BudgetProgress = ({ color, spent, budget }) => {
    const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
    const isOver = spent > budget && budget > 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 font-medium">Monthly Progress</span>
                <span className={`font-bold ${isOver ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                    {pct}%
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full rounded-full transition-all duration-500"
                    style={{ backgroundColor: isOver ? '#ef4444' : color }}
                />
            </div>
        </div>
    );
};

// --- Professional Category Card (Mercury/Stripe style) -----------------------
const CategoryCard = ({ category, onEdit, onDelete }) => {
    const spent = category.spent || 0;
    const budget = category.monthlyBudget || 0;

    return (
        <Card className="group p-5 flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none">
            <div className="flex justify-between items-start mb-6">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}10`, color: category.color, border: `1px solid ${category.color}20` }}
                >
                    {category.icon}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!category.isDefault && (
                        <>
                            <button onClick={() => onEdit(category)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"><Edit3 size={15} /></button>
                            <button onClick={() => onDelete(category)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-800 rounded-lg transition-all"><Trash2 size={15} /></button>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{category.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{category.isDefault ? 'Default Category' : 'Custom Category'}</p>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-50 dark:border-slate-800">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-3">
                    <span>Spent: ₹{spent.toLocaleString()}</span>
                    <span>Budget: {budget > 0 ? `₹${budget.toLocaleString()}` : 'No Limit'}</span>
                </div>
                <BudgetProgress color={category.color} spent={spent} budget={budget} />
            </div>
        </Card>
    );
};

// --- Clean Summary Stats (Brex style) -----------------------------------------
const SummaryStats = ({ items }) => {
    const totalBudget = items.reduce((s, c) => s + (c.monthlyBudget || 0), 0);
    const totalSpent = items.reduce((s, c) => s + (c.spent || 0), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
                { label: 'Total Monthly Budget', value: `₹${totalBudget.toLocaleString()}`, sub: 'From all categories', icon: Target, color: 'text-indigo-600' },
                { label: 'Total Spending', value: `₹${totalSpent.toLocaleString()}`, sub: 'Month to date', icon: TrendingUp, color: 'text-emerald-500' },
                { label: 'Budget Utilization', value: totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : '0%', sub: 'Target vs actual', icon: CheckCircle2, color: 'text-amber-500' },
            ].map(stat => (
                <Card key={stat.label} className="p-5 flex items-center gap-4 border-slate-200/60 dark:border-slate-800">
                    <div className={cn("p-3 rounded-xl bg-slate-50 dark:bg-slate-800", stat.color)}>
                        <stat.icon size={22} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{stat.value}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

// --- Main Categories Component ------------------------------------------------
const Categories = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.categories);

    const [view, setView] = useState('grid');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpenAdd = () => { setSelectedCategory(null); setModalOpen(true); };
    const handleOpenEdit = (cat) => { setSelectedCategory(cat); setModalOpen(true); };
    const handleOpenDelete = (cat) => { setSelectedCategory(cat); setDeleteModalOpen(true); };

    const handleSubmit = async (data) => {
        setFormLoading(true);
        const result = selectedCategory
            ? await dispatch(updateCategory({ id: selectedCategory._id, data }))
            : await dispatch(addCategory(data));
        setFormLoading(false);
        if (!result.error) {
            setModalOpen(false);
            dispatch(showNotification({
                title: 'Success',
                message: `Category ${selectedCategory ? 'updated' : 'created'} successfully.`,
                type: 'success'
            }));
        } else {
            dispatch(showNotification({
                title: 'Submission Failed',
                message: (typeof result.payload === 'string') ? result.payload : (result.payload?.message || 'Something went wrong'),
                type: 'error'
            }));
        }
    };

    const confirmDelete = async () => {
        if (!selectedCategory) return;
        setFormLoading(true);
        const result = await dispatch(deleteCategory(selectedCategory._id));
        setFormLoading(false);
        if (!result.error) {
            setDeleteModalOpen(false);
            dispatch(showNotification({
                title: 'Deleted',
                message: 'Category has been moved to archive.',
                type: 'success'
            }));
        } else {
            dispatch(showNotification({
                title: 'Delete Failed',
                message: (typeof result.payload === 'string') ? result.payload : (result.payload?.message || 'This category cannot be deleted yet.'),
                type: 'error'
            }));
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header section — simple & professional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Categories</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and organize your expense classifications</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('table')}
                            className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Button onClick={handleOpenAdd} className="font-bold py-2.5 px-5">
                        <Plus size={18} />
                        New Category
                    </Button>
                </div>
            </div>


            {/* Summary section */}
            {!loading && items.length > 0 && <SummaryStats items={items} />}

            {/* Content Area */}
            {loading && items.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />)}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {view === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {items.map(cat => (
                                <CategoryCard key={cat._id} category={cat} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
                            ))}
                            <button
                                onClick={handleOpenAdd}
                                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all min-h-[220px] group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-wide">Add Category</span>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <th className="text-left text-xs font-bold text-slate-500 uppercase py-4 pl-6 pr-4">Category</th>
                                            <th className="text-left text-xs font-bold text-slate-500 uppercase py-4 px-4">Type</th>
                                            <th className="text-right text-xs font-bold text-slate-500 uppercase py-4 px-4">Budget</th>
                                            <th className="text-right text-xs font-bold text-slate-500 uppercase py-4 px-4">Spent</th>
                                            <th className="text-right text-xs font-bold text-slate-500 uppercase py-4 px-4">Remaining</th>
                                            <th className="py-4 pl-4 pr-6" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {items.map(cat => {
                                            const budget = cat.monthlyBudget || 0;
                                            const spent = cat.spent || 0;
                                            const remaining = budget - spent;
                                            return (
                                                <tr key={cat._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-4 pl-6 pr-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{cat.icon}</span>
                                                            <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge variant={cat.isDefault ? 'neutral' : 'indigo'}>{cat.isDefault ? 'Default' : 'Custom'}</Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-right font-medium">{budget > 0 ? `₹${budget.toLocaleString()}` : '—'}</td>
                                                    <td className="py-4 px-4 text-right font-medium text-slate-600 dark:text-slate-400">₹{spent.toLocaleString()}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        {budget > 0 ? (
                                                            <span className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                                ₹{Math.abs(remaining).toLocaleString()} {remaining < 0 ? 'Over' : ''}
                                                            </span>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-6 text-right">
                                                        {!cat.isDefault && (
                                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleOpenEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={16} /></button>
                                                                <button onClick={() => handleOpenDelete(cat)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Standardized Modals */}
            <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} editData={selectedCategory} loading={formLoading} />

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Category">
                <div className="space-y-6">
                    <div className="p-5 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 shrink-0">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Permanently delete category?</p>
                            <p className="text-sm text-slate-500 mt-1">This will remove "<span className="font-bold">{selectedCategory?.name}</span>" from your classifications. This action cannot be undone.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setDeleteModalOpen(false)}>Keep Category</Button>
                        <Button variant="danger" className="flex-1 font-bold" loading={formLoading} onClick={confirmDelete}>Confirm Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Categories;