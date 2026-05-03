import { createAsyncThunk } from '@reduxjs/toolkit';
import { addVehicle, deleteVehicle, getSingleVehicle, getVehicle, updateVehicle } from '../../services/API';




export const FetchVehicleThunk = createAsyncThunk(
        'vehicle',
        async (_, { rejectWithValue }) => {
          try {
            
            const response = await getVehicle();
           
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateVehicleThunk = createAsyncThunk(
        'vehicle/create',
        async (vehicleData, { rejectWithValue }) => {
          try {
            
            const response = await addVehicle(vehicleData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateVehicleThunk = createAsyncThunk(
        'vehicle/update',
        async ({ id, vehicleData }, { rejectWithValue }) => {
          try { 
            console.log(id,vehicleData,"id and data in thunk update vehicle");
            const response = await updateVehicle(id, vehicleData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      
export const GetSingleVehicleThunk = createAsyncThunk(
  'vehicle/getSingle',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await getSingleVehicle(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }   
    }
);

export const DeleteVehicleThunk = createAsyncThunk(
  'vehicle/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteVehicle(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  