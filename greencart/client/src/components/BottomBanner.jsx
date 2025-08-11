import React from "react";
import { assets, features } from "../assets/assets";
import sc from "../assets/shelfs.jpg";

const BottomBanner = () => (
  <div>
    <p className='text-2xl md:text-3xl font-medium mt-15'>Features</p>
    <div className="relative mt-6">
      <img
        src={sc}
        alt="Professional banner"
        className="w-full h-[450px] object-cover hidden md:block rounded-xl shadow-lg"
      />
      <img
        src={sc}
        alt="Professional banner"
        className="w-full h-[300px] object-cover md:hidden rounded-lg shadow-md"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:rounded-xl" />

      <div className="absolute inset-0 flex flex-col items-end  md:items-end justify-center pt-2 md:pt-0 md:pr-28">
        <div className="w-3/4 md:max-w-lg px-4">
          <div className="flex flex-col gap-2 md:gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center bg-white backdrop-blur-3xl border border-white/30 rounded-xl shadow p-2 md:p-3 gap-1 md:gap-4 hover:scale-[1.025] transition-transform"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-6 h-6 md:w-11 md:h-11 object-contain -mt-1"
                />
                <div>
                  <h3 className="text-sm md:text-lg font-semibold text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BottomBanner;
