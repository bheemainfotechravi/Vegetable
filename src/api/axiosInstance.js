import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.29.243:5000/api",
  timeout: 10000,

  withCredentials: false,
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const persistVendor = localStorage.getItem("persist:vendor");

      if (persistVendor) {
        const parsed = JSON.parse(persistVendor);

        if (parsed.vendor) {
          const vendor = JSON.parse(parsed.vendor);

          if (vendor.token) {
            config.headers.Authorization = `Bearer ${vendor.token}`;
          }
        }
      }
    } catch (err) {
     
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;