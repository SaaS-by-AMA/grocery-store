import React from "react";
import whatsappIcon from "../assets/wa.webp";

const WhatsAppButton = () => {
  const whatsappNumber = "923014595772";
  const message = "";

  const handleClick = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group"> {/* Added group class */}
      <div className="relative">
        
        <div
          className="absolute -inset-0 border-2 border-green-400 rounded-full animate-ping opacity-75"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute -inset-0 border-2 border-green-400 rounded-full animate-ping opacity-50"
          style={{ animationDuration: "3s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -inset-0 border-2 border-green-400 rounded-full animate-ping opacity-25"
          style={{ animationDuration: "3s", animationDelay: "2s" }}
        ></div>

        {/* WhatsApp button with tooltip */}
        <div
          className="relative w-16 h-16 cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={handleClick}
        >
          <div className="absolute inset-0 bg-[#4bca5a] rounded-full shadow-lg"></div>
          <img
            src={whatsappIcon}
            alt="Chat on WhatsApp"
            className="relative w-full h-full p-3"
          />
          
          
          <div className="absolute -top-10 right-0 bg-gray-800 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-50 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Contact on WhatsApp
            <div className="absolute bottom-0 right-3 w-2 h-2 bg-gray-800 transform rotate-45 -mb-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton;