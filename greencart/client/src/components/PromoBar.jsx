import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import promoImg from '../assets/grocery.webp'; // your grocery hero image

const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  // Animation variants for different elements
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: -50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0,
      x: -30,
      y: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
        delay: 0.3
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      x: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { 
      width: 0,
      opacity: 0
    },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.6
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="w-full rounded-2xl mt-4 mb-7 bg-gradient-to-r from-[#0a2e1a] via-[#0f3f1a] to-[#1a5a2a] text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="block md:hidden px-4 py-6">
          <motion.div 
            className="text-center space-y-4"
            variants={textVariants}
          >

            

            {/* Mobile Title */}
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold leading-tight"
              variants={textVariants}
            >
              Order groceries for{' '}
              <motion.span 
                className="relative inline-block"
                variants={textVariants}
              >
                delivery
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-green-400 rounded"
                  variants={highlightVariants}
                />
              </motion.span>
              {' '}or pickup today
            </motion.h2>
            

            {/* Mobile Description */}
            <motion.p 
              className="text-base sm:text-lg text-gray-200 px-2"
              variants={textVariants}
            >
              Free delivery on orders above Rs.{' '}
              <motion.span 
                className="font-bold text-green-400 text-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(74, 222, 128, 0)",
                    "0 0 10px rgba(74, 222, 128, 0.5)",
                    "0 0 0px rgba(74, 222, 128, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                1000
              </motion.span>
              {' '}- Shop now!
            </motion.p>

            {/* Mobile Image
            <motion.div 
              className="flex justify-center my-4"
              variants={imageVariants}
              whileHover="hover"
            >
              <img
                src={promoImg}
                alt="Fresh groceries"
                className="w-80 h-40 sm:w-80 sm:h-44 rounded-2xl object-cover shadow-2xl"
              />
            </motion.div> */}

            {/* Mobile Button */}
            <motion.div className="pt-2">
              <motion.a
                href="/products"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span>Explore</motion.span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-8 lg:py-12">
          
          {/* Left Content */}
          <motion.div 
            className="flex-1 space-y-6"
            variants={textVariants}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight"
              variants={textVariants}
            >
              Order groceries for{' '}
              <motion.span 
                className="relative inline-block"
                variants={textVariants}
              >
                delivery
                <motion.div
                  className="absolute bottom-1 left-0 h-2 bg-green-400 rounded"
                  variants={highlightVariants}
                />
              </motion.span>
              <br className="hidden lg:block" />
              {' '}or pickup today
            </motion.h2>

            <motion.p 
              className="text-lg lg:text-xl text-gray-200 max-w-2xl"
              variants={textVariants}
            >
              Free delivery on orders above Rs.{' '}
              <motion.span 
                className="font-bold text-green-400 text-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(74, 222, 128, 0)",
                    "0 0 20px rgba(74, 222, 128, 0.5)",
                    "0 0 0px rgba(74, 222, 128, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                1000
              </motion.span>
              {' '} - Shop now!
            </motion.p>

            <motion.div>
              <motion.a
                href="/products"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg lg:text-xl px-8 py-4 lg:px-10 lg:py-5 rounded-full shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span>Explore now</motion.span>
                <motion.svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="flex-shrink-0 ml-8 lg:ml-12"
            variants={imageVariants}
            whileHover="hover"
          >
            <motion.img
              src={promoImg}
              alt="Fresh groceries"
              className="w-64 h-48 lg:w-80 lg:h-60 xl:w-96 xl:h-72 rounded-2xl object-cover shadow-2xl"
              whileHover={{
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
            />
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-80"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full opacity-70"
              animate={{
                y: [0, 8, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>

        {/* Bottom Disclaimer */}
        <motion.div 
          className="text-center pb-4"
          variants={textVariants}
        >
          <motion.p 
            className="text-xs sm:text-sm text-gray-300"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            *Valid for first 10 orders. Service fees and terms apply.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PromoBar;
