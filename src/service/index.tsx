import axios, { AxiosRequestConfig } from 'axios';
import { signOut } from '../app/components/login/redux/login';
import { config } from '../config';
import { NumberLimit } from '../constant/number';
import { AUTH_TOKEN } from '../constant/static';
import { store } from '../store';
import { LOGIN_URL } from '../constant/api';

export const request = (method: any, url: any, data: any, params: any, headers = {}) => {
  return new Promise((resolve, reject) =>
    axios({
      method,
      url,
      data,
      params,
      headers
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  );
};

const handleError = (err:any) => {  
  if (err.response?.status === NumberLimit.FOUR_ZERO_ONE && err.config?.url!==LOGIN_URL){
    return store.dispatch(signOut());
  }
  return err;
};

export const configureAxios = () => {
  axios.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => Promise.reject(handleError(error))
  );

  axios.interceptors.request.use(
    (reqConfig: AxiosRequestConfig) => {
      if (reqConfig.headers === undefined) {
        reqConfig.headers = {};
      }

      reqConfig.headers['Content-Type'] = 'application/json';

      reqConfig.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN) || '{}'}`;

      reqConfig.baseURL = config.API_END_POINT;

      return reqConfig;
    },
    (error) => Promise.reject(error)
  );
};
