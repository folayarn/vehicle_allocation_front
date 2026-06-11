// thunks/ServerTableThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAsset, getSparePartRequest, getUnserviceableVehicle, getUser, getVehicle } from '../../services/API';


// Server-side table data fetcher for specific endpoints
export const FetchServerTableThunk = createAsyncThunk(
  'serverTable/fetchData',
  async ({ 
    type, 
    pageIndex = 0, 
    pageSize = 20, 
    filters = {}, 
    sort = [] 
  }, { rejectWithValue }) => {
    try {
      // Map table types to server-side API functions
      const apiMap = {
        vehicle: getVehicle,
        asset: getAsset,
        officer: getUser,
        unservice:getUnserviceableVehicle,
        sparepart:getSparePartRequest
        
      };

      const apiFunction = apiMap[type];
      if (!apiFunction) {
        throw new Error(`No server-side API function found for table type: ${type}`);
      }

      // Prepare server-side parameters
      const serverParams = {
        page: pageIndex + 1, // Server usually expects 1-based indexing
        pageSize,
        search: filters.search || '',
        startDate: filters.dateRange?.start || '',
        endDate: filters.dateRange?.end || '',
        sortBy: sort.length > 0 ? sort[0].id : null,
        sortOrder: sort.length > 0 ? (sort[0].desc ? 'desc' : 'asc') : 'asc',
      };

      // Remove empty parameters
      Object.keys(serverParams).forEach(key => {
        if (serverParams[key] === null || serverParams[key] === '' || serverParams[key] === undefined) {
          delete serverParams[key];
        }
      });

      const response = await apiFunction(serverParams);
      
      return {
        data: response.data.data,
        totalCount: response.data.totalCount,
        pageIndex,
        pageSize,
        filters,
        sort,
        tableType: type
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Thunk for getting filter options (factories, etc.)
export const FetchTableFilterOptionsThunk = createAsyncThunk(
  'serverTable/fetchFilterOptions',
  async ({ tableType, filterField }, { rejectWithValue }) => {
    try {
      const response = await Api.get(`/table-filters/${tableType}/${filterField}`);
      return {
        tableType,
        filterField,
        options: response.data.options
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filter options');
    }
  }
);