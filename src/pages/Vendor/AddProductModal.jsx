import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductState,
} from "../../features/productSlice";
import { toast } from "react-toastify";

const AddProductModal = ({ onClose, editData }) => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.product
  );

  const [form, setForm] = useState({
    image: "",
    product_name: "",
    mrp: "",
    discount: "",
    quantity: "",
    unit: "kg",
  });

  const [preview, setPreview] = useState("");

  // Edit Data Fill
  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        unit: editData.unit || "kg",
      });

      setPreview(editData.image);
    }
  }, [editData]);

  // Cleanup Preview
  useEffect(() => {
    return () => {
      if (preview && typeof preview !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        image: file,
      });

      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  // Final Price
  const finalPrice =
    form.mrp && form.discount
      ? Math.round(
          form.mrp - (form.mrp * form.discount) / 100
        )
      : form.mrp || 0;

  // Submit
  const handleSubmit = () => {
    // Validation
    if (
      !form.product_name ||
      !form.mrp ||
      !form.quantity ||
      !form.unit
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!form.image && !editData) {
      toast.error("Please select image");
      return;
    }

    const formData = new FormData();

    // Image
    if (typeof form.image !== "string") {
      formData.append("image", form.image);
    }

    // Fields
    formData.append("product_name", form.product_name);
    formData.append("mrp", form.mrp);
    formData.append("discount", form.discount || 0);
    formData.append("quantity", form.quantity);
    formData.append("unit", form.unit);
    formData.append("final_price", finalPrice);

    dispatch(createProduct(formData));
  };

  // Success & Error
  useEffect(() => {
    if (success) {
      toast.success("Product Created Successfully");

      dispatch(resetProductState());

      onClose();
    }

    if (error) {
      toast.error(error);

      dispatch(resetProductState());
    }
  }, [success, error, dispatch, onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editData ? "Edit Product" : "Add Product"}
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
                className="w-24 h-24 object-cover rounded-md border shadow-sm"
              />
            </div>
          )}

          {/* Product Name */}
          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            value={form.product_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* MRP */}
          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={form.mrp}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Discount */}
          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={form.discount}
            onChange={handleChange}
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
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          />

          {/* Unit */}
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="kg">KG</option>
            <option value="gram">Gram</option>
          </select>

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
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            {loading ? "Uploading..." : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddProductModal;