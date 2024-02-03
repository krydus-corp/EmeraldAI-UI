import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NumberLimit } from "../../../../constant/number";
import {
  createProjectApi,
  getProjectApi,
  projectProfileApi,
  updateProjectApi,
} from "../../../../service/project";
import { PROJECT_LIST } from "../../../../utils/routeConstants";
import { showToast } from "../../common/redux/toast";
import { getContent } from "./content";
import { getCurrentDataSet } from "./dataset";
import { clearProjectList } from "./projectList";

//create project
export const createProjectRequest = createAsyncThunk(
  "createProject/createProjectRequest",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await createProjectApi(payload);
      dispatch(
        showToast({ message: "Project Created Successfully.", type: "success" })
      );
      dispatch(getCurrentDataSet({ id: resp?.data?.datasetid }));
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

//update project
export const updateProjectRequest = createAsyncThunk(
  "updateProject/updateProjectRequest",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await updateProjectApi(payload.id, payload.data);
      if (resp.data.id) {
        await dispatch(
          showToast({
            message: "Project Updated Successfully.",
            type: "success",
          })
        );
        await dispatch(getCurrentDataSet({ id: resp?.data?.datasetid }));

        if (payload.page.includes(PROJECT_LIST)) {
          await dispatch(clearProjectList());
        } else {
          await dispatch(clearProject());
        }
        return resp.data;
      }
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

//get a project
export const getProjectRequest = createAsyncThunk(
  "getProject/getProjectRequest",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getProjectApi(payload.id);
      await dispatch(getCurrentDataSet({ id: resp?.data?.datasetid }));
      await dispatch(
        getContent({
          limit: NumberLimit.TWINTY_FOUR,
          page: NumberLimit.ZERO,
          project_id: resp.data.id,
        })
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

//upload project profile
export const uploadProjectProfile = createAsyncThunk(
  "profileImage/uploadProjectProfile",
  async (payload: any, { dispatch }) => {
    try {
      await projectProfileApi(payload.id, payload.data);
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: "error" })
      );
      throw Error(error);
    }
  }
);

export const getProjectAnnotationRequest = createAsyncThunk(
  "getProject/getProjectRequest",
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getProjectApi(payload.id);
      dispatch(getCurrentDataSet({ id: resp?.data?.datasetid }));
      dispatch(
        getContent({
          limit: NumberLimit.TWINTY_FOUR,
          page: NumberLimit.ZERO,
          project_id: resp.data.id,
        })
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

export const projectSlice = createSlice({
  name: "project",
  initialState: {},
  reducers: {
    clearProject: (state) => {
      return {};
    },
    addProject: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProjectRequest.fulfilled, (state, action) => {
      return action.payload;
    });

    builder.addCase(getProjectRequest.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(getProjectRequest.pending, (state) => {
      return { loading: true };
    });
  },
});

export const { clearProject, addProject } = projectSlice.actions;

export default projectSlice.reducer;
