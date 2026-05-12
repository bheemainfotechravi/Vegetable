import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../features/productSlice";
import { toast } from "react-toastify";

const EditProductModal = ({ onClose, product }) => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [form, setForm] = useState({
    product_name: "",
    mrp: "",
    discount: "",
    quantity: "",
    image: "",
  });

  const [preview, setPreview] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        product_name: product.product_name || "",
        mrp: product.mrp || "",
        discount: product.discount || "",
        quantity: product.quantity || "",
        image: product.image || "",
      });
      setPreview(product.image ? `${BASE_URL}${product.image}` : "");
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Guard — don't render if no product
  if (!product) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const finalPrice =
    form.mrp && form.discount
      ? Math.round(form.mrp - (form.mrp * form.discount) / 100)
      : form.mrp || 0;

  const handleUpdate = async () => {
    if (!form.product_name || !form.mrp || !form.quantity) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    if (form.image && typeof form.image !== "string") {
      formData.append("image", form.image);
    }

    formData.append("product_name", form.product_name);
    formData.append("mrp", Number(form.mrp));
    formData.append("discount", Number(form.discount) || 0);
    formData.append("quantity", Number(form.quantity));
    formData.append("final_price", Number(finalPrice));

    // ✅ Debug log — check what's being sent
    for (let [key, val] of formData.entries()) {
     
    }

    setUpdating(true);
    try {
      await dispatch(
        updateProduct({
          id: product.id,
          data: formData,
        })
      ).unwrap();

      toast.success("✅ Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (err) {
      toast.error(`❌ ${err || "Update failed. Please try again."}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Product
        </h2>

        <div className="space-y-3">

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Product Name */}
          <input
            type="text"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* MRP */}
          <input
            type="number"
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            placeholder="MRP"
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Discount */}
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Final Price readonly */}
          <input
            value={`₹ ${finalPrice}`}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 text-indigo-600 font-semibold"
          />

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
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
            onClick={handleUpdate}
            disabled={updating}
            className={`px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;