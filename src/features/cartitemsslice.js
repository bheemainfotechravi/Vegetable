// features/cartItemsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const guestHeader = () => ({
  headers: {
    "x-guest-id": localStorage.getItem("guest_id") ?? "",
  },
});

// ─────────────────────────────────────────────
// ADD CART ITEM
// ─────────────────────────────────────────────
export const addCartItemThunk = createAsyncThunk(
  "cartItems/addCartItem",
  async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/cart-items/add-to-cart",
        { product_id, quantity },
        guestHeader()
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item"
      );
    }
  }
);

// ─────────────────────────────────────────────
// GET CART ITEMS
// ─────────────────────────────────────────────
export const getCartItemsThunk = createAsyncThunk(
  "cartItems/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/cart-items/get-items",
        guestHeader()
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// ─────────────────────────────────────────────
// UPDATE CART ITEM
// ─────────────────────────────────────────────
export const updateCartItemThunk = createAsyncThunk(
  "cartItems/updateCartItem",
  async ({ cart_item_id, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/cart-items/update-cart/${cart_item_id}`,
        { quantity },
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

// ─────────────────────────────────────────────
// REMOVE CART ITEM
// ─────────────────────────────────────────────
export const removeCartItemThunk = createAsyncThunk(
  "cartItems/removeCartItem",
  async (cart_item_id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/cart-items/remove-cart/${cart_item_id}`,
        guestHeader()
      );

      return { ...res.data, cart_item_id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove"
      );
    }
  }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const cartItemsSlice = createSlice({
  name: "cartItems",

  initialState: {
    cartResponse: {
      cart: [],
      total_items: 0,
      total_price: 0,
    },

    items: {},
    cartItemIds: {},
    loadingItems: {},

    loading: false,
    error: null,
  },

  reducers: {
    resetCartItems: (state) => {
      state.cartResponse = {
        cart: [],
        total_items: 0,
        total_price: 0,
      };

      state.items = {};
      state.cartItemIds = {};
      state.loadingItems = {};
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ───────────────── GET CART ─────────────────
      .addCase(getCartItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCartItemsThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.cartResponse = action.payload;

        state.items = {};
        state.cartItemIds = {};

        const cartArray = action.payload.cart ?? [];

        cartArray.forEach((item) => {
          state.items[item.product_id] = item.quantity;
          state.cartItemIds[item.product_id] = Number(item.id);
        });
      })

      .addCase(getCartItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── ADD ITEM ─────────────────
      .addCase(addCartItemThunk.pending, (state, action) => {
        state.loadingItems[action.meta.arg.product_id] = true;
      })

      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        const {
          product_id,
          cart_item_id,
          quantity,
          total_price,
          product_price,
          name,
          image,
        } = action.payload;

        state.loadingItems[product_id] = false;

        state.items[product_id] = quantity;

        state.cartItemIds[product_id] = Number(cart_item_id);

        const existingItem = state.cartResponse.cart.find(
          (i) => i.product_id === product_id
        );

        if (existingItem) {
          existingItem.quantity = quantity;
          existingItem.subtotal = total_price;
        } else {
          state.cartResponse.cart.push({
            id: Number(cart_item_id),
            product_id,
            quantity,
            subtotal: total_price,
            price: product_price,
            name,
            image,
          });
        }

        state.cartResponse.total_items =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.quantity),
            0
          );

        state.cartResponse.total_price =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.subtotal),
            0
          );
      })

      .addCase(addCartItemThunk.rejected, (state, action) => {
        state.loadingItems[action.meta.arg.product_id] = false;
        state.error = action.payload;
      })

      // ───────────────── UPDATE ITEM ─────────────────
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        const id =
          action.payload.cart_id ??
          action.payload.cart_item_id;

        const {
          quantity,
          total_price,
          removed,
        } = action.payload;

        const product_id = Object.keys(state.cartItemIds).find(
          (key) =>
            state.cartItemIds[key] === Number(id)
        );

        if (!product_id) return;

        if (removed) {
          delete state.items[product_id];
          delete state.cartItemIds[product_id];

          state.cartResponse.cart =
            state.cartResponse.cart.filter(
              (i) => i.id !== Number(id)
            );
        } else {
          state.items[product_id] = quantity;

          const item = state.cartResponse.cart.find(
            (i) => i.id === Number(id)
          );

          if (item) {
            item.quantity = quantity;
            item.subtotal = total_price;
          }
        }

        state.cartResponse.total_items =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.quantity),
            0
          );

        state.cartResponse.total_price =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.subtotal),
            0
          );
      })

      // ───────────────── REMOVE ITEM ─────────────────
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        const { cart_item_id } = action.payload;

        const product_id = Object.keys(state.cartItemIds).find(
          (key) =>
            state.cartItemIds[key] === Number(cart_item_id)
        );

        if (!product_id) return;

        delete state.items[product_id];
        delete state.cartItemIds[product_id];

        state.cartResponse.cart =
          state.cartResponse.cart.filter(
            (i) => i.id !== Number(cart_item_id)
          );

        state.cartResponse.total_items =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.quantity),
            0
          );

        state.cartResponse.total_price =
          state.cartResponse.cart.reduce(
            (sum, i) => sum + Number(i.subtotal),
            0
          );
      });
  },
});

export const { resetCartItems } =
  cartItemsSlice.actions;

export default cartItemsSlice.reducer;