import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, resendOtp, logoutUser } from "../features/authSlice";
import LoginModal from "./LoginModal";


const Navbar = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef();

  const { step, loading, email, isAuthenticated, resendLoading, user } =
    useSelector((state) => state.auth);

  const [location] = useState("Indore");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [inputEmail, setInputEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  // Validation
  const isStep1Valid = name.trim() !== "" && inputEmail.trim() !== "";
  const isStep2Valid = otp.length === 6;



const placeholders = [
  "Tomato 🍅",
  "Potato 🥔",
  "Onion 🧅",
  "Carrot 🥕",
  "Spinach 🌿",
  "Cabbage 🥬",
];

const [index, setIndex] = useState(0);

// rotate text
useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % placeholders.length);
  }, 1500);

  return () => clearInterval(interval);
}, []);


  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Timer
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!isStep1Valid) return;

    const res = await dispatch(sendOtp({ name, email: inputEmail }));
    if (res.meta.requestStatus === "fulfilled") startTimer();
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!isStep2Valid) return;

    const res = await dispatch(verifyOtp({ email, otp }));

    if (res.meta.requestStatus === "fulfilled") {
      setShowModal(false);
      setOtp("");
      setName("");
      setInputEmail("");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    const res = await dispatch(resendOtp({ email }));
    if (res.meta.requestStatus === "fulfilled") startTimer();
  };

  // Logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowDropdown(false);
  };

  useEffect(() => {
    if (!showModal) {
      setTimer(0);
      setOtp("");
      setName("");
      setInputEmail("");
    }
  }, [showModal]);

  return (
    <>
      {/* Navbar */}
      <div className="w-full shadow-md border-b bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-[80px] flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl font-bold cursor-pointer">logo</h1>
            <span className="hidden sm:block text-sm">{location}</span>
          </div>

          {/* Search */}
          <div className="flex-1 mx-4 hidden md:block">
      <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
        <Search className="text-gray-500 w-5 h-5" />

        <input
          type="text"
          placeholder={`Search for "${placeholders[index]}"`}
          className="bg-transparent outline-none px-3 w-full text-gray-700 transition-all duration-300"
        />
      </div>
    </div>

          {/* Right */}
          <div className="flex items-center gap-4 sm:gap-6">


              {/* Cart */}
            <div className="relative flex items-center gap-2 cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden sm:block">Cart</span>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </div>

            {/* Login OR Avatar */}
            {!isAuthenticated ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold shadow"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>

                {/* Avatar */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold cursor-pointer"
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-lg overflow-hidden">

                    <div className="px-4 py-2 text-sm border-b font-medium">
                      {user?.name || "User"}
                    </div>

                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          

          </div>
        </div>
      </div>

      {/* Modal */}
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