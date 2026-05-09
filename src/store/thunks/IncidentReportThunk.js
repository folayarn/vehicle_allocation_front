import { createAsyncThunk } from '@reduxjs/toolkit';
import { addIncidentReport, deleteIncidentReport, getIncidentReportByVehicle, updateIncidentReport } from '../../services/API';




export const FetchIncidentReportsByVehicleThunk = createAsyncThunk(
        'IncidentReports/fetch',
        async (vehicleId, { rejectWithValue }) => {
          try {
            const response = await getIncidentReportByVehicle(vehicleId);
            
            return response.data; // Assuming the response has this structure
          } catch (error) {
            
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );

      export const CreateIncidentReportThunk = createAsyncThunk(
        'IncidentReports/create',
        async (IncidentReportData, { rejectWithValue }) => {
          try {
            
            const response = await addIncidentReport(IncidentReportData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          }
        }
      );    

      export const UpdateIncidentReportThunk = createAsyncThunk(
        'IncidentReports/update',
        async ({ id, data }, { rejectWithValue }) => {
          try { 
            console.log(id,data,"id and data in update IncidentReport thunk");
            const response = await updateIncidentReport(id, data);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
          } 
        }
      );
      


export const DeleteIncidentReportThunk = createAsyncThunk(
  'IncidentReports/delete',
  async (id, { rejectWithValue }) => {  
    try {
      const response = await deleteIncidentReport(id);
      return response.data;
    }
        catch (error) {     
        return rejectWithValue(error.response?.data?.message || 'Something went wrong');    
    }
  }
);  