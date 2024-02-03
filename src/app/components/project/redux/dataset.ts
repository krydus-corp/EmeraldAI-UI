import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DATASET_UPDATE_SUCCESS } from "../../../../constant/static";
import {
  getCurrentDataSetApi,
  updateDataSetApi,
} from "../../../../service/project";

import { showToast } from "../../common/redux/toast";

export const getCurrentDataSet = createAsyncThunk(
  "dataset/getCurrentDataSet",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getCurrentDataSetApi(payload.id);
      return resp.data.dataset;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const updateDataSet = createAsyncThunk(
  "dataset/updateDataSet",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await updateDataSetApi(payload.id, payload.data);
      if (
        resp &&
        resp.data &&
        resp.data.dataset &&
        resp.data.dataset.projectid
      ) {
        await dispatch(getCurrentDataSet({ id: payload?.id }));
        return dispatch(
          showToast({ message: DATASET_UPDATE_SUCCESS, type: "success" })
        );
      }
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const datasetSlice = createSlice({
  name: "dataset",
  initialState: {},
  reducers: {
    clearDataset: (state) => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentDataSet.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(getCurrentDataSet.rejected, () => {
      return {};
    });
  },
});

export const { clearDataset } = datasetSlice.actions;

export default datasetSlice.reducer;
