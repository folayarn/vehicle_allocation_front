import { createAsyncThunk } from '@reduxjs/toolkit';
import { addVehicle, deleteAllocationByVehicle, deleteVehicle, editAllocation, getByVehicleAllocation, getSingleVehicle, getVehicle, postAllocation, updateVehicle } from '../../services/API';




export const FetchAllocationByVehicleThunk = createAsyncThunk(
        'allocation/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getByVehicleAllocation(vehicleId);
           
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateAllocationThunk = createAsyncThunk(
        'allocation/create',
        async (allocationData, { rejectWithValue }) => {
          try {
            
            const response = await postAllocation(allocationData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateAllocationThunk = createAsyncThunk(
        'allocation/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            const response = await editAllocation(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteAllocationThunk = createAsyncThunk(
  'allocation/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteAllocationByVehicle(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  