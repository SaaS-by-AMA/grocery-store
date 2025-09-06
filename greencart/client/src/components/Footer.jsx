
import { assets, footerLinks } from "../assets/assets";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10 text-gray-500">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30">
        
        {/* Logo & About */}
        <div className="max-w-sm">
          <img className="w-36 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6">
            We deliver fresh groceries and snacks straight to your door. 
            Trusted by thousands, we aim to make your shopping experience simple and affordable.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-primary transition">
              <FaFacebookF className="text-gray-700 hover:text-white" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-primary transition">
              <FaInstagram className="text-gray-700 hover:text-white" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-primary transition">
              <FaYoutube className="text-gray-700 hover:text-white" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[40%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="hover:text-primary transition hover:underline">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="max-w-xs space-y-3">
          <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">Contact Us</h3>
          <p className="flex items-start gap-3">
            <FaMapMarkerAlt className="mt-1 text-primary" />
            Tehsil Bazar, Fort Abbas, Punjab
          </p>
          <p className="flex items-center gap-3">
            <FaPhoneAlt className="text-primary" /> +92 340 5460286
          </p>
          <p className="flex items-center gap-3">
            <FaEnvelope className="text-primary" /> alghanimart86@gmail.com
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-6">
        <p className="text-center text-sm md:text-base text-gray-500/80 mb-4">
          Copyright {new Date().getFullYear()} © Al-Ghani Mart. All Rights Reserved.
        </p>

        <div className="bg-white/80 p-4 rounded-lg shadow-sm max-w-md mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-gray-700">
                Website Developed by
              </p>
              <p className="text-lg font-bold text-blue-600">Cloudora Tech</p>
              <p className="text-xs text-gray-500 mt-1">
                Software Development Solutions
              </p>
            </div>
            
            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
            
            <a 
              href="https://wa.me/923014595772" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full transition"
            >
              <FaWhatsapp className="text-lg text-green-600" />
              <span className="text-sm font-medium text-green-700">Contact us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;