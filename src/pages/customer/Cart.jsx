import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { BsCartXFill } from "react-icons/bs";
// import { updateCartItem, removeFromCart } from "../features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.product.products);

  const cartList = products
    .filter((p) => cartItems[p.id])
    .map((p) => ({
      ...p,
      quantity: cartItems[p.id],
    }));

  const total = cartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ================= EMPTY CART =================
  if (cartList.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-full max-w-md">

            <BsCartXFill className="text-blue-500 w-28 h-28 mx-auto mb-4 drop-shadow-md" />

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything yet
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  // ================= CART WITH PRODUCTS =================
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-3 md:p-6">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Your Basket
            </h1>
            <span className="text-sm text-gray-500">
              {cartList.length} Products
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="md:col-span-2 bg-white rounded-xl shadow">

              {cartList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border-b hover:bg-gray-50 transition"
                >
                  {/* IMAGE */}
                  <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={`${BASE_URL}${item.image}`}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      ₹{item.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              product_id: item.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full text-lg"
                      >
                        -
                      </button>

                      <span className="font-medium text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              product_id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-8 h-8 bg-green-500 text-white rounded-full text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 mt-3 text-sm">
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>

                      <button className="text-gray-500 hover:underline">
                        Save for later
                      </button>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="text-right font-semibold text-lg text-gray-800">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (SUMMARY) */}
            <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-4">

              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                Bill Details
              </h2>

              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between mb-2 text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* DELIVERY OPTIONS */}
              <div className="mt-5">
                <p className="text-sm font-medium mb-2 text-gray-700">
                  Choose delivery type
                </p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-100 border border-green-500 rounded-lg py-2 text-sm font-medium hover:bg-green-200 transition">
                    ⚡ Now <br /> 15 mins
                  </button>

                  <button className="flex-1 bg-gray-100 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition">
                    Later <br /> 1 hr
                  </button>
                </div>
              </div>

              {/* CHECKOUT */}
              <button className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;