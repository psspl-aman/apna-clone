import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  loading: boolean;
  toast: { message: string; type: 'success' | 'error' } | null;
  loginModalOpen: boolean;
}

const initialState: UiState = {
  loading: false,
  toast: null,
  loginModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
    },
  },
});

export const { setGlobalLoading, showToast, clearToast, setLoginModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
