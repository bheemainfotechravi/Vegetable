// Cart.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar";

import { BsCartXFill } from "react-icons/bs";
import { FiTrash2, FiLock, FiShoppingBag } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance";

import {
  getCartItemsThunk,
  updateCartItemThunk,
  removeCartItemThunk
} from "../../features/cartitemsslice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ===============================
  // REDUX STATE
  // ===============================
  const cartResponse = useSelector((state) => state.cartItems.cartResponse);
  const cartList     = cartResponse?.items || [];
  const loading      = useSelector((state) => state.cartItems.loading);
  const loadingItems = useSelector((state) => state.cartItems.loadingItems || {});

  // ===============================
  // GET CART ON MOUNT
  // ===============================
  useEffect(() => {
    dispatch(getCartItemsThunk());
  }, [dispatch]);

  // ===============================
  // TOTALS
  // ===============================
  const total      = cartList.reduce((sum, item) => sum + Number(item.total_price), 0);
  const totalItems = cartResponse?.total_items ?? 0;

  // ===============================
  // INCREMENT
  // ===============================
  const handleIncrement = async (item) => {
    if (loadingItems[item.product_id]) return;

    const savedQty = item.quantity;

    dispatch(setLocalCartItemCount({ product_id: item.product_id, quantity: savedQty + 1 }));

    try {
      const res = await dispatch(
        updateCartItemThunk({ cart_item_id: item.cart_item_id, quantity: savedQty + 1 })
      );

      if (updateCartItemThunk.rejected.match(res)) throw new Error();

    } catch {
      dispatch(setLocalCartItemCount({ product_id: item.product_id, quantity: savedQty }));
      toast.error("Failed to update quantity");
    }
  };

  // ===============================
  // DECREMENT
  // ===============================
  const handleDecrement = async (item) => {
    if (loadingItems[item.product_id]) return;

    const savedQty = item.quantity;
    const nextQty  = savedQty - 1;

    if (nextQty <= 0) return handleRemove(item);

    dispatch(setLocalCartItemCount({ product_id: item.product_id, quantity: nextQty }));

    try {
      const res = await dispatch(
        updateCartItemThunk({ cart_item_id: item.cart_item_id, quantity: nextQty })
      );

      if (updateCartItemThunk.rejected.match(res)) throw new Error();

    } catch {
      dispatch(setLocalCartItemCount({ product_id: item.product_id, quantity: savedQty }));
      toast.error("Failed to update quantity");
    }
  };

  // ===============================
  // REMOVE ITEM
  // ===============================
  const handleRemove = async (item) => {
    try {
      const res = await dispatch(removeCartItemThunk(item.cart_item_id));

      if (removeCartItemThunk.fulfilled.match(res)) {
        toast.success("Item removed");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <span className="w-8 h-8 border-4 border-gray-200 border-t-[#55883B] rounded-full animate-spin block" />
        </div>
      </>
    );
  }

  // ===============================
  // EMPTY CART
  // ===============================
  if (!cartList.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-sm w-full mx-4 shadow-sm">

            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <BsCartXFill className="text-red-400 w-9 h-9" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Looks like you haven't added anything yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white px-8 py-2.5 rounded-xl text-sm font-medium"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      </>
    );
  }

  // ===============================
  // CART WITH ITEMS
  // ===============================
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[#55883B] rounded-xl flex items-center justify-center">
              <FiShoppingBag className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 leading-none">
                Your Cart
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">

            {/* LEFT — CART ITEMS */}
            <div className="md:col-span-2 space-y-3">
              {cartList.map((item) => {
                const isLoading = loadingItems[item.product_id] || false;

                return (
                  <div
                    key={item.cart_item_id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >

                    {/* IMAGE */}
                    <div className="flex-shrink-0">
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold text-gray-800 text-[15px] truncate">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-400 mt-0.5">
                        ₹{Number(item.product_price).toLocaleString("en-IN")} each
                      </p>

                      {/* QTY CONTROLS */}
                      <div className="flex items-center mt-3">

                        {/* MINUS */}
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-l-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-lg"
                        >
                          −
                        </button>

                        {/* QTY */}
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-200 text-sm font-semibold text-gray-800 bg-white">
                          {isLoading ? (
                            <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin block" />
                          ) : (
                            item.quantity
                          )}
                        </div>

                        {/* PLUS */}
                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-r-lg bg-[#55883B] text-white hover:opacity-90 disabled:opacity-40 text-lg"
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={isLoading}
                        className="flex items-center gap-1 mt-2.5 text-xs text-red-400 hover:text-red-600 disabled:opacity-40"
                      >
                        <FiTrash2 size={11} />
                        Remove
                      </button>

                    </div>

                    {/* ITEM TOTAL PRICE */}
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[15px] font-semibold text-gray-800">
                        ₹{Number(item.total_price).toLocaleString("en-IN")}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* RIGHT — BILL DETAILS */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6 shadow-sm">

              <h2 className="text-base font-semibold text-gray-800 mb-5">
                Bill Details
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="text-gray-800 font-medium">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Free
                  </span>
                </div>

              </div>

              <div className="border-t border-gray-100 my-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-800">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button className="w-full bg-[#55883B] hover:opacity-90 transition-all text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
                <FiLock size={14} />
                Proceed to Checkout
              </button>

              <p className="text-center text-xs text-gray-300 mt-3">
                Safe & secure checkout
              </p>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;