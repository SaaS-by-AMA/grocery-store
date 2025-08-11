import { motion } from "framer-motion";
import img from '../assets/shelf.jpg'

const AboutUs = () => {
  return (
    <div className="bg-white py-14 px-6 md:px-16 max-w-4xl mx-auto">
      {/* Store Picture at top */}
      <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="w-full h-72 rounded-lg overflow-hidden shadow-lg mb-12"
>
  <img
    src={img}
    alt="Al-Ghani Mart Storefront"
    className="w-full h-full object-cover"
  />
</motion.div>


      {/* About Us Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
          <span className="font-medium">About Us</span> —<br />
          Quality Without Compromise
        </h2>

        <p className="text-gray-600 mb-12 text-lg">
          Since start, we've dedicated ourselves to bringing you the finest groceries with exceptional service. 
          Our carefully curated selection reflects our commitment to quality and community.
        </p>
      </motion.div>

      {/* Owner Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="border-t border-gray-200 pt-8 text-center max-w-md mx-auto text-gray-700"
      >
        <h3 className="text-xl font-semibold mb-1">Tabish Iftikhar</h3>
        <p className="mb-1">Store Owner</p>
        <p className="mb-1">📍 Tehsil Bazar, Fort Abbas, Punjab</p>
        <p>📞 <a href="tel:+923405460286" className="text-primary hover:underline">+92 340 5460286</a></p>
      </motion.div>
    </div>
  );
};

export default AboutUs;
