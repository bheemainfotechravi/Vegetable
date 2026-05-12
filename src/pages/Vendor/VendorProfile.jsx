import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User, Mail, Phone, MapPin, Store,
  Camera, Save, ArrowLeft, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { vendor } = useSelector((state) => state.vendor);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    address: vendor?.address || "",
    shop_name: vendor?.shop_name || "",
  });

  const avatarLetter = vendor?.name ? vendor.name.charAt(0).toUpperCase() : "V";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // dispatch(updateVendorProfile(form)); // 🔌 plug in your update thunk
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Avatar Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center gap-3">

          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-500 text-white text-3xl font-bold flex items-center justify-center shadow-md">
              {avatarLetter}
            </div>
            {/* Camera overlay (UI only — hook to upload if needed) */}
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-indigo-50 transition">
              <Camera size={13} className="text-indigo-500" />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">
              {vendor?.name || "Vendor Name"}
            </h2>
            <p className="text-sm text-gray-400">{vendor?.email || "email@example.com"}</p>
          </div>

          {/* Verified Badge */}
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full font-medium">
            <ShieldCheck size={13} />
            Verified Vendor
          </span>
        </div>

        {/* ── Info Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-gray-700 text-base">Profile Details</h3>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium transition"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition"
                >
                  <Save size={12} />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">

            {/* Name */}
            <Field
              icon={<User size={16} className="text-indigo-400" />}
              label="Full Name"
              name="name"
              value={form.name}
              editMode={editMode}
              onChange={handleChange}
            />

            {/* Email */}
            <Field
              icon={<Mail size={16} className="text-indigo-400" />}
              label="Email Address"
              name="email"
              value={form.email}
              editMode={editMode}
              onChange={handleChange}
              type="email"
            />

            {/* Phone */}
            <Field
              icon={<Phone size={16} className="text-indigo-400" />}
              label="Phone Number"
              name="phone"
              value={form.phone}
              editMode={editMode}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            {/* Shop Name */}
            <Field
              icon={<Store size={16} className="text-indigo-400" />}
              label="Shop Name"
              name="shop_name"
              value={form.shop_name}
              editMode={editMode}
              onChange={handleChange}
              placeholder="Enter shop name"
            />

            {/* Address */}
            <Field
              icon={<MapPin size={16} className="text-indigo-400" />}
              label="Address"
              name="address"
              value={form.address}
              editMode={editMode}
              onChange={handleChange}
              placeholder="Enter address"
            />

          </div>
        </div>

        {/* ── Stats Card ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Products", value: "24" },
            { label: "Orders", value: "128" },
            { label: "Rating", value: "4.8★" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border shadow-sm p-4 text-center">
              <p className="text-xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// ── Reusable Field Component ──
const Field = ({ icon, label, name, value, editMode, onChange, type = "text", placeholder }) => (
  <div className="flex items-start gap-3">
    <div className="mt-3 shrink-0">{icon}</div>
    <div className="flex-1">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      {editMode ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition"
        />
      ) : (
        <p className="text-sm text-gray-700 py-2 border-b border-dashed border-gray-100">
          {value || <span className="text-gray-300">Not set</span>}
        </p>
      )}
    </div>
  </div>
);

export default VendorProfile;