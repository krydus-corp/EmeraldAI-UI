import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAnnotateStats } from '../../../../service/annotate';

import { showToast } from '../../common/redux/toast';

export const getAnnotateStatistics = createAsyncThunk(
  'statistics/getAnnotateStatistics',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getAnnotateStats(
        payload.project_id,
        payload.dataset_id,
        payload.options
      );
      return resp?.data?.statistics;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
    }
  }
);

export const statisticsSlice = createSlice({
  name: 'upload',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAnnotateStatistics.fulfilled, (state: any, action) => {
      return action.payload;
    });
  },
});

export default statisticsSlice.reducer;
