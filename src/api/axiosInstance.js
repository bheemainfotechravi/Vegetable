import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://10.253.178.29:5000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR (ADD LOGS)
axiosInstance.interceptors.request.use(
    (config) => {
        console.log("🚀 API REQUEST");
        console.log("URL:", config.baseURL + config.url);
        console.log("METHOD:", config.method);
        console.log("DATA:", config.data);
        console.log("HEADERS:", config.headers);
        console.log("withCredentials:", config.withCredentials);
        console.log("----------------------------");

        return config;
    },
    (error) => {
        console.log("❌ REQUEST ERROR:", error);
        return Promise.reject(error);
    }
);

// ✅ RESPONSE INTERCEPTOR (DETAILED LOGS)
axiosInstance.interceptors.response.use(
    (response) => {
        console.log("✅ API RESPONSE");
        console.log("DATA:", response.data);
        console.log("STATUS:", response.status);
        console.log("----------------------------");

        return response;
    },
    (error) => {
        console.log("❌ API ERROR FULL OBJECT:", error);

        if (error.response) {
            // Server responded (4xx, 5xx)
            console.log("🔴 STATUS:", error.response.status);
            console.log("🔴 DATA:", error.response.data);
        } else if (error.request) {
            // Request sent but no response
            console.log("🟡 NO RESPONSE FROM SERVER");
            console.log(error.request);
        } else {
            // Something else
            console.log("⚠️ ERROR MESSAGE:", error.message);
        }

        console.log("----------------------------");

        return Promise.reject(error);
    }
);

export default axiosInstance;