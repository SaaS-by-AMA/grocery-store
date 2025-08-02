import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

function Checkout() {
  const { cartItems, getCartAmount, clearCart, currency, axios } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    town: "",
    paymentMethod: "cod" // Only COD available now
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation helpers
  const validatePhoneNumber = (number) => /^03\d{9}$/.test(number);

  const validate = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhoneNumber(formData.phone))
      errors.phone = "Must start with 03 and be 11 digits";

    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.town.trim()) errors.town = "Town is required";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total amount with tax
      const subtotal = getCartAmount();
      const tax = subtotal * 0.02;
      const totalAmount = subtotal + tax;

      // Prepare order data
      const orderData = {
        items: Object.keys(cartItems).map((productId) => ({
          product: productId,
          quantity: cartItems[productId]
        })),
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          street: formData.street,
          town: formData.town,
          paymentMethod: formData.paymentMethod
        },
        amount: totalAmount,
        paymentType: formData.paymentMethod
      };

      // Send to backend
      const { data } = await axios.post('/api/order/cod', orderData);
      
      if (data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-confirmation/${data.orderId}`);
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartAmount();
  const tax = subtotal * 0.02;
  const totalAmount = subtotal + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary Section */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {Object.keys(cartItems).length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {Object.entries(cartItems).map(([productId, quantity]) => (
                    <li key={productId} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-600">{quantity} ×</span>
                        <span className="ml-2 font-medium">
                          Product {productId.substring(0, 6)}
                        </span>
                      </div>
                      <span className="font-medium">
                        {currency}{(quantity * 1000).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (2%)</span>
                <span className="font-medium">{currency}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <span>Total</span>
                <span>{currency}{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form Section */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout Details</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                      }`}
                      required
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                      }`}
                      required
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    maxLength={11}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.street ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                      }`}
                      required
                    />
                    {formErrors.street && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.street}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
                      Town/City *
                    </label>
                    <input
                      type="text"
                      id="town"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.town ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                      }`}
                      required
                    />
                    {formErrors.town && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.town}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method - Only COD now */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div className="flex items-center bg-gray-100 p-3 rounded-md">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={true}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(cartItems).length === 0}
                  className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;