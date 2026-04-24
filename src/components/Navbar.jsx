import React, { useState, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, resendOtp } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const { step, loading, email, isAuthenticated, resendLoading } =
    useSelector((state) => state.auth);

  const [location] = useState("Indore");
  const [showModal, setShowModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  // ✅ Validation
  const isStep1Valid = name.trim() !== "" && inputEmail.trim() !== "";
  const isStep2Valid = otp.length === 6;

  // ✅ Start Timer
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

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!isStep1Valid) return;

    const res = await dispatch(sendOtp({ name, email: inputEmail }));

    if (res.meta.requestStatus === "fulfilled") {
      startTimer(); // 🔥 timer starts after OTP sent
    }
  };

  // ✅ Verify OTP
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

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    const res = await dispatch(resendOtp({ email }));

    if (res.meta.requestStatus === "fulfilled") {
      startTimer();
    }
  };

  // ✅ Reset when modal closes
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
        <div className="max-w-7xl mx-auto px-5 h-[90px] flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold cursor-pointer">logo</h1>
            <span className="hidden sm:block text-base">{location}</span>
          </div>

          {/* Search */}
          <div className="flex-1 mx-6 hidden md:block">
            <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-md">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder='Search for "products"'
                className="bg-transparent outline-none px-3 w-full text-gray-700"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-purple-600 px-5 py-2 rounded-full text-sm font-semibold shadow"
              >
                Signup / Login
              </button>
            ) : (
              <div className="text-sm font-medium">Profile</div>
            )}

            {/* Cart */}
            <div className="relative flex items-center gap-2 cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden sm:block">Cart</span>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[800px] flex relative overflow-hidden shadow-2xl">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* LEFT */}
            <div className="w-1/2 bg-gradient-to-br from-purple-700 via-pink-500 to-purple-600 text-white p-10 flex flex-col justify-center">

              <h1 className="text-3xl font-bold mb-2">YourLogo</h1>
              <p className="text-sm opacity-90 mb-6">Quick login using OTP</p>

              {/* Inputs */}
              <div className="bg-white rounded-xl px-5 py-4 flex flex-col gap-5 shadow-md">

                {step === 1 && (
                  <>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-black"
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-black"
                    />
                  </>
                )}

                {step === 2 && (
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="border rounded-lg px-3 py-2 text-center tracking-[6px] text-black"
                  />
                )}
              </div>

              {/* Button */}
              <button
                onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
                disabled={
                  step === 1 ? !isStep1Valid || loading : !isStep2Valid || loading
                }
                className={`mt-6 py-2.5 rounded-xl font-semibold transition ${
                  step === 1
                    ? isStep1Valid
                      ? "bg-white text-pink-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isStep2Valid
                    ? "bg-white text-pink-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Please wait..."
                  : step === 1
                  ? "Send OTP"
                  : "Verify OTP"}
              </button>

              {/* Resend */}
              {step === 2 && (
                <p
                  onClick={handleResendOtp}
                  className={`text-xs mt-3 text-center ${
                    timer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "underline cursor-pointer hover:text-pink-300"
                  }`}
                >
                  {resendLoading
                    ? "Sending..."
                    : timer > 0
                    ? `Resend in ${timer}s`
                    : "Resend OTP"}
                </p>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-gray-50">
              <h2 className="text-xl font-semibold mb-2">
                Fast & Secure Login
              </h2>

              <p className="text-sm text-gray-500 mb-6 text-center">
                Access your account instantly with OTP verification
              </p>

              <div className="w-full space-y-3">
                <button className="bg-black text-white py-2.5 rounded-lg w-full">
                  Download for Android
                </button>

                <button className="bg-black text-white py-2.5 rounded-lg w-full">
                  Download for iOS
                </button>
              </div>

              <div className="mt-6 text-gray-400 text-xs">
                Secure • Fast • Reliable
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;