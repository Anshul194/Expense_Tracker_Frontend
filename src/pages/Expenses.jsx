import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search,
    Filter,
    Plus,
    Trash2,
    Edit2,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    CreditCard,
    Wallet,
    Smartphone,
    SmartphoneNfc,
    AlertCircle
} from 'lucide-react';
import {
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    clearExpenseError
} from '../store/slices/expenseSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { showNotification } from '../store/slices/uiSlice';
import { Card, Button, Badge, Modal } from '../components/ui';
import ExpenseModal from '../components/Expenses/ExpenseModal';

const Expenses = () => {
    const dispatch = useDispatch();
    const { items, pagination, loading, error } = useSelector(state => state.expenses);
    const { items: categories } = useSelector(state => state.categories);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        paymentMethod: '',
        sortBy: 'expenseDate',
        order: 'desc',
        page: 1,
        limit: 10
    });
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchExpenses(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpenAdd = () => {
        setSelectedExpense(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (expense) => {
        setSelectedExpense(expense);
        setModalOpen(true);
    };

    const handleOpenDelete = (expense) => {
        setSelectedExpense(expense);
        setDeleteModalOpen(true);
    };

    const handleSubmit = async (data) => {
        setFormLoading(true);
        const result = selectedExpense
            ? await dispatch(updateExpense({ id: selectedExpense._id, data }))
            : await dispatch(addExpense(data));
        setFormLoading(false);
        if (!result.error) {
            setModalOpen(false);
            dispatch(showNotification({
                title: 'Success',
                message: `Transaction ${selectedExpense ? 'updated' : 'recorded'} successfully.`,
                type: 'success'
            }));
        } else {
            dispatch(showNotification({
                title: 'Request Failed',
                message: (typeof result.payload === 'string') ? result.payload : (result.payload?.message || 'We could not save this transaction.'),
                type: 'error'
            }));
        }
    };

    const confirmDelete = async () => {
        if (!selectedExpense) return;
        setFormLoading(true);
        const result = await dispatch(deleteExpense(selectedExpense._id));
        setFormLoading(false);
        if (!result.error) {
            setDeleteModalOpen(false);
            dispatch(showNotification({
                title: 'Deleted',
                message: 'Transaction has been removed from your history.',
                type: 'success'
            }));
        } else {
            dispatch(showNotification({
                title: 'Error',
                message: (typeof result.payload === 'string') ? result.payload : (result.payload?.message || 'Failed to delete transaction.'),
                type: 'error'
            }));
        }
    };

    const getMethodIcon = (method) => {
        const m = method?.toLowerCase();
        if (m?.includes('card')) return <CreditCard size={14} />;
        if (m?.includes('upi')) return <Smartphone size={14} />;
        if (m?.includes('bank')) return <SmartphoneNfc size={14} />;
        return <Wallet size={14} />;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Manage and track your individual transactions</p>
                </div>
                <Button onClick={handleOpenAdd} className="font-bold py-2.5 sm:py-3 px-4 sm:px-6 shadow-premium text-sm sm:text-base">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Expense</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>


            {/* Filter Toolbar */}
            <Card className="p-3 sm:p-4 bg-white/50 backdrop-blur-sm border-dashed">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                            value={filters.search}
                            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-600 dark:text-slate-300 text-sm"
                            value={filters.categoryId}
                            onChange={(e) => setFilters(f => ({ ...f, categoryId: e.target.value, page: 1 }))}
                        >
                            <option value="">All Categories</option>
                            {categories?.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <Button variant="secondary" className="px-3 shrink-0" onClick={() => setFilterOpen(o => !o)}>
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                {filterOpen && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">From Date</label>
                            <input type="date" value={filters.startDate}
                                onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value, page: 1 }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">To Date</label>
                            <input type="date" value={filters.endDate}
                                onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value, page: 1 }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Min Amount</label>
                            <input type="number" placeholder="₹0" value={filters.minAmount}
                                onChange={(e) => setFilters(f => ({ ...f, minAmount: e.target.value, page: 1 }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Max Amount</label>
                            <input type="number" placeholder="₹999999" value={filters.maxAmount}
                                onChange={(e) => setFilters(f => ({ ...f, maxAmount: e.target.value, page: 1 }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Payment Method</label>
                            <select value={filters.paymentMethod}
                                onChange={(e) => setFilters(f => ({ ...f, paymentMethod: e.target.value, page: 1 }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium">
                                <option value="">All Methods</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Sort By</label>
                            <select value={filters.sortBy}
                                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium">
                                <option value="expenseDate">Date</option>
                                <option value="amount">Amount</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Order</label>
                            <select value={filters.order}
                                onChange={(e) => setFilters(f => ({ ...f, order: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium">
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button variant="secondary" className="w-full" onClick={() => {
                                setFilters({ search: '', categoryId: '', startDate: '', endDate: '', minAmount: '', maxAmount: '', paymentMethod: '', sortBy: 'expenseDate', order: 'desc', page: 1, limit: 10 });
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Table Section */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-premium">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center hidden sm:table-cell">Method</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading && items.length === 0 ? (
                                <tr><td colSpan="6" className="px-4 sm:px-6 py-10 sm:py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="6" className="px-4 sm:px-6 py-10 sm:py-20 text-center text-slate-500 font-medium text-sm">No expenses found for this criteria.</td></tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white leading-tight text-sm">{item.title}</p>
                                                <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[120px] sm:max-w-[180px]">{item.description || 'No notes'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">{item.categoryId?.icon || '📦'}</span>
                                                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hidden xs:inline">{item.categoryId?.name || 'Other'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                    {getMethodIcon(item.paymentMethod)}
                                                    {item.paymentMethod}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                            <span className="text-xs sm:text-sm text-slate-500 font-medium">{new Date(item.expenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleOpenEdit(item)} className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={15} /></button>
                                                <button onClick={() => handleOpenDelete(item)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
                        {pagination.total || 0} Records
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30"
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
                            <ChevronLeft size={16} />
                        </button>
                        {(() => {
                            const total = pagination.totalPages || 1;
                            const current = pagination.page || 1;
                            const pages = [];
                            const start = Math.max(1, current - 2);
                            const end = Math.min(total, current + 2);
                            if (start > 1) pages.push(1);
                            if (start > 2) pages.push('...');
                            for (let i = start; i <= end; i++) pages.push(i);
                            if (end < total - 1) pages.push('...');
                            if (end < total) pages.push(total);
                            return pages.map((p, i) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${i}`} className="px-1.5 sm:px-2 text-slate-400 font-bold text-xs sm:text-sm">...</span>
                                ) : (
                                    <button key={p}
                                        className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all ${p === current
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        onClick={() => setFilters(f => ({ ...f, page: p }))}>
                                        {p}
                                    </button>
                                )
                            );
                        })()}
                        <button className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30"
                            disabled={!pagination.hasNextPage}
                            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* CRUD Modals */}
            <ExpenseModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                editData={selectedExpense}
                categories={categories}
                loading={formLoading}
            />

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Transaction">
                <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 mx-auto mb-3 sm:mb-4">
                            <Trash2 size={28} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Delete this transaction?</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">This will permanently remove the record for "<span className="font-bold text-slate-700 dark:text-slate-300">{selectedExpense?.title}</span>".</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1 text-sm" onClick={() => setDeleteModalOpen(false)}>No, Keep it</Button>
                        <Button variant="danger" className="flex-1 text-sm" loading={formLoading} onClick={confirmDelete}>Yes, Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Expenses;
