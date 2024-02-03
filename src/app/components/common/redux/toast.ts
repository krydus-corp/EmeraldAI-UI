import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: '', type: '' };

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      return ({ ...state, ...action?.payload });
    },
    hideToast: (state) => {
      return ({ message: '', type: ''});
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
