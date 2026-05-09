import { createAsyncThunk } from '@reduxjs/toolkit';
import { addLogBook, approveLogBook, deleteLogBook, getLogBookByVehicle, rejectLogBook, updateLogBook } from '../../services/API';




export const FetchLogBooksByVehicleThunk = createAsyncThunk(
        'LogBooks/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getLogBookByVehicle(vehicleId);
            console.log(response.data)
            return response.data; // Assuming the response has this structure
          
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateLogBookThunk = createAsyncThunk(
        'LogBooks/create',
        async (LogBookData, { rejectWithValue }) => {
          try {
            
            const response = await addLogBook(LogBookData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateLogBookThunk = createAsyncThunk(
        'LogBooks/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            console.log(id,data,"id and data in update LogBook thunk");
            const response = await updateLogBook(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteLogBookThunk = createAsyncThunk(
  'LogBooks/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteLogBook(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  
export const ApproveLogBookThunk = createAsyncThunk(
  'LogBooks/approve',
  async ({id}, { rejectWithValue }) => {  
    try {
      const response = await approveLogBook(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  

export const RejectLogBookThunk = createAsyncThunk(
  'LogBooks/reject',
  async ({id,reason}, { rejectWithValue }) => {  
    try {
      console.log(id,reason)
      const response = await rejectLogBook(id,reason);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  