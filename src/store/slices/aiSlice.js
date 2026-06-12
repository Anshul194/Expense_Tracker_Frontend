import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getConfig } from '../../api/config';

export const fetchLatestInsight = createAsyncThunk('ai/fetchLatest', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/ai/insights/latest', getConfig());
        return res.data.data.insight;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

export const generateInsight = createAsyncThunk('ai/generate', async (_, { rejectWithValue }) => {
    try {
        const res = await api.post('/ai/insights', {}, getConfig());
        return res.data.data.insight;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'AI Insight generation failed');
    }
});

const aiSlice = createSlice({
    name: 'ai',
    initialState: { insight: null, loading: false, error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestInsight.fulfilled, (state, action) => { state.insight = action.payload; })
            .addCase(generateInsight.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(generateInsight.fulfilled, (state, action) => {
                state.insight = action.payload;
                state.loading = false;
            })
            .addCase(generateInsight.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default aiSlice.reducer;
