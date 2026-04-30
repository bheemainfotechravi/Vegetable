import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../features/productSlice";
import { toast } from "react-toastify";

const EditProductModal = ({ onClose, product }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    image: "",
    name: "",
    mrp: "",
    discount: "",
    quantity: "",
  });

  const [preview, setPreview] = useState("");

  // ✅ Fill existing data
  useEffect(() => {
    if (product) {
      setForm(product);
      setPreview(product.image);
    }
  }, [product]);

  // ✅ Cleanup preview (memory fix)
  useEffect(() => {
    return () => {
      if (preview && typeof preview !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Final price
  const finalPrice =
    form.mrp && form.discount
      ? Math.round(form.mrp - (form.mrp * form.discount) / 100)
      : 0;

  // ✅ UPDATE API CALL
  const handleUpdate = async () => {
    if (!form.name || !form.mrp || !form.quantity) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();

    // ✅ Only send image if new file selected
    if (typeof form.image !== "string") {
      formData.append("image", form.image);
    }

    formData.append("name", form.name);
    formData.append("mrp", form.mrp);
    formData.append("discount", form.discount || 0);
    formData.append("quantity", form.quantity);
    formData.append("finalPrice", finalPrice);

    try {
      await dispatch(
        updateProduct({
          id: product._id,
          data: formData,
        })
      ).unwrap();

      toast.success("Product Updated Successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Product
        </h2>

        <div className="space-y-3">

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Preview */}
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Name */}
          <input
            type="text"
            name="name"
            value={form.name}
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

          {/* Final Price */}
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
            className="px-4 py-2 bg-green-600 text-white rounded text-sm"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;