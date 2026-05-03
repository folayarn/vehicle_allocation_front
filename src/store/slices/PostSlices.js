
import { createSlice } from '@reduxjs/toolkit';
import { GenerateOtpThunk, LoginThunk } from '../thunks/LoginThunk';
import { CreateUserThunk, ResetPasswordThunk, UpdatePasswordThunk, UpdateUserThunk } from '../thunks/UserThunk';
import { CreateVehicleThunk, DeleteVehicleThunk, UpdateVehicleThunk } from '../thunks/VehicleThunk';
import { CreateAllocationThunk, DeleteAllocationThunk, UpdateAllocationThunk } from '../thunks/AllocationThunk';


export const PostSlice = createSlice({
  name: 'login',
  initialState: {
    user: {},
    oneItem:{},
    OtpRequired: false,
    loading: false,
    open: false,
    isLogin: false,
    isError: false,
    success: false,
    message: '',
  },
  reducers: {
   setLoading: (state, action) => {
     state.loading = action.payload;
   },
   
    closeAlert: (state) => {
      state.loading = false;
      state.isError = false;
      state.open = false;
      state.success = false;
    },
    resetState: (state) => {

      state.loading = false;
      state.open = false;
      state.isLogin = false;
      state.isError = false;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginThunk.pending, (state) => {
        state.user={};
        state.loading = true;
        state.isError = false;
        state.open = false;
        
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(LoginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isError = false;
        state.user = action.payload;
        state.open = true;
        state.isLogin = true;
        
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(LoginThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(GenerateOtpThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
       

        state.success = false;
        state.message = '';
      })
      .addCase(GenerateOtpThunk.fulfilled, (state, action) => {
        state.OtpRequired = true;
        state.loading = false;
        state.isError = false;
        state.user = action.payload;
        state.open = true;
       
        
        state.success = true;
        state.message = action.payload?.message;
      })
      .addCase(GenerateOtpThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });
     
      
      
      builder
      .addCase(CreateUserThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateUserThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });
     
   



      builder
      .addCase(UpdatePasswordThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdatePasswordThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(ResetPasswordThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(ResetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(ResetPasswordThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

     
      
      builder
      .addCase(UpdateUserThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateUserThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(CreateVehicleThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateVehicleThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


       builder
      .addCase(UpdateVehicleThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateVehicleThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteVehicleThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteVehicleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteVehicleThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });
     

        builder
      .addCase(CreateAllocationThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateAllocationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateAllocationThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteAllocationThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteAllocationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteAllocationThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateAllocationThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateAllocationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateAllocationThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

     
  },
});

export const {setLoading,resetState,closeAlert } = PostSlice.actions;
export default PostSlice.reducer;
