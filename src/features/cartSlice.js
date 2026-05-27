
// features/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ===============================
// GUEST ID HELPER
// ===============================
export const getGuestId = () => {
  let guestId = localStorage.getItem("guest_id");

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }

  return guestId;
};

const guestHeader = () => ({
  headers: {
    "x-guest-id": getGuestId(),
  },
});

// ===============================
// ADD TO CART
// ===============================
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/cart/add-to-cart",
        { product_id, quantity },
        guestHeader()
      );

      return {
        product_id,
        cart_id: res.data.cart_id,
        quantity: res.data.quantity,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add"
      );
    }
  }
);

// ===============================
// GET CART
// ===============================
export const getCartThunk = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/cart/get-cart",
        guestHeader()
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// ===============================
// UPDATE CART
// ===============================
export const updateCartThunk = createAsyncThunk(
  "cart/updateCart",
  async ({ cart_id, action }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/cart/update-cart/${cart_id}`,
        { action },
        guestHeader()
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update"
      );
    }
  }
);

// ===============================
// REMOVE CART
// ===============================
export const removeCartThunk = createAsyncThunk(
  "cart/removeCart",
  async (cart_id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/cart/remove-cart/${cart_id}`,
        guestHeader()
      );

      return { ...res.data, cart_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove"
      );
    }
  }
);

// ===============================
// MERGE CART
// ===============================
export const mergeCartThunk = createAsyncThunk(
  "cart/mergeCart",
  async (_, { rejectWithValue }) => {
    try {
      const guest_id = localStorage.getItem("guest_id");

      if (!guest_id) {
        return { message: "No guest cart" };
      }

      const res = await axiosInstance.post(
        "/cart/merge-cart",
        { guest_id }
      );

      localStorage.removeItem("guest_id");

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Merge failed"
      );
    }
  }
);

// ===============================
// SLICE
// ===============================
const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartResponse: null,

    items: {},
    cartIds: {},
    loadingItems: {},

    totalQty: 0,
    totalPrice: 0,

    loading: false,
    error: null,
  },

  reducers: {

    // ===============================
    // LOCAL COUNT UPDATE
    // ===============================
    setLocalCount: (state, action) => {

      const { product_id, quantity } = action.payload;

      if (quantity <= 0) {
        delete state.items[product_id];
        delete state.cartIds[product_id];
      } else {
        state.items[product_id] = quantity;
      }

      // UPDATE cartResponse ALSO
      if (state.cartResponse?.cart) {

        const item = state.cartResponse.cart.find(
          (item) => item.product_id === product_id
        );

        if (item) {
          item.quantity = quantity;
        }

        if (quantity <= 0) {
          state.cartResponse.cart =
            state.cartResponse.cart.filter(
              (item) => item.product_id !== product_id
            );
        }
      }
    },

    // ===============================
    // CLEAR CART
    // ===============================
    clearCart: (state) => {
      state.cartResponse = null;
      state.items = {};
      state.cartIds = {};
      state.loadingItems = {};
      state.totalQty = 0;
      state.totalPrice = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // ===============================
    // GET CART
    // ===============================
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCartThunk.fulfilled, (state, action) => {

        state.loading = false;

        const cartArray = action.payload.cart ?? [];

        // SAVE FULL RESPONSE
        state.cartResponse = action.payload;

        // RESET
        state.items = {};
        state.cartIds = {};

        // BUILD MAPS
        cartArray.forEach((item) => {
          state.items[item.product_id] = item.quantity;
          state.cartIds[item.product_id] = item.id;
        });

        state.totalQty =
          action.payload.total_items ?? 0;

        state.totalPrice =
          action.payload.total_price ?? 0;
      })

      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================
      // ADD TO CART
      // ===============================
      .addCase(addToCartThunk.pending, (state, action) => {

        const { product_id } = action.meta.arg;

        state.loadingItems[product_id] = true;
      })

      .addCase(addToCartThunk.fulfilled, (state, action) => {

        const { product_id, cart_id, quantity } =
          action.payload;

        state.loadingItems[product_id] = false;

        state.items[product_id] = quantity;
        state.cartIds[product_id] = cart_id;
      })

      .addCase(addToCartThunk.rejected, (state, action) => {

        const { product_id } = action.meta.arg;

        state.loadingItems[product_id] = false;

        state.error = action.payload;
      })

      // ===============================
      // UPDATE CART
      // ===============================
      .addCase(updateCartThunk.pending, (state, action) => {

        const cart_id = action.meta.arg.cart_id;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (product_id) {
          state.loadingItems[product_id] = true;
        }
      })

      .addCase(updateCartThunk.fulfilled, (state, action) => {

        const { cart_id, quantity, removed } =
          action.payload;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (!product_id) return;

        state.loadingItems[product_id] = false;

        if (removed) {

          delete state.items[product_id];
          delete state.cartIds[product_id];

        } else {

          state.items[product_id] = quantity;

          // UPDATE cartResponse
          if (state.cartResponse?.cart) {

            const item =
              state.cartResponse.cart.find(
                (item) =>
                  item.product_id ==
                  product_id
              );

            if (item) {
              item.quantity = quantity;
            }
          }
        }
      })

      .addCase(updateCartThunk.rejected, (state, action) => {

        const cart_id = action.meta.arg.cart_id;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (product_id) {
          state.loadingItems[product_id] = false;
        }

        state.error = action.payload;
      })

      // ===============================
      // REMOVE CART
      // ===============================
      .addCase(removeCartThunk.pending, (state, action) => {

        const cart_id = action.meta.arg;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (product_id) {
          state.loadingItems[product_id] = true;
        }
      })

      .addCase(removeCartThunk.fulfilled, (state, action) => {

        const { cart_id } = action.payload;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (!product_id) return;

        state.loadingItems[product_id] = false;

        delete state.items[product_id];
        delete state.cartIds[product_id];

        // REMOVE FROM cartResponse
        if (state.cartResponse?.cart) {

          state.cartResponse.cart =
            state.cartResponse.cart.filter(
              (item) => item.id !== cart_id
            );
        }
      })

      .addCase(removeCartThunk.rejected, (state, action) => {

        const cart_id = action.meta.arg;

        const product_id = Object.keys(
          state.cartIds
        ).find(
          (key) => state.cartIds[key] === cart_id
        );

        if (product_id) {
          state.loadingItems[product_id] = false;
        }

        state.error = action.payload;
      })

      // ===============================
      // MERGE CART
      // ===============================
      .addCase(mergeCartThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(mergeCartThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(mergeCartThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setLocalCount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;