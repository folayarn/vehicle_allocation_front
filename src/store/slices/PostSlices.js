
import { createSlice } from '@reduxjs/toolkit';
import { GenerateOtpThunk, LoginThunk } from '../thunks/LoginThunk';
import { CreateUserThunk, ResetPasswordThunk, UpdatePasswordThunk, UpdateUserThunk } from '../thunks/UserThunk';
import { CreateVehicleThunk, DeleteVehicleThunk, UpdateVehicleThunk } from '../thunks/VehicleThunk';
import { CreateAllocationThunk, DeleteAllocationThunk, UpdateAllocationThunk } from '../thunks/AllocationThunk';
import { CreateDriverThunk, DeleteDriverThunk, UpdateDriverThunk } from '../thunks/DriverThunk';
import { CreateRemarkThunk, DeleteRemarkThunk, UpdateRemarkThunk } from '../thunks/RemarkThunk';
import { ApproveLogBookThunk, CreateLogBookThunk, DeleteLogBookThunk, RejectLogBookThunk, UpdateLogBookThunk } from '../thunks/LogBookThunk';
import { CreateIncidentReportThunk, DeleteIncidentReportThunk, UpdateIncidentReportThunk } from '../thunks/IncidentReportThunk';
import { CreateMaintenanceThunk, DeleteMaintenanceThunk, UpdateMaintenanceThunk } from '../thunks/MaintenanceThunk';
import { ApproveSparePartRequestThunk, CreateSparePartRequestThunk, DeleteSparePartRequestThunk, RejectSparePartRequestThunk, UpdateSparePartRequestThunk } from '../thunks/SparePartRequestThunk';
import { CreateMaintenanceRequestThunk, DeleteMaintenanceRequestThunk, UpdateMaintenanceRequestThunk } from '../thunks/MaintenanceRequestThunk';


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


      
        builder
      .addCase(CreateDriverThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateDriverThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateDriverThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteDriverThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteDriverThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteDriverThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateDriverThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateDriverThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateDriverThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

     
           builder
      .addCase(CreateRemarkThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateRemarkThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateRemarkThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteRemarkThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteRemarkThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteRemarkThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateRemarkThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateRemarkThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateRemarkThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

     
      
           builder
      .addCase(CreateLogBookThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateLogBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateLogBookThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteLogBookThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteLogBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteLogBookThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateLogBookThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateLogBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateLogBookThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


      
           builder
      .addCase(CreateMaintenanceThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateMaintenanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateMaintenanceThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteMaintenanceThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteMaintenanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteMaintenanceThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateMaintenanceThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateMaintenanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateMaintenanceThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

           builder
      .addCase(CreateIncidentReportThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateIncidentReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateIncidentReportThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(DeleteIncidentReportThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteIncidentReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

      })
      .addCase(DeleteIncidentReportThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(UpdateIncidentReportThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateIncidentReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateIncidentReportThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(ApproveLogBookThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(ApproveLogBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(ApproveLogBookThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });
 builder
      .addCase(RejectLogBookThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(RejectLogBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(RejectLogBookThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


       builder
      .addCase(UpdateMaintenanceRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateMaintenanceRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateMaintenanceRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

        builder
      .addCase(CreateMaintenanceRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateMaintenanceRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateMaintenanceRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

       builder
      .addCase(DeleteMaintenanceRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteMaintenanceRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(DeleteMaintenanceRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


 builder
      .addCase(CreateSparePartRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(CreateSparePartRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(CreateSparePartRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


      builder
      .addCase(DeleteSparePartRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(DeleteSparePartRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(DeleteSparePartRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

      builder
      .addCase(UpdateSparePartRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(UpdateSparePartRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(UpdateSparePartRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });


      builder
      .addCase(RejectSparePartRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(RejectSparePartRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(RejectSparePartRequestThunk.rejected, (state, action) => {
        
        state.loading = false;
        state.isError = true;
        state.open = true;
        state.isLogin = false;
        state.success = false;
        state.message = action.payload;
      });

builder
      .addCase(ApproveSparePartRequestThunk.pending, (state) => {
      
        state.loading = true;
        state.isError = false;
        state.open = false;
        state.isLogin = false;
        state.success = false;
        state.message = '';
      })
      .addCase(ApproveSparePartRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.open = true;
        state.success = true;
        state.message = action.payload?.message;

        
       
      })
      .addCase(ApproveSparePartRequestThunk.rejected, (state, action) => {
        
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
