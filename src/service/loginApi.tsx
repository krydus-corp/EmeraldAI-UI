import axios from 'axios';
import {
  LOGIN_URL,
  UPDATE_PROFILE_URL,
  FORGOT_PASSWORD_URL,
  CHANGE_PASSWORD_URL,
  UPDATE_EMAIL_URL,
  REFRESH_TOKEN_URL
} from '../constant/api';

export const loginApi = (payload: any) => {
  return axios.post(LOGIN_URL, payload);
};
export const forgotPasswordApi = (email: string) => {
  return axios.get(FORGOT_PASSWORD_URL + `?email=${email}`);
};
export const resetPasswordApi = (data: any) => {
  return axios.post(FORGOT_PASSWORD_URL, data);
};
export const updateProfileApi = (data: any, id: any) => {
  return axios.patch(UPDATE_PROFILE_URL + `/${id}`, data);
};
export const changePasswordApi = (data: any, id: any) => {
  return axios.patch(CHANGE_PASSWORD_URL + `/${id}`, data);
};
export const updateEmailApi = (id: any, email: string) => {
  return axios.get(
    UPDATE_EMAIL_URL + `/${id}/email-verification?email=${email}`
  );
};
export const verifyUpdateEmailCodeApi = (id: any, email: string,code:string) => {
  return axios.get(
    UPDATE_EMAIL_URL + `/${id}/email-verification-confirm?email=${email}&code=${code}`
  );
};
export const refreshAuthTokenApi = (refreshToken: any) => {
  return axios.get(REFRESH_TOKEN_URL +`/${refreshToken}`);
};
