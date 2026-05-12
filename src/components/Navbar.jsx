import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, resendOtp, logoutUser } from "../features/authSlice";
import LoginModal from "./LoginModal";
import { Package, LogOut } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { IoWalletOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const { step, loading, email, isAuthenticated, resendLoading, user } =
    useSelector((state) => state.auth);

  // ✅ Live cart count from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const [location] = useState("Indore");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [inputEmail, setInputEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const isStep1Valid = name.trim() !== "" && inputEmail.trim() !== "";
  const isStep2Valid = otp.length === 6;

  const placeholders = [
    "Tomato 🍅", "Potato 🥔", "Onion 🧅",
    "Carrot 🥕", "Spinach 🌿", "Cabbage 🥬",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!isStep1Valid) return;
    const res = await dispatch(sendOtp({ name, email: inputEmail }));
    if (res.meta.requestStatus === "fulfilled") startTimer();
  };

  const handleVerifyOtp = async () => {
    if (!isStep2Valid) return;
    const res = await dispatch(verifyOtp({ email, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowModal(false);
      setOtp(""); setName(""); setInputEmail("");
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    const res = await dispatch(resendOtp({ email }));
    if (res.meta.requestStatus === "fulfilled") startTimer();
  };

const handleLogout = async () => {
  await dispatch(logoutUser());
  setShowDropdown(false);
  navigate("/"); 
};

  useEffect(() => {
    if (!showModal) {
      setTimer(0); setOtp(""); setName(""); setInputEmail("");
    }
  }, [showModal]);

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const firstName = user?.name ? user.name.trim().split(" ")[0] : "User";

  return (
    <>
      <div className="w-full shadow-md border-b bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white sticky top-0 z-50">

        {/* Main Navbar Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-[64px] sm:h-[72px] flex items-center justify-between gap-3">

          {/* Left: Logo + Location */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold cursor-pointer">Logo</h1>
            <span className="hidden sm:block text-xs opacity-85">{location}</span>
          </div>

          {/* Search — desktop only */}
          <div className="flex-1 mx-3 hidden md:block max-w-xl">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md gap-2">
              <Search className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                placeholder={`Search for "${placeholders[index]}"`}
                className="bg-transparent outline-none text-sm text-gray-700 w-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Search icon (mobile) + Cart + Login/Avatar */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setShowMobileSearch((v) => !v)}
              aria-label="Toggle search"
            >
              {showMobileSearch
                ? <X className="w-5 h-5" />
                : <Search className="w-5 h-5" />}
            </button>

            {/* ✅ Cart — live count from Redux */}
            <div
              className="relative flex items-center gap-1.5 cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:block text-sm">Cart</span>

              {/* Badge — only visible when cart has items */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>

            {/* Login OR Avatar */}
            {!isAuthenticated ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>

                {/* Avatar circle with initials */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label="User menu"
                >
                  {getInitials(user?.name)}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white text-black rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">

                    {/* User Info */}
                    <div className="px-5 py-4 bg-gradient-to-r from-purple-100 to-pink-100 border-b">
                      <p className="font-semibold text-base text-purple-800 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Welcome back 👋</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">

                      {/* My Profile */}
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-purple-50 transition text-base font-medium"
                      >
                        <CgProfile className="w-5 h-5 text-purple-600" />
                        My Profile
                      </button>

                      {/* My Orders */}
                      <button className="flex items-center gap-3 w-full px-5 py-3 hover:bg-purple-50 transition text-base font-medium">
                        <Package className="w-5 h-5 text-blue-600" />
                        My Orders
                      </button>

                      {/* ✅ My Cart — with live count badge */}
                      <button
                        onClick={() => navigate("/cart")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-purple-50 transition text-base font-medium"
                      >
                        <div className="relative">
                          <ShoppingCart className="w-5 h-5 text-green-600" />
                          {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-bold px-1 rounded-full leading-tight">
                              {cartCount > 99 ? "99+" : cartCount}
                            </span>
                          )}
                        </div>
                        My Cart
                        {cartCount > 0 && (
                          <span className="ml-auto text-xs text-gray-400 font-normal">
                            {cartCount} item{cartCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </button>

                      {/* My Wallet */}
                      <button className="flex items-center gap-3 w-full px-5 py-3 hover:bg-purple-50 transition text-base font-medium">
                        <IoWalletOutline className="w-5 h-5 text-orange-600" />
                        My Wallet
                      </button>

                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-50 text-red-600 text-base font-semibold transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md gap-2">
              <Search className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={`Search for "${placeholders[index]}"`}
                className="bg-transparent outline-none text-sm text-gray-700 w-full"
              />
            </div>
          </div>
        )}
      </div>

      <LoginModal
        showModal={showModal}
        setShowModal={setShowModal}
        step={step}
        loading={loading}
        resendLoading={resendLoading}
        name={name}
        setName={setName}
        inputEmail={inputEmail}
        setInputEmail={setInputEmail}
        otp={otp}
        setOtp={setOtp}
        handleSendOtp={handleSendOtp}
        handleVerifyOtp={handleVerifyOtp}
        handleResendOtp={handleResendOtp}
        isStep1Valid={isStep1Valid}
        isStep2Valid={isStep2Valid}
        timer={timer}
      />
    </>
  );
};

export default Navbar;