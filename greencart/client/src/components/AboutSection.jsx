import { NavLink } from "react-router-dom";

const AboutTeaser = () => {
  return (
    <section className="py-6 mt-15 px-6 md:px-20 bg-white text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold text-gray-900 mb-4">
        Al-Ghani Mart<br />
        <span className="text-primary">Where Quality Meets Trust</span>
      </h2>
      <p className="text-gray-600 text-lg mb-8">
        Discover how we bring the fresh products and the best service right to your doorstep.  
      </p>
      <NavLink 
        to="/about" 
        className="inline-block px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary-dark transition"  onClick={() => window.scrollTo(0, 0)}
      >
        About Us
      </NavLink>
    </section>
  );
};

export default AboutTeaser;
