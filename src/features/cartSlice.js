// features/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

/* ─────────────── ASYNC THUNKS ─────────────── */

/** POST /add-cart — add a new item */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/add-cart", { product_id, quantity });
      return { product_id, quantity, msg: res.data.msg };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to add item");
    }
  }
);

/** PATCH /update-cart — update quantity of existing item */
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/update-cart", { product_id, quantity });
      return { product_id, quantity, msg: res.data.msg };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update cart");
    }
  }
);

/** DELETE /remove-cart — remove an item entirely */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ product_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/remove-cart", {
        data: { product_id },
      });
      return { product_id, msg: res.data.msg };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to remove item");
    }
  }
);

/* ─────────────── SLICE ─────────────── */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {},         
    loadingItems: {},  
    error: null,
  },
  reducers: {
    /** Optimistic local update — call BEFORE dispatching async thunk */
    setLocalCount(state, action) {
      const { product_id, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.items[product_id];
      } else {
        state.items[product_id] = quantity;
      }
    },

    /** Clear entire cart (e.g. on logout) */
    clearCart(state) {
      state.items = {};
      state.loadingItems = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ── addToCart ── */
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loadingItems[action.meta.arg.product_id] = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        state.loadingItems[product_id] = false;
        state.items[product_id] = (state.items[product_id] ?? 0) || quantity;
      })
      .addCase(addToCart.rejected, (state, action) => {
        const product_id = action.meta.arg.product_id;
        state.loadingItems[product_id] = false;
        state.error = action.payload;
        // Rollback optimistic update
        delete state.items[product_id];
      });

    /* ── updateCart ── */
    builder
      .addCase(updateCart.pending, (state, action) => {
        state.loadingItems[action.meta.arg.product_id] = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        state.loadingItems[product_id] = false;
        state.items[product_id] = quantity;
      })
      .addCase(updateCart.rejected, (state, action) => {
        const product_id = action.meta.arg.product_id;
        state.loadingItems[product_id] = false;
        state.error = action.payload;
      });

    /* ── removeFromCart ── */
    builder
      .addCase(removeFromCart.pending, (state, action) => {
        state.loadingItems[action.meta.arg.product_id] = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { product_id } = action.payload;
        state.loadingItems[product_id] = false;
        delete state.items[product_id];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const product_id = action.meta.arg.product_id;
        state.loadingItems[product_id] = false;
        state.error = action.payload;
      });
  },
});

export const { setLocalCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;