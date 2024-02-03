import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  resetPasswordApi,
} from '../../../../service/loginApi';
import { FORGOT_PASSWORD_CODE } from '../../../../utils/routeConstants';

interface Istate {
  data: any;
  otp: String;
  email: string;
}
interface IPayload {
  email: string;
  reset?: any;
  navigate?: any;
  toast?: any;
}

interface IResetPayload {
  data: any;
  toast: any;
  done: any;
}

export const fetchForgotPasswordRequest = createAsyncThunk(
  'forgot/fetchForgotPasswordRequest',
  async (payload: IPayload, { dispatch }) => {
    try {
      const resp = await forgotPasswordApi(payload.email);
      payload.reset();
      payload.navigate(FORGOT_PASSWORD_CODE);
      payload.toast(resp.data.message, 'success');
      return resp.data;
    } catch (error: any) {
      payload.reset();
      payload.toast('User not registered!', 'error');
      throw Error(error);
    }
  }
);

export const fetchResetPasswordRequest = createAsyncThunk(
  'forgot/fetchResetPasswordRequest',
  async (payload: IResetPayload, { dispatch }) => {
    try {
      const resp = await resetPasswordApi(payload.data);
      payload.toast('Password Changed Successfully', 'success');
      payload.done();
      return resp.data;
    } catch (error: any) {
      payload.toast(error.response.data.message, 'error');
      throw Error(error);
    }
  }
);

const initialState: Istate = {
  data: [],
  otp: '',
  email: '',
};

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    updateOtp: (state, action) => {
      return { ...state, otp: action.payload };
    },
    updateEmail: (state, action) => {
      return { ...state, email: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchForgotPasswordRequest.fulfilled, (state, action) => {
      state = action.payload;
    });
  },
});

export const { updateOtp, updateEmail } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
