import { createAsyncThunk } from '@reduxjs/toolkit';
import { generateOTP, Login } from '../../services/API';

export const LoginThunk = createAsyncThunk(
  'login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await Login(data);
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const GenerateOtpThunk = createAsyncThunk(
  'generateOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await generateOTP(data);
     
      return response.data; // Assuming the response has this structure
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);