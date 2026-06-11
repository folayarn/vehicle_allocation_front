import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  addAsset, 
  deleteAsset, 
  getAssetsByCommand, 
  updateAsset,
  getAllAssets,
  getAssetsByZone,
  getAssetsByStatus,
  getAssetsByCondition,
  getAssetsByType,
  getAssetById
} from '../../services/API';



// Create new asset
export const CreateAssetThunk = createAsyncThunk(
  'assets/create',
  async (assetData, { rejectWithValue }) => {
    try {
      const response = await addAsset(assetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Update existing asset
export const UpdateAssetThunk = createAsyncThunk(
  'assets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(id, data, "id and data in update asset thunk");
      const response = await updateAsset(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete asset
export const DeleteAssetThunk = createAsyncThunk(
  'assets/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteAsset(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

export const FetchSingleAssetThunk = createAsyncThunk(
  'assets/fetchSingle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAssetById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);