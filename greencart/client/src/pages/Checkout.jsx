import React, { useState } from "react";

function Checkout() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    number: "",
    address: "",
    town: "",
    payment: "cod",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // success or error message

  // Validation helpers
  const validateEmail = (email) => {
    // Not included in your fields, but placeholder if you add email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (number) => /^03\d{9}$/.test(number);

  const validate = () => {
    const errors = {};

    if (!formData.firstname.trim()) errors.firstname = "First name is required";
    if (!formData.lastname.trim()) errors.lastname = "Last name is required";

    if (!formData.number.trim()) errors.number = "Phone number is required";
    else if (!validatePhoneNumber(formData.number))
      errors.number = "Phone number must start with 03 and be 11 digits";

    if (!formData.address.trim()) errors.address = "Street address is required";
    if (!formData.town.trim()) errors.town = "Town is required";

    if (!formData.payment) errors.payment = "Please select a payment method";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error message on input change
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear submit status on change
    if (submitStatus !== null) setSubmitStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // In real app: call API or process order here
      setSubmitStatus("success");
      // Optionally reset form
      setFormData({
        firstname: "",
        lastname: "",
        number: "",
        address: "",
        town: "",
        payment: "cod",
      });
    } else {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Order Summary</h1>

        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstname}
                onChange={handleChange}
                aria-invalid={!!formErrors.firstname}
                aria-describedby={formErrors.firstname ? "firstname-error" : undefined}
                className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.firstname
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-400"
                }`}
                required
              />
              {formErrors.firstname && (
                <p className="mt-1 text-sm text-red-600" id="firstname-error">
                  {formErrors.firstname}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={formData.lastname}
                onChange={handleChange}
                aria-invalid={!!formErrors.lastname}
                aria-describedby={formErrors.lastname ? "lastname-error" : undefined}
                className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.lastname
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-400"
                }`}
                required
              />
              {formErrors.lastname && (
                <p className="mt-1 text-sm text-red-600" id="lastname-error">
                  {formErrors.lastname}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              name="number"
              id="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              aria-invalid={!!formErrors.number}
              aria-describedby={formErrors.number ? "number-error" : undefined}
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.number
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-400"
              }`}
              maxLength={11}
              required
            />
            {formErrors.number && (
              <p className="mt-1 text-sm text-red-600" id="number-error">
                {formErrors.number}
              </p>
            )}
          </div>
        </div>

        {/* Address Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Address Information</h2>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              aria-invalid={!!formErrors.address}
              aria-describedby={formErrors.address ? "address-error" : undefined}
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-400"
              }`}
              placeholder="House no. Street Name"
              required
            />
            {formErrors.address && (
              <p className="mt-1 text-sm text-red-600" id="address-error">
                {formErrors.address}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-600">
              Town
            </label>
            <input
              type="text"
              name="town"
              id="town"
              value={formData.town}
              onChange={handleChange}
              aria-invalid={!!formErrors.town}
              aria-describedby={formErrors.town ? "town-error" : undefined}
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.town
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-400"
              }`}
              placeholder="City or Town"
              required
            />
            {formErrors.town && (
              <p className="mt-1 text-sm text-red-600" id="town-error">
                {formErrors.town}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Payment Method</h2>
          <select
            name="payment"
            id="payment"
            value={formData.payment}
            onChange={handleChange}
            aria-invalid={!!formErrors.payment}
            aria-describedby={formErrors.payment ? "payment-error" : undefined}
            required
            className={`w-full px-4 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 ${
              formErrors.payment
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-400"
            }`}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="jazzcash">JazzCash</option>
          </select>
          {formErrors.payment && (
            <p className="mt-1 text-sm text-red-600" id="payment-error">
              {formErrors.payment}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Place Order
          </button>
        </div>

        {/* Submission Status Message */}
        {submitStatus === "success" && (
          <p className="mt-4 text-center text-green-600 font-semibold" role="alert">
            Your order has been placed successfully!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="mt-4 text-center text-red-600 font-semibold" role="alert">
            Please fix the errors above before submitting.
          </p>
        )}
      </form>
    </div>
  );
}

export default Checkout;
