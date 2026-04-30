import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.29.243:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ VERY IMPORTANT (for cookies)
});

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use(
  (config) => {
    // ❌ No token needed (cookie will be sent automatically)
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.log("Unauthorized - session expired or invalid");

      // ❌ don't reload page
      // ❌ don't redirect here

      // optional: you can handle logout globally later
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;