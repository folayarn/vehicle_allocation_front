import { createAsyncThunk } from '@reduxjs/toolkit';
//import { LoadDashboardData} from '../../services/API';




export const FetchDashboardThunk = createAsyncThunk(
        'dashboard',
        async (_, { rejectWithValue }) => {
          try {
            
            const response = null
            // LoadDashboardData(sessionStorage.getItem('e'));
           
            return response.data?.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );