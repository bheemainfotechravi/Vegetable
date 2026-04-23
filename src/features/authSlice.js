import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance"

// SEND OTP
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (email, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/send-otp", { email });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/verify-otp", { email, otp });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        step: 1,
        email: "",
        isAuthenticated: false,
        error: null,
    },
    reducers: {
        resetAuth: (state) => {
            state.step = 1;
            state.email = "";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // SEND OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.step = 2;
                state.email = action.meta.arg;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // VERIFY OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;

                // save token
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;