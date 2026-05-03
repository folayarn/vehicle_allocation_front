
import { createSlice } from '@reduxjs/toolkit';
import { FetchSingleUserThunk, FetchUserThunk } from '../thunks/UserThunk';


export const userSlice = createSlice({
  name: 'fetchUser',
  initialState: {
    user: {},
    data:[],
    loading: false,
   
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchUserThunk.pending, (state) => {
        state.data=[];
        state.loading = true;
        
      })
      .addCase(FetchUserThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        

        
       
      })
      .addCase(FetchUserThunk.rejected, (state, action) => {
        
        state.loading = false;
       
      });

      builder
      .addCase(FetchSingleUserThunk.pending, (state) => {
        state.user={};
        state.loading = true;
        
      })
      .addCase(FetchSingleUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        

        
       
      })
      .addCase(FetchSingleUserThunk.rejected, (state, action) => {
        
        state.loading = false;
       
      });
    
     
  },
});


export default userSlice.reducer;
