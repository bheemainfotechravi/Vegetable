import axios from "axios";

// ================= TOKEN HELPER =================
const getToken = () => {
  try {
    // ✅ Auth Persist
    const authRaw = localStorage.getItem("persist:auth");

    if (authRaw) {
      const parsed = JSON.parse(authRaw);

      const token = JSON.parse(parsed.token);

      if (token && token !== "null") {
        return token;
      }
    }

    // ✅ Vendor Persist
    const vendorRaw = localStorage.getItem("persist:vendor");

    if (vendorRaw) {
      const parsed = JSON.parse(vendorRaw);

      const vendor = JSON.parse(parsed.vendor);

      if (vendor?.token) {
        return vendor.token;
      }
    }

    return null;
  } catch (error) { 
    return null;
  }
};

// ================= AXIOS INSTANCE =================
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: false,
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    // ✅ Add Token Automatically
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
    // ✅ Unauthorized
    if (error.response?.status === 401) {
      console.warn("Unauthorized Access");

      // Optional Logout
      // localStorage.removeItem("persist:auth");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;