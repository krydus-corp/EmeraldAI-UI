import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  downloadExportApi,
  downloadMetaExportApi,
  getStatusExportApi,
  initialiseExportApi,
  getStatusOfExport,
} from "../../../../service/project";

import { showToast } from "../../common/redux/toast";

export const getStatusExport = createAsyncThunk(
  "export/getStatusExport",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getStatusOfExport();
      const projectExports = resp.data.exports;
      const filteredExportsByProject = projectExports.filter(
        (projectExport: any) => {
          if (!projectExport.hasOwnProperty("project")) {
            return false;
          }
          return projectExport.project.id === payload;
        }
      );
      return filteredExportsByProject;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
    return [];
  }
);

export const downloadExport = createAsyncThunk(
  "export/downloadExport",
  async (payload: any, { dispatch }) => {
    try {
      return await downloadExportApi(payload.id, payload.contentKey);
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const downloadMetaExport = createAsyncThunk(
  "export/downloadMetaExport",
  async (payload: string, { dispatch }) => {
    try {
      return await downloadMetaExportApi(payload);
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const initialiseExport = createAsyncThunk(
  "export/initialiseExport",
  async (payload: Object, { dispatch }) => {
    try {
      const response = await initialiseExportApi(payload);
      return response.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
    }
  }
);

export const exportSlice = createSlice({
  name: "export",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatusExport.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(getStatusExport.rejected, () => {
      return [];
    });
  },
});

export default exportSlice.reducer;
