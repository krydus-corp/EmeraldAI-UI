import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userDetailsApi } from '../../../../service/userApi';
import { setLocal } from '../../../../utils/localStorage';

export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async () => {
    try {
      const resp = await userDetailsApi();
      setLocal('User', resp.data);
      return resp.data;
    } catch (error: any) {
      throw Error(error);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      return  action.payload;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      return {};
    });
  },
});

export default userSlice.reducer;
