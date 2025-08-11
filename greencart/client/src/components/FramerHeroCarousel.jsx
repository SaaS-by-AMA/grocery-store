import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Desktop images
import perfume from "../assets/perfumes.webp";
import sunglasses from "../assets/sunglasses.webp";
import farmfields from "../assets/farmfields.webp";
import facewash from "../assets/facewash.jpg";

// Mobile images
import perfume_m from "../assets/perfumes-mobile.webp";
import sunglasses_m from "../assets/sunglasses-mobile.webp";
import farmfields_m from "../assets/farmfields-mobile.webp";
import facewash_m from "../assets/facewash-mobile.jpg";

const FramerHeroCarousel = () => {
  const desktopImages = [perfume, sunglasses, farmfields, facewash];
  const mobileImages = [perfume_m, sunglasses_m, farmfields_m, facewash_m];
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Combine both image sets with their mobile counterparts
  const slides = desktopImages.map((desktopImg, index) => ({
    desktop: desktopImg,
    mobile: mobileImages[index]
  }));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mt-15 cursor-grab select-none">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={800}
        effect="slide"
        fadeEffect={{ crossFade: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          type: "bullets",
          bulletClass: "swiper-bullet",
          bulletActiveClass: "swiper-bullet-active",
        }}
        className="h-[35vh] sm:h-[60vh] lg:h-[80vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              {/* Mobile Image */}
              <img
                src={slide.mobile}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover object-center md:hidden"
                loading="lazy"
              />
              {/* Desktop Image */}
              <img
                src={slide.desktop}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover object-center hidden md:block"
                loading="lazy"
              />
              {/* Optional overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !left-4 !w-10 !h-10 sm:!w-12 sm:!h-12 !text-white !bg-black/40 hover:!bg-black/60 !backdrop-blur-sm !rounded-full !transition-all !duration-300 after:!text-sm sm:after:!text-base after:!font-bold">
          ❮
        </div>
        <div className="swiper-button-next !right-4 !w-10 !h-10 sm:!w-12 sm:!h-12 !text-white !bg-black/40 hover:!bg-black/60 !backdrop-blur-sm !rounded-full !transition-all !duration-300 after:!text-sm sm:after:!text-base after:!font-bold">
          ❯
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination !bottom-4 !left-1/2 !-translate-x-1/2 !flex !justify-center !gap-2"></div>
      </Swiper>

      {/* Custom CSS for Swiper elements */}
      <style jsx global>{`
        .swiper-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-bullet-active {
          background: white;
          width: 24px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
        }
        
        .swiper-button-prev:after, 
        .swiper-button-next:after {
          font-size: 1rem;
          font-weight: bold;
        }
        
        .swiper-button-prev:hover, 
        .swiper-button-next:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default FramerHeroCarousel;