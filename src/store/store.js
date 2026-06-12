import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import categoryReducer from './slices/categorySlice';
import dashboardReducer from './slices/dashboardSlice';
import aiReducer from './slices/aiSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expenseReducer,
        categories: categoryReducer,
        dashboard: dashboardReducer,
        ai: aiReducer,
        ui: uiReducer,
    },
});
