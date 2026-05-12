// CartSection.jsx
import React, { useState, useEffect } from "react";
import { CiBookmark } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateCart,
  removeFromCart,
  setLocalCount,
} from "../features/cartSlice";
import axiosInstance from "../api/axiosInstance";

/* ─────────────── PRODUCT CARD ─────────────── */

const ProductCard = ({ item, selectedVariant, setSelectedVariant, onLoginRequired }) => {
  const dispatch = useDispatch();

  const variantIndex = selectedVariant[item.id] ?? 0;
  const variant = item.variants[variantIndex];

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const count = useSelector((state) => state.cart.items[item.id] ?? 0);
  const isLoading = useSelector((state) => state.cart.loadingItems[item.id] ?? false);

  const handleAdd = () => {
    if (!isAuthenticated) { onLoginRequired(); return; }
    dispatch(setLocalCount({ product_id: item.id, quantity: 1 }));
    dispatch(addToCart({ product_id: item.id, quantity: 1 }));
  };

  const handleIncrement = () => {
    if (!isAuthenticated) { onLoginRequired(); return; }
    const next = count + 1;
    dispatch(setLocalCount({ product_id: item.id, quantity: next }));
    dispatch(updateCart({ product_id: item.id, quantity: next }));
  };

  const handleDecrement = () => {
    const next = count - 1;
    dispatch(setLocalCount({ product_id: item.id, quantity: next }));
    if (next <= 0) {
      dispatch(removeFromCart({ product_id: item.id }));
    } else {
      dispatch(updateCart({ product_id: item.id, quantity: next }));
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative">
      {item.discount > 0 && (
        <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded">
          {item.discount}% OFF
        </span>
      )}

      <img src={item.img} alt={item.name} className="w-full h-44 object-cover rounded-lg" />

      <p className="text-green-700 text-xs mt-2">⚡ 10 MINS</p>
      <p className="text-gray-400 text-sm">{item.brand}</p>
      <h3 className="font-medium">{item.name}</h3>

      {/* Quantity Dropdown — shows 1, 2, 3 ... up to available stock */}
      <select
        className="w-full mt-2 border rounded px-2 py-1 text-sm"
        value={variantIndex}
        onChange={(e) =>
          setSelectedVariant((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
        }
      >
        {item.variants.map((v, i) => (
          <option key={i} value={i}>
            {v.label}
          </option>
        ))}
      </select>

      {/* Price — final_price vs mrp */}
      <div className="mt-2">
        <span className="font-bold">₹{variant.price}</span>
        <span className="line-through text-gray-400 ml-2 text-sm">₹{variant.mrp}</span>
      </div>

      {/* Add to Cart */}
      <div className="flex justify-between mt-4">
        <button className="border p-2 rounded hover:bg-gray-100"><CiBookmark /></button>

        {count === 0 ? (
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="border border-red-500 text-red-500 w-40 px-5 py-1 rounded
                       hover:bg-red-700 hover:text-white disabled:opacity-50
                       disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        ) : (
          <div className="flex items-center border border-red-500 rounded overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={isLoading}
              className="px-3 py-1 text-red-500 hover:bg-red-100 disabled:opacity-50 transition"
            >
              −
            </button>

            <span className="px-3 min-w-[32px] text-center">
              {isLoading ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                count
              )}
            </span>

            <button
              onClick={handleIncrement}
              disabled={isLoading}
              className="px-3 py-1 text-red-500 hover:bg-red-100 disabled:opacity-50 transition"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────── CART SECTION ─────────────── */

const CartSection = () => {
  const [selectedVariant, setSelectedVariant] = useState({});
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/get/all-products");
        const data = response.data;
        setProducts(
          Array.isArray(data)
            ? data
            : data.products ?? data.data ?? data.results ?? []
        );
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleLoginRequired = () => {
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3500);
  };

  const formattedProducts = (Array.isArray(products) ? products : []).map((p) => ({
    id: p.id,
    name: p.product_name,
    brand: p.brand || "fresho!",
    discount: p.discount || 0,
    // Dropdown: 1, 2, 3 ... up to available quantity
    variants: Array.from({ length: p.quantity }, (_, i) => ({
      label: `${i + 1}`,        // shows 1, 2, 3 ...
      price: p.final_price,     // discounted price from backend
      mrp: p.mrp,               // original price for strikethrough
    })),
    img: p.image?.startsWith("http") ? p.image : `${BASE_URL}${p.image}`,
  }));

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      {/* Background SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fixed top-0 left-0 z-[-1] w-full h-full opacity-10"
        viewBox="0 0 1440 810"
      >
        <path
          fill="#14b8a6"
          d="M0,192L48,208C96,224,192,256,288,250.7C384,245,480,203,576,186.7C672,171,
             768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176
             L1440,160L1440,0L0,0Z"
        />
      </svg>

      {/* Login nudge toast */}
      {showLoginToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white
                        text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <span>🔒</span>
          <span>Login to save your cart &amp; checkout!</span>
        </div>
      )}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-6">My Smart Basket</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formattedProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              onLoginRequired={handleLoginRequired}
            />
          ))}
        </div>

        {formattedProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No products found.</p>
        )}
      </div>

    </div>
  );
};

export default CartSection;