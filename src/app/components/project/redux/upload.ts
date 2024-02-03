import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NumberLimit } from '../../../../constant/number';
import {
  uploadContentApi,
  uploadContentStatusApi,
  uploadModalContentApi,
} from '../../../../service/project';

import { showToast } from '../../common/redux/toast';

export const updateUploadDataProgress = createAsyncThunk(
  'uploadContent/updateUploadProgress',
  async (data: any) => {
    try {
      return data;
    } catch (e) {}
  }
);

export const uploadProjectContent = createAsyncThunk(
  'uploadContent/uploadProjectContent',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await uploadContentApi(payload.id, payload.data, payload?.client_id,payload?.jsonFileName);
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({
          message: error.response.data ? error.response.data.message : error.message
          , type: 'error'
        })
      );
    }
  }
);

export const uploadModalContent = createAsyncThunk(
  'uploadContent/uploadModalContent',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await uploadModalContentApi(payload.id, payload.data);
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
    }
  }
);

export const uploadProjectStatus = createAsyncThunk(
  'uploadContent/uploadProjectStatus',
  async (payload: any, { dispatch }) => {
    let totalImages = NumberLimit.ZERO;
    let failedImages = NumberLimit.ZERO;
    let succededImages = NumberLimit.ZERO;
    let failedReason = {};
    let duplicateImages = NumberLimit.ZERO;
    let data;
    let index = NumberLimit.ZERO;
    try {
      const arrayElement = payload.split(',');
      while (arrayElement.length !== index) {
        const resp = await uploadContentStatusApi(arrayElement[index]); 
        totalImages = totalImages + resp.data.total_images;
        failedImages = failedImages + resp.data.total_images_failed;
        succededImages = succededImages + resp.data.total_images_succeeded;
        duplicateImages = duplicateImages + resp.data.total_images_duplicate;
        failedReason = { ...failedReason, ...resp.data.failed };
        data = resp.data;
        index++
        if (arrayElement.length === index) {
          data.total_images = totalImages;
          data.total_images_failed = failedImages;
          data.total_images_succeeded = succededImages;
          data.total_images_duplicate = duplicateImages;
          data.failed = failedReason;
          data.labels_file = resp?.data?.labels_file;
          return data;
        }

      }


    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
    }
  }
);

export const uploadSlice = createSlice({
  name: 'upload',
  initialState: {},
  reducers: {
    clearUpload: (state) => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadProjectContent.fulfilled, (state: any, action) => {
      return action.payload;
    });
    builder.addCase(uploadProjectStatus.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(updateUploadDataProgress.fulfilled, (state, action) => {
      return action.payload;
    });
  }
});

export const { clearUpload } = uploadSlice.actions;

export default uploadSlice.reducer;
