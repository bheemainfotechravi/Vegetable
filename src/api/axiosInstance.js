import axios from "axios";

// ================= TOKEN HELPER =================
const getToken = () => {
  try {
    // Check 1: direct token key
    const directToken = localStorage.getItem("token");
    if (directToken && directToken !== "null") return directToken;

    // Check 2: persist:auth
    const authRaw = localStorage.getItem("persist:auth");
    if (authRaw) {
      const parsed = JSON.parse(authRaw);
      const token = JSON.parse(parsed.token);
      if (token && token !== "null") return token;
    }

    // Check 3: persist:vendor
    const vendorRaw = localStorage.getItem("persist:vendor");
    if (vendorRaw) {
      const parsed = JSON.parse(vendorRaw);
      const vendor = JSON.parse(parsed.vendor);
      if (vendor?.token) return vendor.token;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// ================= AXIOS INSTANCE =================
const axiosInstance = axios.create({
  baseURL: "http://192.168.29.243:5000/api",
  timeout: 10000,
  withCredentials: false,
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;