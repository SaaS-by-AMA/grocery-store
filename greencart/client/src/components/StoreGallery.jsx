// StoreGallery.jsx
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import booster from "../assets/booster.jpg";
import chocolate from "../assets/chocolates.jpg";
import drink from "../assets/drinks.jpg";
import shelf from "../assets/shelf.jpg";

const products = [
  { src: booster, alt: "Booster Energy Drink" },
  { src: chocolate, alt: "Chocolates" },
  { src: drink, alt: "Refreshing Drinks" },
  { src: shelf, alt: "Packed Shelves" },
  { src: chocolate, alt: "Sweet Treats" },
  { src: drink, alt: "Cool Beverages" },
];

export default function StoreGallery() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-14 mt-20 rounded-2xl" style={{ backgroundColor: "#edf8f3" }}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Featured Products
        </h2>

        {/* Scroll buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transition z-10"
        >
          <FaChevronLeft className="text-gray-700 dark:text-white" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transition z-10"
        >
          <FaChevronRight className="text-gray-700 dark:text-white" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth custom-scrollbar pb-4"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 h-72 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
            >
              <img
                src={product.src}
                alt={product.alt}
                className="w-full h-3/4 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4 text-center">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  {product.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #d9f1ea;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2f855a;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #276749;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4ade80;
        }
      `}</style>
    </section>
  );
}
