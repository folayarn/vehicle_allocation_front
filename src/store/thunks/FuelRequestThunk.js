// store/thunks/FuelRequestThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {Api} from '../../services/API';

export const CreateFuelRequestThunk = createAsyncThunk(
  'fuelRequest/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await Api.post('/Fuelrequest', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateFuelRequestThunk = createAsyncThunk(
  'fuelRequest/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/Fuelrequest/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteFuelRequestThunk = createAsyncThunk(
  'fuelRequest/delete',
  async (id, { rejectWithValue }) => {
    try {
      await Api.delete(`/Fuelrequest/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const FetchFuelRequestsThunk = createAsyncThunk(
  'fuelRequest/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await Api.get('/Fuelrequest', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const ApproveFuelRequestThunk = createAsyncThunk(
  'fuelRequest/approve',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await Api.post(`/Fuelrequest/${id}/approve`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DispenseFuelRequestThunk = createAsyncThunk(
  'fuelRequest/dispense',
  async ({ id}, { rejectWithValue }) => {
    try {
      const response = await Api.post(`/Fuelrequest/${id}/dispense/${sessionStorage.getItem("e")}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const CancelFuelRequestThunk = createAsyncThunk(
  'fuelRequest/cancel',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await Api.post(`/Fuelrequest/${id}/cancel`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);    
