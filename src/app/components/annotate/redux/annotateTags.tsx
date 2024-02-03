import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DELETE_CLASS_SUCCESS } from '../../../../constant/static';
import {
  addTagToAnnotate,
  deleteAnnotateTagApi,
  getTagsQueryList,
} from '../../../../service/tags';
import { getAnnotateQuery } from '../../../../service/annotate';
import { showToast } from '../../common/redux/toast';
import { NumberLimit } from '../../../../constant/number';

export const createTag = createAsyncThunk(
  'annotate/createTag',
  async (payload: Object, { dispatch }) => {
    try {
      const res = await addTagToAnnotate(payload);
      dispatch(showToast({ message: 'New label created', type: 'success' }));
      return res.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      throw Error(error);
    }
  }
);

export const getTagsQuery = createAsyncThunk(
  'content/getTagsQuery',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getTagsQueryList(payload);
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
    }
  }
);

export const deleteAnnotateTag = createAsyncThunk(
  'content/deleteAnnotateTag',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await deleteAnnotateTagApi(payload.id);
      if (resp.status === NumberLimit.TWO_HUNDRED) {
        dispatch(
          showToast({ message: DELETE_CLASS_SUCCESS, type: 'success' })
        );
      }
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      return;
    }
  }
);

export const getAnnotateTagsData = createAsyncThunk(
  'content/getAnnotateTagsData',
  async (payload: any, { dispatch }) => {
    try {
      const resp = await getAnnotateQuery(payload);
      return resp.data;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      return;
    }
  }
);

export const annotateTagSlice = createSlice({
  name: 'annotateTag',
  initialState: { tags: [], queryTags: [], annotatedTags: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTagsQuery.fulfilled, (state, action) => {
      return { ...state, queryTags: action.payload.tags };
    });
    builder.addCase(getAnnotateTagsData.fulfilled, (state, action) => {
      return { ...state, annotatedTags: action.payload.annotations };
    });
  },
});

export default annotateTagSlice.reducer;
