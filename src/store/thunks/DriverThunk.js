import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDriver, deleteDriver, getDriversByVehicle, updateDriver } from '../../services/API';




export const FetchDriversByVehicleThunk = createAsyncThunk(
        'drivers/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getDriversByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateDriverThunk = createAsyncThunk(
        'drivers/create',
        async (driverData, { rejectWithValue }) => {
          try {
            
            const response = await addDriver(driverData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateDriverThunk = createAsyncThunk(
        'drivers/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            console.log(id,data,"id and data in update driver thunk");
            const response = await updateDriver(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteDriverThunk = createAsyncThunk(
  'drivers/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteDriver(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  