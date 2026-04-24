import React, { useState } from "react";
import { CiBookmark } from "react-icons/ci";

const basketProducts = [
  {
    id: 1,
    name: "Banana - Robusta",
    brand: "fresho!",
    discount: 24,
    variants: [{ label: "500 g", price: 28.12, mrp: 37 }],
    img: "https://www.bbassets.com/media/uploads/p/m/10000027_32-fresho-banana-robusta.jpg"
  },
  {
    id: 2,
    name: "Capsicum - Green",
    brand: "fresho!",
    discount: 24,
    variants: [
      { label: "250 g", price: 12.78, mrp: 15.97 },
      { label: "500 g", price: 26.5, mrp: 39 },
      { label: "1 kg", price: 65.36, mrp: 86 }
    ],
    img: "https://www.bbassets.com/media/uploads/p/m/10000067_27-fresho-capsicum-green.jpg"
  },
  {
    id: 3,
    name: "Cauliflower",
    brand: "fresho!",
    discount: 54,
    variants: [{ label: "1 pc", price: 30, mrp: 65.75 }],
    img: "https://www.bbassets.com/media/uploads/p/m/10000074_21-fresho-cauliflower.jpg"
  },
  {
    id: 4,
    name: "Coriander Leaves",
    brand: "fresho!",
    discount: 24,
    variants: [{ label: "1 kg", price: 118.56, mrp: 156 }],
    img: "https://www.bbassets.com/media/uploads/p/l/10000326_17-fresho-coriander-leaves.jpg"
  }
];

const bestSellers = [
  {
    id: 101,
    name: "Sea Breeze Baby Wipes",
    brand: "bigbasket",
    discount: 57,
    variants: [{ label: "80 Pulls", price: 85, mrp: 199 }],
    img: "https://www.bbassets.com/media/uploads/p/l/40085596_7-bigbasket-baby-wipes-sea-breeze.jpg"
  },
  {
    id: 102,
    name: "Cherry Blossom Baby Wipes",
    brand: "bigbasket",
    discount: 60,
    variants: [{ label: "80 Pulls", price: 79, mrp: 199 }],
    img: "https://www.bbassets.com/media/uploads/p/l/40085598_7-bigbasket-baby-wipes-cherry.jpg"
  },
  {
    id: 103,
    name: "Soft Cleansing Baby Wipes",
    brand: "Littles",
    discount: 54,
    variants: [{ label: "80 pcs", price: 87.83, mrp: 190 }],
    img: "https://www.bbassets.com/media/uploads/p/l/40091566_10-littles-soft-cleansing.jpg"
  },
  {
    id: 104,
    name: "Fresh Baby Wipes",
    brand: "bigbasket",
    discount: 57,
    variants: [{ label: "80 Pulls", price: 85, mrp: 199 }],
    img: "https://www.bbassets.com/media/uploads/p/l/40085597_10-bigbasket-baby-wipes-fresh.jpg"
  }
];

/* ---------------- REUSABLE CARD ---------------- */

const ProductCard = ({ item, selectedVariant, setSelectedVariant }) => {
  const variantIndex = selectedVariant[item.id] || 0;
  const variant = item.variants[variantIndex];
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition relative">

      {/* Discount */}
      <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded">
        {item.discount}% OFF
      </span>

      {/* Image */}
      <img
        src={item.img}
        alt={item.name}
        className="w-full h-44 object-cover rounded-lg"
      />

      {/* Delivery */}
      <p className="text-green-700 text-xs mt-2">⚡ 10 MINS</p>

      {/* Brand */}
      <p className="text-gray-400 text-sm">{item.brand}</p>

      {/* Name */}
      <h3 className="font-medium">{item.name}</h3>

      {/* Variant Dropdown */}
      <select
        className="w-full mt-2 border rounded px-2 py-1 text-sm"
        onChange={(e) =>
          setSelectedVariant({
            ...selectedVariant,
            [item.id]: Number(e.target.value)
          })
        }
      >
        {item.variants.map((v, i) => (
          <option key={i} value={i}>
            {v.label}
          </option>
        ))}
      </select>

      {/* Price */}
      <div className="mt-2">
        <span className="font-bold">₹{variant.price}</span>
        <span className="line-through text-gray-400 ml-2 text-sm">
          ₹{variant.mrp}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <button className="border p-2 rounded hover:bg-gray-300">
          <CiBookmark />
        </button>

    
        {count === 0 ? (
          <button
            onClick={() => setCount(1)}
            className="border border-red-500 text-red-500 w-40 px-5 py-1 rounded hover:bg-red-700 hover:text-white"

          >
            Add
          </button>
        ) : (
          <div className="flex items-center border border-red-500 rounded overflow-hidden">
            <button
              onClick={() => setCount(Math.max(0, count - 1))}
              className="px-3 py-1 text-red-500 hover:bg-red-100"
            > - </button>

            <span className="px-3">{count}</span>

            <button onClick={() => setCount(count + 1)}
              className="px-3 py-1 text-red-500 hover:bg-red-100"
            >+</button>
          </div>
        )}
      </div>
    </div>
  );
};

/*  MAIN COMPONENT  */

export const CartSection = () => {
  const [selectedVariant, setSelectedVariant] = useState({});

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      {/* Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fixed top-0 left-0 z-[-1] w-full h-full opacity-10"
        viewBox="0 0 1440 810"
      >
        <path
          fill="#14b8a6"
          d="M0,192L48,208C96,224,192,256,288,250.7C384,245,480,203,576,186.7C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,0L0,0Z"
        />
      </svg>

      {/* My Smart Basket */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-6">My Smart Basket</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {basketProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Best Sellers</h2>
          <p className="text-gray-500 cursor-pointer hover:underline">
            Show More
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
