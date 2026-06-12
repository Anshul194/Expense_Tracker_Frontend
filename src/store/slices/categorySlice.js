import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getConfig } from '../../api/config';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/categories', getConfig());
        return res.data.data.categories;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
});

export const addCategory = createAsyncThunk('categories/add', async (categoryData, { rejectWithValue }) => {
    try {
        const res = await api.post('/categories', categoryData, getConfig());
        return res.data.data.category;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add category');
    }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/categories/${id}`, data, getConfig());
        return res.data.data.category;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update category');
    }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/categories/${id}`, getConfig());
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearCategoryError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter(c => c._id !== action.payload);
            });
    }
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
