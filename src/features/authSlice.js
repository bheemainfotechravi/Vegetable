import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ================= SEND OTP =================
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ name, email, role = "customer" }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/register/user", {
        name,
        email,
        role,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// ================= VERIFY OTP =================
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/verify/otp", {
        email,
        otp,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// ================= RESEND OTP =================
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/resend/otp", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// ================= LOGOUT =================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/logout/user");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Logout failed");
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  loading: false,
  resendLoading: false,
  step: 1,
  email: "",
  role: null,
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
};

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.resendLoading = false;
      state.step = 1;
      state.email = "";
      state.role = null;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= SEND OTP =================
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2;
        state.email = action.meta.arg.email;
        state.role =
          action.payload?.user?.role || action.meta.arg.role || "user";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
      })

      // ================= VERIFY OTP =================
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        // ✅ Handle all possible token locations from backend
        const token =
          action.payload?.token ||
          action.payload?.accessToken ||
          action.payload?.user?.token ||
          null;

        // ✅ Handle user
        const user =
          action.payload?.user || {
            name: state.email.split("@")[0],
            email: state.email,
          };

        // ✅ Remove token from user object if it exists there
        if (user?.token) delete user.token;

        state.user = user;
        state.token = token;

        if (token) {
          localStorage.setItem("token", token);
          console.log("✅ Token saved:", token);
        } else {
          console.warn("⚠️ No token received from backend!");
        }

        state.step = 1;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // ================= RESEND OTP =================
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload?.message || "Failed to resend OTP";
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // ✅ Clear both redux-persist keys (matching your axiosInstance getToken logic)
        localStorage.removeItem("persist:auth");

      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear local state even if API call fails
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        localStorage.removeItem("persist:auth");

      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;