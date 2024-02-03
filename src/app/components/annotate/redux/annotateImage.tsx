import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteAnnotateImageApi, changeCoverPhotoApi, annotateImages, deleteLabelsApi } from '../../../../service/annotate';
import { showToast } from '../../common/redux/toast';

// delete content
export const deleteContent = createAsyncThunk(
  'annotate/deleteContent',
  async (payload: Object, { dispatch }) => {
    try {
      await deleteAnnotateImageApi(payload);
      dispatch(
        showToast({ message: 'Image deleted successfully', type: 'success' })
      );
      return payload;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      throw Error(error);
    }
  }
);

// delete labels
export const deleteLabels = createAsyncThunk(
  'annotate/deleteContent',
  async (payload: Object, { dispatch }) => {
    try {
      await deleteLabelsApi(payload);
      // dispatch(
      //   showToast({ message: 'Label deleted successfully', type: 'success' })
      // );
      return payload;
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      throw Error(error);
    }
  }
);

export const changeCoverPhoto = createAsyncThunk(
  'annotate/makeCoverPhoto',
  async (payload: any, { dispatch }) => {
    try {
      await changeCoverPhotoApi(payload.data, payload.id);
      dispatch(
        showToast({ message: 'Cover Photo updated successfully', type: 'success' })
      );
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      throw Error(error);
    }
  }
);

export const finishAnnotation = createAsyncThunk(
  'annotate/finishAnnotation',
  async (payload: Object, { dispatch }) => {
    try {
      await annotateImages(payload);
      dispatch(
        showToast({ message: 'Image annotated successfully', type: 'success' })
      );
    } catch (error: any) {
      dispatch(
        showToast({ message: error.response.data.message, type: 'error' })
      );
      throw Error(error);
    }
  }
);

export const annotateContentSlice = createSlice({
  name: 'annotateContent',
  initialState: { selectedImages: [] },
  reducers: {
    addSelectedContent: (state, action) => {
      return ({ ...state, selectedImages: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteContent.fulfilled, (state: any, action: any) => {
      const id = action.payload.data.content_ids && action.payload.data.content_ids[0];
      const data = state.selectedImages.filter((ele: any) => ele.id !== id);
      return ({ ...state, selectedImages: data });
    });
  }
});

export const { addSelectedContent } = annotateContentSlice.actions;

export default annotateContentSlice.reducer;
