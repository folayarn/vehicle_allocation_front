import { createAsyncThunk } from '@reduxjs/toolkit';
import { addMaintenance, deleteMaintenance, getMaintenanceByVehicle, updateMaintenance } from '../../services/API';




export const FetchMaintenancesByVehicleThunk = createAsyncThunk(
        'Maintenances/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getMaintenanceByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateMaintenanceThunk = createAsyncThunk(
        'Maintenances/create',
        async (MaintenanceData, { rejectWithValue }) => {
          try {
            
            const response = await addMaintenance(MaintenanceData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateMaintenanceThunk = createAsyncThunk(
        'Maintenances/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            console.log(id,data,"id and data in update Maintenance thunk");
            const response = await updateMaintenance(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteMaintenanceThunk = createAsyncThunk(
  'Maintenances/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteMaintenance(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  