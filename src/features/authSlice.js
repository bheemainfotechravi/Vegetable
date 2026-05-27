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
  isAuthenticated:false,
  user: null,
  token: null,
  error: null,
};

// ================= SLICE =================
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
          action.payload?.user?.role ||
          action.meta.arg.role ||
          "user";
      })

      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Failed to send OTP";
      })

      // ================= VERIFY OTP =================
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ Get token from backend
        const token =
          action.payload?.token ||
          action.payload?.accessToken ||
          null;

        // ✅ Get user
        const user =
          action.payload?.user || {
            name: state.email.split("@")[0],
            email: state.email,
          };

        // ✅ Auth state
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;

        state.step = 1;

        console.log("✅ Login Success");
        console.log("User:", user);
        console.log("Token:", token);
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "OTP verification failed";
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

        state.error =
          action.payload?.message ||
          "Failed to resend OTP";
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;

        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;

        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;