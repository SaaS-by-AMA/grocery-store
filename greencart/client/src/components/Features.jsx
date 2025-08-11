// FeaturesMarquee.jsx
import React from "react";
import { FaFire } from "react-icons/fa";

export default function Features() {
  const features = [
    { text: "Welcome to Al-Ghani Mart", color: "text-orange-500" },
    { text: "Monthly Deals & Discounts", color: "text-gray-800" },
    { text: "Wide Range of Products", color: "text-red-500" },
    { text: "Trusted Local & Global Brands", color: "text-gray-800" },
    { text: "Fast delivery", color: "text-gray-800" },
  ];

  return (
    <div className="w-full bg-[#edf8f3] py-3 overflow-hidden border-b border-gray-200">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...features, ...features].map((feature, index) => (
          <span
            key={index}
            className={`flex items-center mx-8 text-base font-medium ${feature.color}`}
          >
            <FaFire className="text-black mr-2" />
            {feature.text}
          </span>
        ))}
      </div>

      {/* Styles for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        /* Faster on small screens */
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}
