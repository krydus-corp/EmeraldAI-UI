import axios from 'axios';
import { CREATE_ANNOTATE_TAG, GET_TAGS_QUERY, GWT_TAGS_LIST } from '../constant/api';

export const addTagToAnnotate = (data: Object) => {
  return axios.post(CREATE_ANNOTATE_TAG, data);
};

export const getTagsQueryList = (data: Object) => {
  return axios.post(GET_TAGS_QUERY, data);
};

export const deleteAnnotateTagApi = (id: string) => {
  return axios.delete(`${CREATE_ANNOTATE_TAG}/${id}`);
};

export const getTagsDetail = (id: string) => {  
  return axios.get(`${CREATE_ANNOTATE_TAG}/${id}`).then(res => {
    return res;
  }).catch(err => {
    return {data: 'null'};
  });
};

export const getTagsList = (projectId: string,dataset_id:string) => {  
  return axios.get(`${GWT_TAGS_LIST}?projectId=${projectId}&dataset_id=${dataset_id}&pageNo=0&limit=1000`).then(res => {
    return res;
  }).catch(err => {
    return {data: 'null'};
  });
};
