import axios from 'axios';
import { USER_DETAIL_URL } from '../constant/api';

export const userDetailsApi = () => {
  return axios.get(USER_DETAIL_URL);
};
