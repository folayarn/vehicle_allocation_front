import axios from 'axios';

// Create Axios instance
const base_url = "http://localhost:7119/api"
// Live Url options:
 //const base_url = _BASE_URL


//const base_url = "https://excise-api-test.nigeriatradehub.gov.ng/api";

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

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
let subscribers = [];

// Function to refresh token
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


export const getVehicle = (params)=>{
  return Api.get('/VehicleAssessment', { params });
}

export const addVehicle = (data) => {
  return Api.post('/VehicleAssessment', data);
}
export const updateVehicle = (id,data) => {
  console.log(id,data,"id and data in api update vehicle");
  return Api.put(`/VehicleAssessment/${id}`, data);
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
  return Api.post('/Allocation', data);
}

export const editAllocation = (id, data) => {
  return Api.put(`/Allocation/${id}`, data);
}
export const deleteAllocationByVehicle = (id) => {
  return Api.delete(`/Allocation/${id}`);
}



export default Api;