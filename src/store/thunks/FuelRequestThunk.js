// store/thunks/FuelRequestThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const CreateFuelRequestThunk = createAsyncThunk(
  'fuelRequest/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/Fuelrequest', data);
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
      const response = await api.put(`/Fuelrequest/${id}`, data);
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
      await api.delete(`/Fuelrequest/${id}`);
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
      const response = await api.get('/Fuelrequest', { params });
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
      const response = await api.post(`/Fuelrequest/${id}/approve`, data);
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
      const response = await api.post(`/Fuelrequest/${id}/dispense/${sessionStorage.getItem("e")}`);
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
      const response = await api.post(`/Fuelrequest/${id}/cancel`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);    
