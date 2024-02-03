import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteProjectApi,
  projectListApi,
  searchProjectApi,
} from "../../../../service/project";
import { showToast } from "../../common/redux/toast";

//get project list
export const getProjectList = createAsyncThunk(
  "project/getProjectList",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await projectListApi(
        payload.limit,
        payload.page,
        payload.sort_key,
        payload.sort_val
      );
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

//search project
export const searchProjectList = createAsyncThunk(
  "project/searchProjectList",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await searchProjectApi(
        payload.limit,
        payload.page,
        payload.search,
        payload.annotation,
        payload.date
      );
      if (!resp.data.projects) {
        resp.data.projects = [];
      }
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

//delte project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await deleteProjectApi(payload.id);
      dispatch(
        showToast({ message: "Project Deleted Successfully", type: "success" })
      );
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

export const projectListSlice = createSlice({
  name: "projectList",
  initialState: { loading: false },
  reducers: {
    clearProjectList: (state) => {
      return { loading: false };
    },
    projectListLoading: () => {
      return { loading: true };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectList.pending, (state: any, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getProjectList.fulfilled, (state: any, action) => {
      return { ...action.payload, loading: false };
    });
    builder.addCase(getProjectList.rejected, (state: any, action) => {
      return { loading: false };
    });

    builder.addCase(searchProjectList.pending, (state: any, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(searchProjectList.fulfilled, (state: any, action) => {
      return { ...action.payload, loading: false };
    });
    builder.addCase(searchProjectList.rejected, (state: any, action) => {
      return { loading: false };
    });
  },
});

export const { clearProjectList, projectListLoading } =
  projectListSlice.actions;

export default projectListSlice.reducer;
