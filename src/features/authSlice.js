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
      return res.data; // must be { user, token }
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
    } catch (err) {
      // 🔥 IGNORE ERROR (IMPORTANT)
      console.log("Logout API failed but continuing logout");
    }

    return true; // ✅ ALWAYS SUCCESS
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

      localStorage.removeItem("token"); // 🔥 cleanup
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
        state.error =
          action.payload?.message || "Failed to send OTP";
      })

      // ================= VERIFY OTP =================
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        // ✅ USER
        state.user = action.payload?.user || {
          name: state.email.split("@")[0],
          email: state.email,
        };

        // 🔥 TOKEN
        const token = action.payload?.token;
        state.token = token;

        // 🔥 SAVE TOKEN (sync with axios)
        if (token) {
          localStorage.setItem("token", token);
        }

        state.step = 1;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "OTP verification failed";
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
          action.payload?.message || "Failed to resend OTP";
      })

      // ================= LOGOUT =================
.addCase(logoutUser.fulfilled, (state) => {
  state.isAuthenticated = false;
  state.user = null;
  state.token = null;

  localStorage.removeItem("user_token"); 
});
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;