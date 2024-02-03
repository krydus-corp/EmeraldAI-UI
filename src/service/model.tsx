import axios from "axios";
import {
  PREDICTIONS_STATISTICS,
  PROJECT_MODELS,
  PREDICTIONS_SAMPLE,
} from "../constant/api";

export const getModelData = (projectId: string) => {
  return axios.get(`${PROJECT_MODELS}?project_id=${projectId}`);
};

export const getModelDetail = (modelId: string) => {
  return axios.get(`${PROJECT_MODELS}/${modelId}`);
};

export const createNewModel = (data: Object) => {
  return axios.post(PROJECT_MODELS, data);
};

export const updateModelData = (data: Object, id: string) => {
  return axios.patch(`${PROJECT_MODELS}/${id}`, data);
};

export const deleteModelData = (id: string) => {
  return axios.delete(`${PROJECT_MODELS}/${id}`);
};

export const startModelTraining = (id: string) => {
  return axios.post(`${PROJECT_MODELS}/${id}/train`);
};

export const deployTheModel = (id: string) => {
  return axios.post(`${PROJECT_MODELS}/${id}/deploy`);
};

export const deleteTheModelDeploy = (id: string) => {
  return axios.delete(`${PROJECT_MODELS}/${id}/deploy`);
};

export const applyToProject = (id: string) => {
  return axios.post(`${PROJECT_MODELS}/${id}/inference/batch`);
};

export const getApplyToProject = (id: string) => {
  return axios.get(`${PROJECT_MODELS}/${id}/inference/batch`);
};

export const getPredictionsStatistics = (payload: any) => {
  let query = `?model_id=${payload.model_id}&uncertainty_threshold=${payload.uncertainty_threshold}`;
  if (payload.tag_id) {
    query = `${query}${payload.tag_id}`;
  }
  return axios.get(`${PREDICTIONS_STATISTICS}${query}`);
};

export const getPredictionsImages = (payload: any) => {
  let query = `?model_id=${
    payload.model_id
  }&thumbnail_size=640&uncertainty_threshold=${
    payload.uncertainty_threshold
  }&sample_count=${payload.count || 100}`;
  if (payload.tag_id) {
    query = `${query}${payload.tag_id}`;
  }
  return axios.get(`${PREDICTIONS_SAMPLE}${query}`);
};
