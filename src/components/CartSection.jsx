// CartSection.jsx
import React, { useState, useEffect } from "react";
import { CiBookmark } from "react-icons/ci";
import { BsBookmarkFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addToCartThunk,
  getCartThunk,
  updateCartThunk,
  removeCartThunk,
  setLocalCount,
} from "../features/cartSlice";

import axiosInstance from "../api/axiosInstance";

/* ══════════════════════════════════════════════
   SPINNER
══════════════════════════════════════════════ */
const Spinner = ({ color = "#ef4444" }) => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      border: `2px solid ${color}33`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }}
  />
);

/* ══════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════ */
const ProductCard = ({ item, selectedVariant, setSelectedVariant }) => {
  const dispatch = useDispatch();
  const [bookmarked, setBookmarked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const variantIndex = selectedVariant[item.id] ?? 0;
  const variant = item.variants[variantIndex];

  const count = useSelector((state) => state.cart.items[item.id] ?? 0);
  const cartIds = useSelector((state) => state.cart.cartIds);
  const isLoading = useSelector(
    (state) => state.cart.loadingItems[item.id] ?? false
  );

  const savings = variant.mrp - variant.price;

  // ── ADD ──────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    dispatch(setLocalCount({ product_id: item.id, quantity: 1 }));
    const res = await dispatch(
      addToCartThunk({ product_id: item.id, quantity: 1 })
    );
    if (addToCartThunk.fulfilled.match(res)) {
      toast.success(`${item.name} added to cart ✅`);
    } else {
      dispatch(setLocalCount({ product_id: item.id, quantity: 0 }));
      toast.error(res.payload || "Failed to add ❌");
    }
  };

  // ── INCREMENT ─────────────────────────────────────────────────────────────
  const handleIncrement = async () => {
    const cart_id = cartIds[item.id];
    if (!cart_id) return;
    dispatch(setLocalCount({ product_id: item.id, quantity: count + 1 }));
    const res = await dispatch(
      updateCartThunk({ cart_id, action: "increment" })
    );
    if (updateCartThunk.rejected.match(res)) {
      dispatch(setLocalCount({ product_id: item.id, quantity: count }));
      toast.error(res.payload || "Failed to update ❌");
    }
  };

  // ── DECREMENT ─────────────────────────────────────────────────────────────
  const handleDecrement = async () => {
    const cart_id = cartIds[item.id];
    if (!cart_id) return;
    const next = count - 1;
    dispatch(setLocalCount({ product_id: item.id, quantity: next }));
    if (next <= 0) {
      const res = await dispatch(removeCartThunk(cart_id));
      if (removeCartThunk.rejected.match(res)) {
        dispatch(setLocalCount({ product_id: item.id, quantity: count }));
        toast.error(res.payload || "Failed to remove ❌");
      } else {
        toast.info(`${item.name} removed from cart`);
      }
    } else {
      const res = await dispatch(
        updateCartThunk({ cart_id, action: "decrement" })
      );
      if (updateCartThunk.rejected.match(res)) {
        dispatch(setLocalCount({ product_id: item.id, quantity: count }));
        toast.error(res.payload || "Failed to update ❌");
      }
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      {/* ── Image area ── */}
      <div
        style={{
          position: "relative",
          background: "#fafafa",
          height: 190,
          overflow: "hidden",
        }}
      >
        <img
          src={item.img}
          alt={item.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Discount badge */}
        {item.discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "#16a34a",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {item.discount}% OFF
          </span>
        )}

        {/* Bookmark button */}
        <button
          onClick={() => setBookmarked((b) => !b)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            color: bookmarked ? "#f59e0b" : "#aaa",
            fontSize: 15,
            transition: "color 0.2s",
          }}
          aria-label="Bookmark"
        >
          {bookmarked ? <BsBookmarkFill /> : <CiBookmark />}
        </button>

        {/* Delivery badge */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ⚡ 10 mins
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Name */}
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111",
            margin: 0,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.name}
        </h3>

        {/* Variant selector */}
        <select
          value={variantIndex}
          onChange={(e) =>
            setSelectedVariant((prev) => ({
              ...prev,
              [item.id]: Number(e.target.value),
            }))
          }
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 12,
            color: "#555",
            background: "#fafafa",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {item.variants.map((v, i) => (
            <option key={i} value={i}>
              {v.label}
            </option>
          ))}
        </select>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>
            ₹{variant.price}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#bbb",
              textDecoration: "line-through",
            }}
          >
            ₹{variant.mrp}
          </span>
          {savings > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "#16a34a",
                fontWeight: 600,
                marginLeft: "auto",
              }}
            >
              Save ₹{savings}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Add / Qty Controls */}
        <div>
          {count === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "9px 0",
                border: "1.5px solid #ef4444",
                borderRadius: 10,
                background: isLoading ? "#fff5f5" : "#fff",
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.15s, color 0.15s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#ef4444";
                }
              }}
            >
              {isLoading ? (
                <>
                  <Spinner /> Adding...
                </>
              ) : (
                "Add to cart"
              )}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1.5px solid #ef4444",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <button
                onClick={handleDecrement}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: 20,
                  fontWeight: 400,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fff5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                −
              </button>

              <span
                style={{
                  minWidth: 36,
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? <Spinner /> : count}
              </span>

              <button
                onClick={handleIncrement}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  background: "#ef4444",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 400,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#dc2626")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#ef4444")
                }
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div
    style={{
      background: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid #f0f0f0",
    }}
  >
    <div
      style={{
        height: 190,
        background: "linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
    <div style={{ padding: "14px 16px 16px" }}>
      {[80, 100, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: `${w}%`,
            background: "#f0f0f0",
            borderRadius: 6,
            marginBottom: 10,
            animation: "shimmer 1.4s infinite",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%)",
          }}
        />
      ))}
      <div
        style={{
          height: 36,
          background: "#f0f0f0",
          borderRadius: 10,
          marginTop: 16,
          animation: "shimmer 1.4s infinite",
          backgroundSize: "200% 100%",
          backgroundImage:
            "linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%)",
        }}
      />
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   CART SECTION
══════════════════════════════════════════════ */
const CartSection = () => {
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { totalQty, totalPrice } = useSelector((state) => state.cart);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ── Load cart ─────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  // ── Fetch products ────────────────────────────────────────────────────────
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

  // ── Format products ───────────────────────────────────────────────────────
  const formattedProducts = (Array.isArray(products) ? products : []).map(
    (p) => ({
      id: p.id,
      name: p.product_name,
      discount: p.discount || 0,
      variants: [
        {
          label: `${p.quantity} ${p.unit}`,
          price: p.final_price,
          mrp: p.mrp,
        },
      ],
      img: p.image?.startsWith("http") ? p.image : `${BASE_URL}${p.image}`,
    })
  );

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f8f8f6",
          padding: "24px 16px 48px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#16a34a",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                ⚡ Delivered in 10 minutes
              </p>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#111",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                My Smart Basket
              </h2>
            </div>

            {/* Cart summary pill */}
            {/* {totalQty > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: "10px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  animation: "fadeUp 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18 }}>🛒</span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#111" }}
                  >
                    {totalQty}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {totalQty === 1 ? "item" : "items"}
                  </span>
                </div>

                <div
                  style={{
                    width: 1,
                    height: 18,
                    background: "#e5e7eb",
                  }}
                />

                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  ₹{Number(totalPrice).toFixed(2)}
                </span>
              </div>
            )} */}
          </div>

          {/* ── Error state ── */}
          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: 12,
                padding: "16px 20px",
                color: "#dc2626",
                fontSize: 14,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {error}
            </div>
          )}

          {/* ── Grid ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : formattedProducts.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      animation: `fadeUp 0.4s ease both`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    <ProductCard
                      item={item}
                      selectedVariant={selectedVariant}
                      setSelectedVariant={setSelectedVariant}
                    />
                  </div>
                ))}
          </div>

          {/* ── Empty state ── */}
          {!loading && formattedProducts.length === 0 && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "#aaa",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>
                No products found
              </p>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Check back soon — new items are added daily.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSection;