
import { createSlice } from '@reduxjs/toolkit';


import { FetchDashboardThunk } from '../thunks/DashboardThunk';

import { act } from 'react';
import { FetchServerTableThunk, FetchTableFilterOptionsThunk } from '../thunks/ServerTableThunk';
import { GetSingleVehicleThunk } from '../thunks/VehicleThunk';
import { FetchAllocationByVehicleThunk } from '../thunks/AllocationThunk';
import { FetchDriversByVehicleThunk } from '../thunks/DriverThunk';
import { FetchRemarksByVehicleThunk } from '../thunks/RemarkThunk';
import { FetchLogBooksByVehicleThunk } from '../thunks/LogBookThunk';
import { FetchIncidentReportsByVehicleThunk } from '../thunks/IncidentReportThunk';
import { FetchMaintenancesByVehicleThunk } from '../thunks/MaintenanceThunk';


export const FetchSlice = createSlice({
  name: 'fetchData',
  initialState: {
    data: [],
    summaryData:[],
    data1: [],
    summaryData1:[],
    singleData: {},
    loading: false,
    isError: false,
    isSuccess: false,
    serverTable: {
    data: [],
    totalCount: 0,
    currentPage: 0,
    pageSize: 20,
    filters: {},
    sort: [],
    loading: false,
    error: null,
    tableType: '',
    filterOptions: {} 
  }
  },
  reducers: {
  },
  extraReducers: (builder) => {
   // Add to your extraReducers
builder
.addCase(FetchServerTableThunk.pending, (state) => {
  state.serverTable.loading = true;
  state.serverTable.error = null;
})
.addCase(FetchServerTableThunk.fulfilled, (state, action) => {
  state.serverTable.loading = false;
  state.serverTable.data = action.payload.data;
  state.serverTable.totalCount = action.payload.totalCount;
  state.serverTable.currentPage = action.payload.pageIndex;
  state.serverTable.pageSize = action.payload.pageSize;
  state.serverTable.filters = action.payload.filters;
  state.serverTable.sort = action.payload.sort;
  state.serverTable.tableType = action.payload.tableType;
})
.addCase(FetchServerTableThunk.rejected, (state, action) => {
  state.serverTable.loading = false;
  state.serverTable.error = action.payload;
  state.serverTable.data = [];
  state.serverTable.totalCount = 0;
})
.addCase(FetchTableFilterOptionsThunk.fulfilled, (state, action) => {
  const { tableType, filterField, options } = action.payload;
  if (!state.serverTable.filterOptions[tableType]) {
    state.serverTable.filterOptions[tableType] = {};
  }
  state.serverTable.filterOptions[tableType][filterField] = options;
});
        

   
     

      builder
      .addCase(FetchDashboardThunk.pending, (state) => {
      
        state.singleData={};
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.singleData= action.payload;
      })
      .addCase(FetchDashboardThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });


       builder
      .addCase(FetchAllocationByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchAllocationByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchAllocationByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });

        builder
      .addCase(FetchDriversByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchDriversByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchDriversByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });

builder
      .addCase(GetSingleVehicleThunk.pending, (state) => {
      
        state.singleData={};
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(GetSingleVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.singleData= action.payload;
      })
      .addCase(GetSingleVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });


     
     
        builder
      .addCase(FetchRemarksByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchRemarksByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchRemarksByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });

     
      builder
      .addCase(FetchMaintenancesByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchMaintenancesByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchMaintenancesByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });
 builder
      .addCase(FetchIncidentReportsByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchIncidentReportsByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchIncidentReportsByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });
 builder
      .addCase(FetchLogBooksByVehicleThunk.pending, (state) => {
      
        state.data=[];
        state.loading = true;
        
        state.isError = false;
        state.isSuccess = false;
      
      })
      .addCase(FetchLogBooksByVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false
        state.isSuccess = true;
        
        state.data= action.payload;
      })
      .addCase(FetchLogBooksByVehicleThunk.rejected, (state, action) => {
      
        state.loading = true;
        state.isError = true;
        state.isSuccess = false;
        
      });




      

  },
});

export const {setLoading,resetState,closeAlert } = FetchSlice.actions;
export default FetchSlice.reducer;
