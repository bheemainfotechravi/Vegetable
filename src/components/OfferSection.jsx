import React, { useRef } from "react";

const OfferSection = () => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;

      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const offers = [
    { id: 1, image: "https://www.bigbasket.com/media/customPage/c9309c26-4fb9-4233-b2b3-1d0a11af6c92/0fb80f93-5caf-4671-b5a5-0d3eea61ea5e/4ed9c062-4a1c-468e-b4f8-129add81026e/hp_dow-topoffersStorefront_m_480_250823_01.jpg?tr=w-480,q-80" },
    { id: 2, image: "https://www.bigbasket.com/media/customPage/c9309c26-4fb9-4233-b2b3-1d0a11af6c92/0fb80f93-5caf-4671-b5a5-0d3eea61ea5e/4ed9c062-4a1c-468e-b4f8-129add81026e/hp_big-packs-topoffersStorefront_m_480_250823_02.jpg?tr=w-480,q-80" },
    { id: 3, image: "https://www.bigbasket.com/media/customPage/c9309c26-4fb9-4233-b2b3-1d0a11af6c92/0fb80f93-5caf-4671-b5a5-0d3eea61ea5e/4ed9c062-4a1c-468e-b4f8-129add81026e/hp_combos-topoffersStorefront_m_480_250823_03.jpg?tr=w-480,q-80" },
    { id: 4, image: "https://www.bigbasket.com/media/customPage/c9309c26-4fb9-4233-b2b3-1d0a11af6c92/0fb80f93-5caf-4671-b5a5-0d3eea61ea5e/4ed9c062-4a1c-468e-b4f8-129add81026e/hp_30-corner-topoffersStorefront_m_480_250823_04.jpg?tr=w-480,q-80" },
  ];

  return (
    <div className="bg-white py-6 px-3 sm:px-6 md:px-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Top Offers
        </h2>

        
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
      >
        {offers.map((item) => (
          <div
            key={item.id}
            className="
              snap-start
              min-w-full
              sm:min-w-[70%]
              md:min-w-[45%]
              lg:min-w-[30%]
              xl:min-w-[23%]
            "
          >
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer">
              <img
                src={item.image}
                alt="offer"
                className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferSection;
