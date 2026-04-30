import React, { useState, useEffect } from "react";

import { Mail, Lock } from "lucide-react";

// ✅ Redux
import { useDispatch, useSelector } from "react-redux";
import { loginVendor, resetVendorState } from "../features/vendorSlice";

// ✅ Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Router
import { useNavigate } from "react-router-dom";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ❌ token removed
  const { loading, success, error } = useSelector(
    (state) => state.vendor
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
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

      navigate("/vendor/dashboard"); 

      dispatch(resetVendorState());
    }

    if (error) {
      toast.error(error);

      dispatch(resetVendorState());
    }
          console.log(error)
  }, [success, error, navigate, dispatch]);

  return (
    <>
    

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-2xl font-bold text-center mb-6">
            Vendor Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VendorLogin;