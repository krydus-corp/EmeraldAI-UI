import axios from "axios";
import moment from "moment";
import {
  ADD_RANDOM_IMAGES,
  CREATE_PROJECT_URL,
  GET_CONTENT_URL,
  GET_CURRENT_DATASET_URL,
  GET_IMAGE,
  GET_DATASET_URL,
  PROJECT_UPLOADS,
  SEARCH_PROJECT_URL,
  UPDATE_PROFILEPIC_URL,
  DATASET_EXPORT_URL,
  DATASET_QUERY_EXPORT_URL,
  PROJECT_MODELS,
} from "../constant/api";
import { NumberLimit } from "../constant/number";
import { downloadJson } from "../utils/common";

// get project list
export const projectListApi = (
  limit: number,
  page: number,
  sort_key: string = "",
  sort_val: any = ""
) => {
  const query = `?limit=${limit}&page=${page}&sort_key=${sort_key}&sort_val=${sort_val}`;
  return axios.get(`${CREATE_PROJECT_URL}${query}`);
};

// search project
export const searchProjectApi = (
  limit: number,
  page: number,
  search: string = "",
  annotation: string = "",
  date: any = []
) => {
  const query: any = {
    limit,
    page,
    sort_key: "created_at",
    sort_val: -1,
    operator: "and",
    filters: [],
  };

  if (
    (!annotation || annotation.length === 0) &&
    (!date || date.length === 0 || date[0] === null)
  ) {
    query.operator = "or";
    query.filters.push(
      {
        key: "name",
        regex: {
          enable: true,
          options: "i",
        },
        value: `.*${search}.*`,
      },
      {
        key: "description",
        regex: {
          enable: true,
          options: "i",
        },
        value: `.*${search}.*`,
      }
    );
  }

  if (annotation && annotation.length > 0) {
    query.filters.push({
      key: "annotation_type",
      regex: {
        enable: true,
        options: "i",
      },
      value: `.*${annotation}.*`,
    });
  }

  if (date && date.length > 0 && date[0] !== null) {
    query.filters.push({
      key: "updated_at",
      value: `${moment(date[1]).add(1, "d").format()}`,
      datetime: {
        enable: true,
        options: "$lte",
      },
    });
    query.filters.push({
      key: "updated_at",
      value: `${moment(date[0]).format()}`,
      datetime: {
        enable: true,
        options: "$gte",
      },
    });
  }

  return axios.post(SEARCH_PROJECT_URL, query);
};

// delete project list
export const deleteProjectApi = (id: string) => {
  return axios.delete(`${CREATE_PROJECT_URL}/${id}`);
};

// create project
export const createProjectApi = (payload: any) => {
  return axios.post(CREATE_PROJECT_URL, payload);
};

// update project
export const updateProjectApi = (id: string, payload: any) => {
  return axios.patch(`${CREATE_PROJECT_URL}/${id}`, payload);
};

// get project
export const getProjectApi = (id: string) => {
  return axios.get(`${CREATE_PROJECT_URL}/${id}`);
};

// upload content
export const uploadContentApi = async (
  id: string,
  payload: any,
  clientId = "",
  fileName = ""
) => {
  const data = new FormData();
  payload.forEach((file: any) => {
    data.append("files", file);
  });
  let uploadUrl = `${CREATE_PROJECT_URL}/${id}/upload`;
  if (fileName) {
    uploadUrl = `${uploadUrl}?labels_file=${fileName}`;
  }
  return axios.post(uploadUrl, data);
};

// upload modal content
export const uploadModalContentApi = async (id: string, payload: any) => {
  const data = new FormData();
  payload.forEach((file: any) => {
    data.append("files", file);
  });
  const uploadUrl = `${PROJECT_MODELS}/${id}/inference/realtime`;

  return axios.post(uploadUrl, data);
};

// get upload content status
export const uploadContentStatusApi = async (id: string) => {
  return axios.get(`${PROJECT_UPLOADS}/${id}`);
};

// upload project profile
export const projectProfileApi = async (id: string, payload: any) => {
  const data = new FormData();

  payload.forEach((file: any) => {
    data.append("file", file);
  });

  return axios.post(`${CREATE_PROJECT_URL}/${id}/profile`, data);
};

// upload profile picture
export const profilePictureApi = async (id: string, payload: any) => {
  const data = new FormData();
  data.append("file", payload);

  return axios.post(`${UPDATE_PROFILEPIC_URL}/${id}/profile`, data);
};

// delete profile picture
export const deleteProfileApi = async (id: string) => {
  return axios.delete(`${UPDATE_PROFILEPIC_URL}/${id}/profile`);
};

// get current dataset
export const getCurrentDataSetApi = async (id: string) => {
  return axios.get(`${GET_DATASET_URL}/${id}`);
};

// get current dataset
export const updateDataSetApi = async (id: string, data: any) => {
  Object.keys(data).forEach((key) => {
    data[key] = data[key] / NumberLimit.ONE_HUNDRED;
  });
  return axios.patch(`${GET_DATASET_URL}/${id}`, { split: data });
};

// get content
export const getContentApi = async (
  limit: number,
  page: number,
  projectId: string,
  datasetId?: string,
  tagId?: Array<string>,
  operator?: string
) => {
  let query = `?limit=${limit}&page=${page}&project_id=${projectId}`;
  if (datasetId) {
    query = `${query}&dataset_id=${datasetId}`;
  }
  if (tagId) {
    query = `${query}${tagId}`;
  }
  query = `${query}&operator=${operator ? operator : "or"}`;
  return axios.get(`${GET_CONTENT_URL}${query}`);
};

// get random content
export const getRandomContentApi = async (projectId: string, count: number) => {
  const query = `?project_id=${projectId}&count=${count}&filter_annotated=true`;

  return axios.get(`${ADD_RANDOM_IMAGES}${query}`);
};

// get single content image
export const getContentImage = async (
  content_id: string,
  project_id: string,
  dataSet_id: string
) => {
  const query = `?project_id=${project_id}&datasetid=${dataSet_id}&image=true`;

  return axios.get(`${GET_IMAGE}/${content_id}${query}`, {
    responseType: "arraybuffer",
  });
};

// initialise export
export const initialiseExportApi = async (payload: Object) => {
  return axios.post(`${DATASET_EXPORT_URL}`, payload);
};

// get export
export const getStatusExportApi = async (payload: string) => {
  const query = {
    limit: 10,
    page: 0,
    sort_key: "created_at",
    sort_val: -1,
    operator: "and",
    filters: [
      {
        key: "projectid",
        regex: {
          enable: true,
          options: "i",
        },
        value: `.*${payload}.*`,
      },
    ],
  };
  return axios.post(`${DATASET_QUERY_EXPORT_URL}`, query);
};

export const getStatusOfExport = async () => {
  const resp = await axios.get(`${DATASET_EXPORT_URL}`);
  return resp;
};
// download export
export const downloadExportApi = async (
  payload: string,
  contentKey: string
) => {
  const resp = await axios.get(
    `${DATASET_EXPORT_URL}/${payload}/content?uri=${contentKey}&expire=5&download='true'`
  );
  if (resp?.data?.URL) {
    window.location = resp.data.URL;
  }
};

// download metadata export
export const downloadMetaExportApi = async (payload: string) => {
  const resp = await axios.get(`${DATASET_EXPORT_URL}/${payload}/metadata`);

  if (resp?.data) {
    downloadJson(resp.data, "meta-data");
  }
};
