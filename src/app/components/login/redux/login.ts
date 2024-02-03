import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NumberLimit } from '../../../../constant/number';
import { AUTH_TOKEN, REFRESH_TOKEN } from '../../../../constant/static';
import { loginApi, refreshAuthTokenApi } from '../../../../service/loginApi';
import { clearLocalItems, setToken } from '../../../../utils/localStorage';
import { LOGIN } from '../../../../utils/routeConstants';
import { showToast } from '../../common/redux/toast';

export const fetchLoginRequest = createAsyncThunk(
  'login/fetchLoginRequest',
  async (payload: object, { dispatch, rejectWithValue }) => {
    try {
      const resp = await loginApi(payload);
      if (resp.data.access_token) {
        setToken(AUTH_TOKEN, resp.data.access_token);
        setToken(REFRESH_TOKEN, resp.data.refresh_token);
        return resp.data;
      }
    } catch (error: any) {
      if (
        error.response.status === NumberLimit.FOUR_ZERO_FOUR || error.response.status === NumberLimit.FOUR_ZERO_ONE
      ) {
        dispatch(
          showToast({
            message: 'Username or Password incorrect.',
            type: 'error',
          })
        );
      }
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAuthToken = createAsyncThunk(
  'login/updateAuthToken',
  async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      const resp = await refreshAuthTokenApi(refreshToken);
      if (resp.data.access_token) {
        setToken(AUTH_TOKEN, resp.data.access_token);
        setToken(REFRESH_TOKEN, resp.data.refresh_token);
        return resp.data;
      }
    } catch (error: any) {
      throw Error(error);
    }
  }
);

export const loginSlice = createSlice({
  name: 'user-login',
  initialState: { status: false, error: '' },
  reducers: {
    signOut: (state) => {
      clearLocalItems();
      window.location.href = LOGIN;
      return { status: false, error: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginRequest.fulfilled, (state, action) => {
        if (action.payload.access_token) {
          return { status: true, error: '' };
        }
      })
      .addCase(fetchLoginRequest.rejected, (state, action: any) => {
        return { status: false, error: action.payload };
      });
  },
});

export const { signOut } = loginSlice.actions;

export default loginSlice.reducer;
