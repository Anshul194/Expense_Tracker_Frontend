import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getConfig } from '../../api/config';

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const res = await api.patch('/users/profile', data, getConfig());
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        return res.data.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
});

export const updatePassword = createAsyncThunk('user/updatePassword', async (data, { rejectWithValue }) => {
    try {
        await api.patch('/users/password', data, getConfig());
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update password');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        updating: false,
        passwordUpdating: false,
        error: null,
        passwordError: null,
    },
    reducers: {
        clearUserError: (state) => { state.error = null; state.passwordError = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => { state.updating = true; state.error = null; })
            .addCase(updateProfile.fulfilled, (state) => { state.updating = false; })
            .addCase(updateProfile.rejected, (state, action) => { state.updating = false; state.error = action.payload; })
            .addCase(updatePassword.pending, (state) => { state.passwordUpdating = true; state.passwordError = null; })
            .addCase(updatePassword.fulfilled, (state) => { state.passwordUpdating = false; })
            .addCase(updatePassword.rejected, (state, action) => { state.passwordUpdating = false; state.passwordError = action.payload; });
    }
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
