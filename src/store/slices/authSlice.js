import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/config';

const saveSession = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login', credentials);
        saveSession(res.data.data.accessToken, res.data.data.user);
        return res.data.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/register', userData);
        saveSession(res.data.data.accessToken, res.data.data.user);
        return res.data.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return rejectWithValue('Not authenticated');

    try {
        const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        saveSession(token, res.data.data);
        return res.data.data;
    } catch {
        const cached = localStorage.getItem('user');
        if (cached) return JSON.parse(cached);
        clearSession();
        return rejectWithValue('Not authenticated');
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        clearSession();
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => { state.loading = true; })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
