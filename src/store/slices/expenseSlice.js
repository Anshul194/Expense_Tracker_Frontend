import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getConfig } from '../../api/config';

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const res = await api.get('/expenses', {
            params,
            ...getConfig()
        });
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch expenses');
    }
});

export const addExpense = createAsyncThunk('expenses/add', async (expenseData, { rejectWithValue }) => {
    try {
        const res = await api.post('/expenses', expenseData, getConfig());
        return res.data.data.expense;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add expense');
    }
});

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/expenses/${id}`, data, getConfig());
        return res.data.data.expense;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update expense');
    }
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/expenses/${id}`, getConfig());
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete expense');
    }
});

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: {
        items: [],
        pagination: {},
        loading: false,
        error: null,
    },
    reducers: {
        clearExpenseError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.items = action.payload.expenses;
                state.pagination = action.payload.pagination;
                state.loading = false;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex(e => e._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter(e => e._id !== action.payload);
            });
    }
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
