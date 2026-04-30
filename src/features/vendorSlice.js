import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ✅ REGISTER
export const registerVendor = createAsyncThunk(
  "vendor/registerVendor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/vendor/request", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ LOGIN
export const loginVendor = createAsyncThunk(
  "vendor/loginVendor",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/vendor/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    loading: false,
    success: false,
    error: null,
    vendor: null,
  },

  reducers: {
    resetVendorState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerVendor.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // LOGIN
      .addCase(loginVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // ✅ Save vendor (token inside it if backend sends)
        state.vendor = action.payload.vendor;
      })
      .addCase(loginVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;