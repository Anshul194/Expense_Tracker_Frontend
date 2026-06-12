import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getConfig } from '../../api/config';

export const fetchDashboardData = createAsyncThunk('dashboard/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const [summary, breakdown, trends, budget] = await Promise.all([
            api.get('/dashboard/summary', getConfig()),
            api.get('/dashboard/category-breakdown', getConfig()),
            api.get('/dashboard/trends', getConfig()),
            api.get('/dashboard/budget-status', getConfig())
        ]);

        return {
            summary: summary.data.data,
            breakdown: breakdown.data.data.breakdown,
            trends: trends.data.data.trends,
            budget: budget.data.data.budgetStatus
        };
    } catch (err) {
        return rejectWithValue('Failed to fetch dashboard data');
    }
});

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        summary: null,
        breakdown: [],
        trends: [],
        budget: [],
        loading: false
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => { state.loading = true; })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
                state.loading = false;
            })
            .addCase(fetchDashboardData.rejected, (state) => { state.loading = false; });
    }
});

export default dashboardSlice.reducer;
