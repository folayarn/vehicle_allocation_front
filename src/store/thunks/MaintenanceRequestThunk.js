import { createAsyncThunk } from '@reduxjs/toolkit';
import {  AckwnoledgeRequest, addMaintenanceRequest, deleteMaintenanceRequest, getMaintenanceRequestByVehicle, updateMaintenanceRequest } from '../../services/API';




export const FetchMaintenanceRequestByVehicleThunk = createAsyncThunk(
        'MaintenanceRequest/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getMaintenanceRequestByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateMaintenanceRequestThunk = createAsyncThunk(
        'MaintenanceRequest/create',
        async (MaintenanceData, { rejectWithValue }) => {
          try {
            
            const response = await addMaintenanceRequest(MaintenanceData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateMaintenanceRequestThunk = createAsyncThunk(
        'MaintenanceRequest/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            const response = await updateMaintenanceRequest(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteMaintenanceRequestThunk = createAsyncThunk(
  'MaintenanceRequest/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteMaintenanceRequest(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  

export const AcknowledgeMaintenanceRequestThunk = createAsyncThunk(
  'maintenanceRequest/acknowledge',
  async ({ id,remark }, { rejectWithValue }) => {
    try {
      const response = AckwnoledgeRequest(id,remark);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);