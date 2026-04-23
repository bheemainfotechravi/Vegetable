import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../features/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();

    const { step, loading, email, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [location] = useState("Indore");
    const [showModal, setShowModal] = useState(false);
    const [inputEmail, setInputEmail] = useState("");
    const [otp, setOtp] = useState("");

    // Send OTP
    const handleSendOtp = () => {
        if (!inputEmail) return alert("Enter email");
        dispatch(sendOtp(inputEmail));
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp) return alert("Enter OTP");

        const res = await dispatch(verifyOtp({ email, otp }));

        if (res.meta.requestStatus === "fulfilled") {
            setShowModal(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <div className="w-full shadow-md border-b bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-5 h-[90px] flex items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-bold cursor-pointer">
                            logo
                        </h1>

                        <span className="hidden sm:block text-base">
                            {location}
                        </span>
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
                            <div className="text-sm font-medium">
                                Profile
                            </div>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[700px] flex relative overflow-hidden">

                        {/* Close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-xl font-bold"
                        >
                            ✕
                        </button>

                        {/* Left Side */}
                        <div className="w-1/2 bg-gradient-to-b from-purple-700 to-pink-500 text-white p-8 flex flex-col justify-center">

                            <h1 className="text-3xl font-bold mb-4">
                                logo
                            </h1>

                            <p className="text-lg mb-6">
                                Login with OTP
                            </p>

                            {/* Input */}
                            <div className="bg-white rounded-full px-4 py-2">
                                {step === 1 ? (
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={inputEmail}
                                        onChange={(e) =>
                                            setInputEmail(e.target.value)
                                        }
                                        className="outline-none w-full text-black"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value)
                                        }
                                        className="outline-none w-full text-black"
                                    />
                                )}
                            </div>

                            {/* Button */}
                            <button
                                onClick={
                                    step === 1
                                        ? handleSendOtp
                                        : handleVerifyOtp
                                }
                                className="mt-5 bg-pink-500 py-2 rounded-full font-semibold"
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
                                    onClick={handleSendOtp}
                                    className="text-xs mt-3 underline cursor-pointer"
                                >
                                    Resend OTP
                                </p>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="w-1/2 flex flex-col items-center justify-center p-6 text-center">

                            <p className="text-lg font-semibold mb-4">
                                Fast & Secure Login
                            </p>

                            <button className="bg-black text-white px-4 py-2 rounded mb-3 w-full">
                                Google Play
                            </button>

                            <button className="bg-black text-white px-4 py-2 rounded w-full">
                                App Store
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;