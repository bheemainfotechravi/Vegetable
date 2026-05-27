import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// ✅ Redux
import { useDispatch, useSelector } from "react-redux";
import { loginVendor, resetVendorState } from "../../features/vendorSlice";

// ✅ Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Router
import { useNavigate } from "react-router-dom";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.vendor);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // ✅ eye toggle

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    dispatch(loginVendor(form));
  };

  // ✅ Handle Success / Error
  useEffect(() => {
    if (success) {
      toast.success("Login Successful ✅");
      dispatch(resetVendorState());
      navigate("/vendor/dashboard");
    }
    if (error) {
      toast.error(error);
      dispatch(resetVendorState());
    }
  }, [success, error, navigate, dispatch]);

  return (
    <>
      {/* ✅ Toast fixed at top-center above everything */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        style={{ zIndex: 99999, top: "16px" }}
        toastStyle={{ marginTop: "0px" }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-2xl font-bold text-center mb-6">
            Vendor Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
              <Mail size={18} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>

            {/* ✅ Password with Eye Toggle */}
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
              <Lock size={18} className="text-gray-400 mr-2 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
              {/* ✅ Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none shrink-0"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default VendorLogin;