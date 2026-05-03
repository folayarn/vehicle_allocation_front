import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUser, EditUser, getSingleUser, getUser, ResetPassword, UpdatePassword, updateUser } from '../../services/API';


export const CreateUserThunk = createAsyncThunk(
  'createUser',
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await createUser(data);
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);



export const FetchUserThunk = createAsyncThunk(
  'getUser',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await getUser();
     
      return response.data?.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const FetchSingleUserThunk = createAsyncThunk(
  'getSingleUser',
  async (id, { rejectWithValue }) => {
    try {
      
      const response = await getSingleUser(id);
     
      return response.data?.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const UpdatePasswordThunk = createAsyncThunk(
  'updatePassword',
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await UpdatePassword({...data,
        officerId:sessionStorage.getItem('e')
      });
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const UpdateUserThunk = createAsyncThunk(
  'updateUser',
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await EditUser({...data});
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const ResetPasswordThunk = createAsyncThunk(
  'resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await ResetPassword({NewPassword:data.newPassword,
        officerId:data.id
      });
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);