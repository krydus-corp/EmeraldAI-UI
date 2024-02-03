import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changePasswordApi, updateEmailApi, updateProfileApi, verifyUpdateEmailCodeApi } from '../../../../service/loginApi';
import { deleteProfileApi, profilePictureApi } from '../../../../service/project';
import { setLocal } from '../../../../utils/localStorage';
import { PROJECT_LIST } from '../../../../utils/routeConstants';
import { showToast } from '../../common/redux/toast';
import { getUserDetails } from './user';

interface IUpdatePayload {
    id: string
    data: any
    close?: any
    navigate?: any
}

interface IChangePasswordPayload {
    data: any
    id: string
    reset: any
    close: () => void
}

interface IUpdateEmailPayload {
    id: any
    email: string
    reset?: any
}
interface IVerifyUpdatePayload {
    id: string
    email: string
    code: string
    close?: any
    navigate?: any
}
const initialState = {
    otp: '',
    email: ''
};

export const fetchUpdateRequest = createAsyncThunk('update/UpdateProfileRequest', async (payload: IUpdatePayload, { dispatch }) => {
    try {
        const resp = await updateProfileApi(payload.data, payload.id);
        setLocal('User', resp.data);
        await dispatch(getUserDetails());
        dispatch(showToast({ message: 'Profile updated successfully', type: 'success' }));
        if (payload.close) {
            payload.close();
        }
        payload.navigate(PROJECT_LIST);
        return resp.data;
    } catch (error: any) {
        if (payload.close) {
            payload.close();
        }
        dispatch(showToast({ message: error.response.data.message, type: 'error' }));
        throw Error(error);
    }
});


export const fetchUpdateProfilePicRequest = createAsyncThunk('update/UpdateProfileRequest', async (payload: any, { dispatch }) => {
    try {
        const resp = await profilePictureApi(payload.id, payload.data);
        dispatch(showToast({ message: 'Profile picture uploaded successfully', type: 'success' }));
        await dispatch(getUserDetails());
        return resp.data;

    } catch (error: any) {
        dispatch(showToast({ message: error.response.data.message, type: 'error' }));
        throw Error(error);
    }
});

export const deleteProfileImage = createAsyncThunk('update/deleteProfileImage', async (payload: any, { dispatch }) => {
    try {
        const resp = await deleteProfileApi(payload.id);
        dispatch(showToast({ message: 'Profile picture deleted successfully', type: 'success' }));
        await dispatch(getUserDetails());
        return resp.data;

    } catch (error: any) {
        dispatch(showToast({ message: error.response.data.message, type: 'error' }));
        throw Error(error);
    }
});

export const fetchUpdateEmailRequest = createAsyncThunk('update/UpdateEmailRequest', async (payload: IUpdateEmailPayload, { dispatch }) => {
    try {
        const resp = await updateEmailApi(payload.id, payload.email);
        dispatch(updateEmail(payload.email));
        await dispatch(getUserDetails());
        payload.reset();
        return resp.data;

    } catch (error: any) {
        dispatch(showToast({ message: 'Unauthorized', type: 'error' }));
        throw Error(error);
    }
});


export const verifyUpdateEmailCodeRequest = createAsyncThunk('update/UpdateEmailCodeRequest', async (payload: IVerifyUpdatePayload, { dispatch }) => {
    try {
        const resp = await verifyUpdateEmailCodeApi(payload.id, payload.email, payload.code);
        dispatch(updateEmail(payload.email));
        return resp.data;
    } catch (error: any) {
        dispatch(showToast({ message: error.response.data.message, type: 'error' }));
        throw Error(error);
    }
});

export const fetchPasswordChangeRequest = createAsyncThunk('update/ChangePasswordRequest', async (payload: IChangePasswordPayload, { dispatch }) => {
    try {
        const res = await changePasswordApi(payload.data, payload.id);
        payload.reset();
        payload.close();
        dispatch(showToast({ message: 'Password changed successfully', type: 'success' }));
        return res.data;
    } catch (error: any) {
        dispatch(showToast({ message: error.response.data.message, type: 'error' }));
        payload.reset();
        payload.close();
        throw Error(error);
    }
});


export const updateProfileSlice = createSlice({
    name: 'updateProfile',
    initialState,
    reducers: {
        updateEmail: (state, action) => {
            return { ...state, email: action.payload };
        },
        updateOtpCode: (state, action) => {
            return { ...state, otp: action.payload };
        }

    },
});

export const { updateEmail, updateOtpCode } = updateProfileSlice.actions;
export default updateProfileSlice.reducer;

