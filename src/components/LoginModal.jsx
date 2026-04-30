import React from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LoginModal = ({
  showModal,
  setShowModal,
  step,
  loading,
  resendLoading,
  name,
  setName,
  inputEmail,
  setInputEmail,
  otp,
  setOtp,
  handleSendOtp,
  handleVerifyOtp,
  handleResendOtp,
  isStep1Valid,
  isStep2Valid,
  timer,
}) => {
  if (!showModal) return null;




  // ✅ SEND OTP
  const onSendOtp = async () => {
    try {
      await handleSendOtp();
      toast.success("OTP Sent ");
    } catch {
      toast.error("Failed to send OTP ❌");
    }
  };

  // ✅ VERIFY OTP (LOGIN SUCCESS)
  const onVerifyOtp = async () => {
    try {
      const res = await handleVerifyOtp();

      if (res?.success) {
        toast.success("Login Successful ✅");
        setShowModal(false);
      } else {
        toast.error("Invalid OTP ❌");
      }
    } catch {
      toast.error("Something went wrong ❌");
    }
  };


  return (
    <>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        transition={Slide}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
<div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-3">

  <div className="bg-white rounded-3xl w-full max-w-5xl flex flex-col md:flex-row relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

    {/* Close */}
    <button
      onClick={() => setShowModal(false)}
      className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl z-10"
    >
      ✕
    </button>

    {/* LEFT */}
    <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-800 via-pink-600 to-purple-700 text-white p-6 md:p-10 flex flex-col justify-center">

      <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-wide text-center md:text-left">
        YourLogo
      </h1>

      <p className="text-xs md:text-sm opacity-80 mb-6 md:mb-8 text-center md:text-left">
        Quick login using OTP
      </p>

      <div className="bg-white/95 backdrop-blur rounded-xl px-4 md:px-5 py-4 md:py-5 flex flex-col gap-4 shadow-lg">

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-pink-400 outline-none text-sm md:text-base"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-pink-400 outline-none text-sm md:text-base"
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
            className="border rounded-lg px-3 py-3 text-center tracking-[6px] md:tracking-[8px] text-black text-base md:text-lg focus:ring-2 focus:ring-pink-400 outline-none"
          />
        )}
      </div>

      {/* Button */}
      <button
     onClick={step === 1 ? onSendOtp : onVerifyOtp}
        disabled={
          step === 1 ? !isStep1Valid || loading : !isStep2Valid || loading
        }
        className={`mt-5 md:mt-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
          step === 1
            ? isStep1Valid
              ? "bg-white text-pink-600 hover:scale-[1.02]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            : isStep2Valid
            ? "bg-white text-pink-600 hover:scale-[1.02]"
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
          className={`text-xs mt-3 text-center font-semibold ${
            timer > 0
              ? "text-yellow-300 animate-pulse cursor-not-allowed"
              : "underline cursor-pointer hover:text-pink-200"
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
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white">

      <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 text-center">
        Fast & Secure Login
      </h2>

      <p className="text-xs md:text-sm text-gray-500 mb-5 md:mb-6 text-center max-w-xs">
        Access your account instantly with OTP verification
      </p>

      <div className="w-full space-y-4">

        {/* TEXT */}
        <div className="text-center py-2 md:py-4">
          <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Order faster & easier everytime
          </h2>

          <p className="text-gray-500 mt-1 md:mt-2 text-xs md:text-sm">
            with the App Name App
          </p>
        </div>

        {/* BUTTON */}
        <a
          href="/register/vendor"
          className="block text-center py-2.5 md:py-3 font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-xl hover:scale-[1.03] transition-all duration-300 shadow-md"
        >
          Register Vendor
        </a>
      </div>

      <div className="mt-6 md:mt-8 text-gray-400 text-[10px] md:text-xs tracking-wide text-center">
        Secure • Fast • Reliable
      </div>
    </div>
  </div>
</div>
</>
  );
};

export default LoginModal;