import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ✅ GET VENDOR PRODUCTS
export const getVendorProducts = createAsyncThunk(
  "product/getVendorProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/get/vendor-products");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// ✅ CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/create-product", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/product-update/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// ✅ DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/product-delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    success: false,
    error: null,
    products: [],
  },

  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ── GET VENDOR PRODUCTS ───────────────────────────────────
      .addCase(getVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Backend response: { products: [...] } ya directly [...]
        state.products = action.payload.products || action.payload;
      })
      .addCase(getVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── CREATE PRODUCT ────────────────────────────────────────
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // ✅ Backend response: { product: {...} } ya directly {...}
        const newProduct = action.payload.product || action.payload;
        state.products.push(newProduct);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ── UPDATE PRODUCT ────────────────────────────────────────
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload.product || action.payload;
        const index = state.products.findIndex((p) => p.id === updated.id); // ✅ was p._id
        if (index !== -1) {
          state.products[index] = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ── DELETE PRODUCT ────────────────────────────────────────
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.id !== action.payload  // ✅ was p._id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;








