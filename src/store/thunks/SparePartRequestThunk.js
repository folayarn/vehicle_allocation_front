import { createAsyncThunk } from '@reduxjs/toolkit';
import { addSparePartRequest, approveSparePartRequest, deleteSparePartRequest,  getSingleSparePartRequest,  getSparePartRequestByVehicle, rejectSparePartRequest, updateSparePartRequest } from '../../services/API';




export const FetchSparePartRequestByVehicleThunk = createAsyncThunk(
        'SparePartRequest/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getSparePartRequestByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );


      export const FetchSingleSparePartRequestThunk = createAsyncThunk(
        'singleSparePartRequest/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getSingleSparePartRequest(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );
      export const CreateSparePartRequestThunk = createAsyncThunk(
        'SparePartRequest/create',
        async (MaintenanceData, { rejectWithValue }) => {
          try {
            
            const response = await addSparePartRequest(MaintenanceData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateSparePartRequestThunk = createAsyncThunk(
        'SparePartRequest/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            const response = await updateSparePartRequest(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      

      export const ApproveSparePartRequestThunk = createAsyncThunk(
        'approveSparePartRequest/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            const response = await approveSparePartRequest(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      
export const RejectSparePartRequestThunk = createAsyncThunk(
        'RejectSparePartRequest/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            const response = await rejectSparePartRequest(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteSparePartRequestThunk = createAsyncThunk(
  'SparePartRequest/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteSparePartRequest(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  