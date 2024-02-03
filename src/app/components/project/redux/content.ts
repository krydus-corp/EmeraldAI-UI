import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPredictionQuery } from "../../../../service/annotate";
import {
  getContentApi,
  getRandomContentApi,
  getContentImage,
} from "../../../../service/project";

import { showToast } from "../../common/redux/toast";

export const getContent = createAsyncThunk(
  "content/getContent",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getContentApi(
        payload.limit,
        payload.page,
        payload.project_id,
        payload?.dataset_id,
        payload?.tag_id,
        payload?.operator
      );
      resp.data.datasetId = payload.dataset_id ? true : false;
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const getSingleContent = createAsyncThunk(
  "content/getSingleContent",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getContentImage(
        payload.content_id,
        payload.project_id,
        payload.dataset_id
      );
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const getRandomContent = createAsyncThunk(
  "content/getRandomContent",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getRandomContentApi(payload.project_id, payload.count);
      dispatch(
        showToast({
          message: `${resp.data?.content?.length} images have been added randomly successfully.`,
          type: "success",
        })
      );
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const getUncertainImageData = createAsyncThunk(
  "content/getUncertainImageData",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getPredictionQuery(payload);
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const contentSlice = createSlice({
  name: "content",
  initialState: {
    annotateContentData: [],
    unAnnotateContentData: [],
    annotateCount: 0,
    unAnnotateCount: 0,
    imagesList: [],
  },
  reducers: {
    clearContent: (state) => {
      return {
        annotateContentData: [],
        unAnnotateContentData: [],
        annotateCount: 0,
        unAnnotateCount: 0,
        imagesList: [],
      };
    },
    addImagesList: (state, action) => {
      return { ...state, imagesList: action.payload };
    },
    randomImagesData: (state, action) => {
      return { ...state, randomImageData: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContent.fulfilled, (state, action) => {
      const annotateData = action.payload.datasetId
        ? action.payload.content
        : state.annotateContentData;
      const unAnnotateData = !action.payload.datasetId
        ? action.payload.content
        : state.unAnnotateContentData;
      const unAnnotateCountData = !action.payload.datasetId
        ? action.payload.count
        : state.unAnnotateCount;
      const annotateCountData = action.payload.datasetId
        ? action.payload.count
        : state.annotateCount;
      return {
        ...state,
        unAnnotateContentData: unAnnotateData,
        annotateContentData: annotateData,
        annotateCount: annotateCountData,
        unAnnotateCount: unAnnotateCountData,
      };
    });
    builder.addCase(getRandomContent.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { clearContent, addImagesList } = contentSlice.actions;

export const getImagesList = (state: any) => state.content.imagesList;

export default contentSlice.reducer;
