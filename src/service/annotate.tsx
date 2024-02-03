import axios from 'axios';
import {
  DELETE_CONTENT_URL, CREATE_PROJECT_URL, FINISH_ANNOTATION, ANNOTATIONS_STATISTICS, ANNOTATION_QUERY, PREDICTIONS_QUERY,
} from '../constant/api';

// delete annotate image
export const deleteAnnotateImageApi = (payload: Object) => {
  return axios.delete(DELETE_CONTENT_URL, payload);
};

// change cover image
export const changeCoverPhotoApi = (payload: any, id: string) => {
  return axios.post(CREATE_PROJECT_URL + `/${id}/profile`, payload);
};

// finish annotation process
export const annotateImages = (payload: Object) => {
  return axios.post(FINISH_ANNOTATION, payload);
};

// delete label
export const deleteLabelsApi = (payload: Object) => {
  return axios.delete(FINISH_ANNOTATION, payload);
};

// annotate images list
export const annotateImagesList = (limit: number, page: number, projectId: string, datasetId: string) => {
  const query = `?limit=${limit}&page=${page}&project_id=${projectId}&dataset_id=${datasetId}`;
  return axios.get(FINISH_ANNOTATION + query);
};

/* 
  Get stats data for dataset chart views
*/
export const getAnnotateStats = (projectId: string, datasetId: string, options?: string) => {
  let query = `?project_id=${projectId}&dataset_id=${datasetId}`;
  if (options) {
    query = `?project_id=${projectId}&dataset_id=${datasetId}&stats=${options}`;
  }
  return axios.get(`${ANNOTATIONS_STATISTICS}${query}`);
};

/* 
  Get tags data for annotated images
*/
export const getAnnotateQuery = (payload: Object) => {
  return axios.post(ANNOTATION_QUERY, payload);
};

/* 
  Get uncertain images
*/
export const getPredictionQuery = (payload: Object) => {
  return axios.post(PREDICTIONS_QUERY, payload);
};
