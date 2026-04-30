import React, { useState, useEffect } from "react";

const AddProductModal = ({ onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    image: "",
    name: "",
    mrp: "",
    discount: "",
    quantity: "",
  });

  // ✅ Edit Mode Fill
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Final Price Calculation (LIVE)
  const finalPrice =
    form.mrp && form.discount
      ? Math.round(form.mrp - (form.mrp * form.discount) / 100)
      : 0;

  const handleSubmit = () => {
    onSave({
      ...form,
      finalPrice, // optional (you can store or just display)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editData ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-3">

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={form.mrp}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* ✅ Final Price (Auto Calculated) */}
          <input
            type="text"
            value={`₹ ${finalPrice}`}
            readOnly
            className="w-full p-2 border rounded-md text-sm bg-gray-100 font-semibold text-indigo-600"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddProductModal;