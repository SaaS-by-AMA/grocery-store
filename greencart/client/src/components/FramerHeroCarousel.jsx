import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import grocery from '../assets/grocery.webp';
import grocery2 from '../assets/grocery2.webp';
import sc from '../assets/scents.webp';

const FramerHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  
  // Touch/swipe sensitivity settings
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const slides = [
    {
      id: 1,
      bgImage: grocery,
      title: "Fresh Groceries Delivered",
      description: "Farm-fresh produce delivered to your doorstep within 30 minutes",
      cta: "Shop Now"
    },
    {
      id: 2, 
      bgImage: grocery2,
      title: "Premium Quality Products",
      description: "Hand-picked items ensuring the highest quality for your family",
      cta: "Explore Products"
    },
    {
      id: 3,
      bgImage: sc, 
      title: "Unbeatable Prices",
      description: "Best deals on all your favorite grocery items",
      cta: "View Deals"
    }
  ];

  // Auto-advance slides (pause when dragging or hovering)
  useEffect(() => {
    if (isPaused || isDragging) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentSlide, isPaused, isDragging]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  // Handle drag end for swipe gestures
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const swipe = swipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    }
  };

  // Handle touch start for mobile
  const handleTouchStart = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  // Handle touch end for mobile
  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key >= '1' && event.key <= slides.length.toString()) {
        goToSlide(parseInt(event.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, slides.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  const contentVariants = {
    enter: {
      y: 30,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div 
      className="relative w-full 
        h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen 
        overflow-hidden bg-[#e7e7e7] rounded-2xl -mt-4 touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={constraintsRef}
    >
      {/* Background Slides with Mobile-Optimized Images */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleTouchStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ x }}
          whileDrag={{ scale: 0.98 }}
        >
          {/* Mobile-optimized background image with proper sizing */}
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-300
              sm:bg-cover md:bg-cover lg:bg-cover
              bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              // Ensure image covers full area on mobile
              minHeight: '100%'
            }}
          />
          {/* Responsive gradient overlay */}
          <div className="absolute inset-0 
            bg-gradient-to-r from-black/70 via-black/40 to-black/10
            sm:bg-gradient-to-r sm:from-black/60 sm:via-black/30 sm:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content with Mobile-First Design */}
      <div className="relative z-10 h-full flex items-center justify-center sm:justify-start pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-full sm:max-w-3xl lg:max-w-4xl text-center sm:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3 sm:space-y-4 lg:space-y-6"
              >
                {/* Mobile-optimized title */}
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                    font-bold text-white leading-tight
                    px-4 sm:px-0"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {slides[currentSlide].title}
                </motion.h1>
                
                {/* Mobile-optimized description */}
                <motion.p 
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                    text-white/90 max-w-xl sm:max-w-2xl mx-auto sm:mx-0
                    px-4 sm:px-0"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {slides[currentSlide].description}
                </motion.p>
                
                {/* Mobile-optimized CTA button */}
                <motion.button
                  className="inline-flex items-center gap-2 sm:gap-3 
                    px-6 sm:px-8 py-3 sm:py-4 
                    bg-white text-gray-900 font-semibold 
                    text-sm sm:text-base lg:text-lg 
                    rounded-full hover:shadow-2xl transition-all duration-300 
                    pointer-events-auto touch-manipulation
                    min-h-[44px] min-w-[120px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slides[currentSlide].cta}
                  <motion.svg 
                    className="w-4 h-4 sm:w-5 sm:h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile-optimized Navigation Buttons */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 
          w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
          bg-white/15 backdrop-blur-md hover:bg-white/25 
          rounded-full flex items-center justify-center 
          transition-all duration-300 touch-manipulation"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 
          w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
          bg-white/15 backdrop-blur-md hover:bg-white/25 
          rounded-full flex items-center justify-center 
          transition-all duration-300 touch-manipulation"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Mobile-optimized Progress Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative w-6 h-2 sm:w-8 sm:h-2 lg:w-12 lg:h-1 
              bg-white/30 rounded-full overflow-hidden cursor-pointer touch-manipulation
              min-h-[32px] min-w-[32px] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <motion.div
              className="absolute inset-1 bg-white rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ 
                scaleX: index === currentSlide ? 1 : 0,
                transition: { duration: 0.3 }
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Mobile-optimized Slide Counter */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-3 sm:right-6 lg:right-8 z-20 text-white">
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.span 
            className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold"
            key={`current-${currentSlide}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(currentSlide + 1).padStart(2, '0')}
          </motion.span>
          <div className="w-3 sm:w-4 lg:w-6 xl:w-8 h-px bg-white/40"></div>
          <span className="text-xs sm:text-sm opacity-60">{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Mobile Swipe Indicator (auto-hide after first interaction) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isDragging ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 
          flex items-center gap-2 text-white/70 text-xs sm:text-sm
          sm:hidden" // Only show on mobile
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span>Swipe to navigate</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default FramerHeroCarousel;
