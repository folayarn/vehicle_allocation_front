import axios from 'axios';

// Create Axios instance
//const base_url = import.meta.env.VITE_API_URL
const base_url = "https://fms-api.customs.gov.ng/api"

export const Api = axios.create({
  baseURL: base_url,
  headers: {
              'Content-Type': 'application/json',

  },
});

// Request interceptor to attach access token
Api.interceptors.request.use((config) => {
  const authToken = sessionStorage.getItem("token");
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
let isRefreshing = false;
let subscribers = [];

// Flag to prevent multiple token refresh attempts
const refreshAccessToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Make request to refresh token endpoint
    const response = await Api.post(`/refresh-token`, {
      refreshToken: refreshToken,
    });

    // Save new access token and refresh token
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    sessionStorage.clear()
    location.href = '/';
    return Promise.reject(error);
  }
};

// Subscribe to token refresh
const onRefreshed = (accessToken) => {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
};

// Response interceptor to handle token expiry and refresh
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and refresh is not in process
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribers.push((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(Api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        onRefreshed(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return Api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// ==================== AUTHENTICATION APIs ====================
export const Login = (data) => {
  return Api.post('/login', data);
};

export const UpdatePassword = (data) => {
  return Api.put('/update-password', data);
};

export const ResetPassword = (data) => {
  return Api.put('/reset-password', data);
};

export const generateOTP = (data) => {
  return Api.post('/generate-otp', data);
};

// ==================== USER MANAGEMENT APIs ====================
export const FetchUser = (id) => {
  return Api.get(`/user/${id}`);
};

export const getUser = () => {
  return Api.get('/user');
};

export const getSingleUser = (id) => {
  return Api.get('/user/' + id);
};

export const createUser = (data) => {
  return Api.post('/register', data);
};

export const updateUser = (data) => {
  return Api.put('/edit-user', data);
};

export const EditUser = (data) => {
  return Api.put('/edit-user', data);
};

export const changePassword = (data) => {
  return Api.put('/update-password', data);
};

export const deleteUser = (id) => {
  return Api.delete(`/delete-user/${id}`);
};

export const suspendUser = (id) => {
  return Api.put(`/suspend-user/${id}`);
};

export const unsuspendUser = (id) => {
  return Api.put(`/unsuspend-user/${id}`);
};

// ==================== COMMAND/ZONE APIs ====================
export const addCommand = (data) => {
  return Api.post('/add-command', data);
};

export const getCommands = () => {
  return Api.get('/get-command');
};

export const editCommand = (data, id) => {
  return Api.put(`/edit-command/${id}`, data);
};

export const deleteCommand = (id) => {
  return Api.delete(`/delete-command/${id}`);
};

export const getZones = () => {
  return Api.get('/zone');
};


export const getVehicleAll = (params)=>{
  return Api.get('VehicleAssessment/get-all/'+sessionStorage.getItem('e'), { params });
}
export const getVehicle = (params)=>{
  return Api.get('VehicleAssessment/get-all/serviceable/'+sessionStorage.getItem('e'), { params });
}
export const getAllocatedVehicle = (params)=>{
  return Api.get('VehicleAssessment/get-all/allocated/'+sessionStorage.getItem('e'), { params });
}
export const getAsset = (params)=>{
  return Api.get('Assets/get-all/'+sessionStorage.getItem('e'), { params });
}

export const getUnserviceableVehicle = (params)=>{
  return Api.get('VehicleAssessment/get-all/unserviceable/'+sessionStorage.getItem('e'), { params });
}
export const addVehicle = (data) => {
  return Api.post('/VehicleAssessment', data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
export const updateVehicle = (id,data) => {
  return Api.put(`/VehicleAssessment/${id}`, data,{ headers: {
      'Content-Type': 'multipart/form-data',
    },});
};
 export const getSingleVehicle = (id) => {
  return Api.get('/VehicleAssessment/' + id);
};
export const deleteVehicle = (id) => {
  return Api.delete(`/VehicleAssessment/${id}`);
}
export const getByVehicleAllocation = (vehicle_id)=>{
  return Api.get(`/Allocation/vehicle/${vehicle_id}`);

}

export const postAllocation = (data) => {
  return Api.post('/Allocation', data,{
     headers: {
          'Content-Type': 'multipart/form-data',
        },
  });
}

export const editAllocation = (id, data) => {
  return Api.put(`/Allocation/${id}`, data,{
     headers: {
          'Content-Type': 'multipart/form-data',
        },
  });
}
export const deleteAllocationByVehicle = (id) => {
  return Api.delete(`/Allocation/${id}`);
}

export const getDriversByVehicle = (vehicle_id) => {
  return Api.get(`/Drivers/vehicle/${vehicle_id}`);
}
export const addDriver = (data) => {
  return Api.post('/Drivers', data);
}
export const updateDriver = (id, data) => {
  return Api.put(`/Drivers/${id}`, data);
}
export const deleteDriver = (id) => {
  return Api.delete(`/Drivers/${id}`);
} 

export const getDashboardSummary = (start,end) => {
  const userId = sessionStorage.getItem('e');
  return Api.get(`/VehicleAssessment/get-dash/${userId}`, {
    params: {
      startDate: selectedDate,
      EndDate: selectedDate,
    }
  });
};  

export const getRemark=(vehicle_id)=>{
    return Api.get(`/Remarks/vehicle/${vehicle_id}`);

}

export const addRemark=(data)=>{
  return Api.post('/Remarks', data);

}
export const updateRemark = (id, data) => {
  return Api.put(`/Remarks/${id}`, data);
}
export const deleteRemark = (id) => {
  return Api.delete(`/Remarks/${id}`);
} 

export const getRemarksByVehicle = (vehicle_id) => {
  return Api.get(`/Remarks/vehicle/${vehicle_id}`);
}

export const getMaintenance=(vehicle_id)=>{
    return Api.get(`/MaintenanceReport/vehicle/${vehicle_id}`);

}

export const addMaintenance=(data)=>{
  return Api.post('/MaintenanceReport', data);

}
export const updateMaintenance = (id, data) => {
  return Api.put(`/MaintenanceReport/${id}`, data);
}
export const deleteMaintenance = (id) => {
  return Api.delete(`/MaintenanceReport/${id}`);
} 

export const getMaintenanceByVehicle = (vehicle_id) => {
  return Api.get(`/MaintenanceReport/vehicle/${vehicle_id}`);
}

export const getIncidentReport=(vehicle_id)=>{
    return Api.get(`/IncidentReport/vehicle/${vehicle_id}`);

}

export const addIncidentReport =(data)=>{
  return Api.post('/IncidentReport', data,
    {
     headers: {
          'Content-Type': 'multipart/form-data',
        },
  }
  );

}
export const updateIncidentReport = (id, data) => {
  return Api.put(`/IncidentReport/${id}`, data);
}
export const deleteIncidentReport = (id) => {
  return Api.delete(`/IncidentReport/${id}`);
} 

export const getIncidentReportByVehicle = (vehicle_id) => {
  return Api.get(`/IncidentReport/vehicle/${vehicle_id}`);
}

export const getLogBook=(vehicle_id)=>{
    return Api.get(`/LogBook/vehicle/${vehicle_id}`);

}


export const addLogBook =(data)=>{
  return Api.post('/LogBook', data);

}
export const updateLogBook = (id, data) => {
  return Api.put(`/LogBook/${id}`, data);
}
export const deleteLogBook = (id) => {
  return Api.delete(`/LogBook/${id}`);
} 

export const getLogBookByVehicle = (vehicle_id) => {
  return Api.get(`/LogBook/vehicle/${vehicle_id}`);
}

export const approveLogBook = (id) => {
  return Api.post(`/LogBook/approve/${id}`);
}
export const rejectLogBook = (id,reason) => {
  return Api.post(`/LogBook/reject/${id}`,{Reason: reason});
}




export const addMaintenanceRequest =(data)=>{
  return Api.post('/MaintenanceRequest', data);

}
export const updateMaintenanceRequest = (id, data) => {
  return Api.put(`/MaintenanceRequest/${id}`, data);
}
export const deleteMaintenanceRequest = (id) => {
  return Api.delete(`/MaintenanceRequest/${id}`);
} 

export const getMaintenanceRequestByVehicle = (vehicle_id) => {
  return Api.get(`/MaintenanceRequest/vehicle/${vehicle_id}`);
}


export const getSparePartRequest =(param)=>{
  return Api.get('/SparePartRequest', {param});

}

export const getSingleSparePartRequest =(id)=>{
  return Api.get('/SparePartRequest/'+id);

}
export const addSparePartRequest =(data)=>{
  return Api.post('/SparePartRequest', data);

}
export const updateSparePartRequest = (id, data) => {
  return Api.put(`/SparePartRequest/${id}`, data);
}

export const approveSparePartRequest = (id, data) => {
  return Api.put(`/SparePartRequest/${id}/approve`, data);
}
export const rejectSparePartRequest = (id, data) => {
  return Api.put(`/SparePartRequest/${id}/reject`, data);
}
export const deleteSparePartRequest = (id) => {
  return Api.delete(`/SparePartRequest/${id}`);
} 

export const getSparePartRequestByVehicle = (vehicle_id) => {
  return Api.get(`/SparePartRequest/vehicle/${vehicle_id}`);
}

export const AckwnoledgeRequest = (id,remark) => {
  return Api.put(`/MaintenanceRequest/${id}/acknowledge`,{remark});
}

// Asset API endpoints
export const getAllAssets = () => {
  return Api.get('/Assets');
};

export const getAssetsByCommand = (commandId) => {
  return Api.get(`/Assets/command/${commandId}`);
};

export const getAssetsByZone = (zone) => {
  return Api.get(`/Assets/zone/${zone}`);
};

export const getAssetsByStatus = (status) => {
  return Api.get(`/Assets/status/${status}`);
};

export const getAssetsByCondition = (condition) => {
  return Api.get(`/Assets/condition/${condition}`);
};

export const getAssetsByType = (assetType) => {
  return Api.get(`/Assets/type/${assetType}`);
};

export const getAssetById = (id) => {
  return Api.get(`/Assets/${id}`);
};

export const addAsset = (assetData) => {
  return Api.post('/Assets', assetData);
};

export const updateAsset = (id, assetData) => {
  return Api.put(`/Assets/${id}`, assetData);
};

export const deleteAsset = (id) => {
  return Api.delete(`/Assets/${id}`);
};

// Additional useful endpoints
export const getAssetSummary = () => {
  return Api.get('/Assets/summary');
};

export const getAssetsByDateRange = (startDate, endDate) => {
  return Api.get('/Assets/date-range', {
    params: { startDate, endDate }
  });
};







export default Api;