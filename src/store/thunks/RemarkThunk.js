import { createAsyncThunk } from '@reduxjs/toolkit';
import { addRemark, deleteRemark, getRemarksByVehicle, updateRemark } from '../../services/API';




export const FetchRemarksByVehicleThunk = createAsyncThunk(
        'Remarks/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getRemarksByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateRemarkThunk = createAsyncThunk(
        'Remarks/create',
        async (RemarkData, { rejectWithValue }) => {
          try {
            
            const response = await addRemark(RemarkData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateRemarkThunk = createAsyncThunk(
        'Remarks/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            console.log(id,data,"id and data in update Remark thunk");
            const response = await updateRemark(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteRemarkThunk = createAsyncThunk(
  'Remarks/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteRemark(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  