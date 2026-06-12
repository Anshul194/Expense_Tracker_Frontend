import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        notification: {
            isOpen: false,
            title: '',
            message: '',
            type: 'error', // 'success' | 'error' | 'warning' | 'info'
        }
    },
    reducers: {
        showNotification: (state, action) => {
            state.notification = {
                isOpen: true,
                title: action.payload.title || (action.payload.type === 'success' ? 'Success' : 'Notice'),
                message: action.payload.message,
                type: action.payload.type || 'info'
            };
        },
        hideNotification: (state) => {
            state.notification.isOpen = false;
        }
    }
});

export const { showNotification, hideNotification } = uiSlice.actions;
export default uiSlice.reducer;
