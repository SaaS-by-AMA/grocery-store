import { FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaUniversity } from 'react-icons/fa';

const PaymentInfo = () => {
  return (
    <div className="bg-white py-12 px-6 md:px-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-gray-900 mb-8">
        <span className="font-medium">Payment</span> Options
      </h1>
      
      <div className="space-y-6">
        {/* Cash on Delivery - Available */}
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-medium text-gray-900 mb-2">Cash on Delivery</h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
              <p className="text-gray-600">
                Pay in cash when your order arrives. Please have exact change ready for the delivery driver.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Methods */}
        <div className="space-y-4 opacity-75">
          {/* Credit/Debit Cards */}
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <FaCreditCard className="text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Credit/Debit Cards</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600 mb-3">Visa, Mastercard</p>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <FaUniversity className="text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Bank Transfer</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600">
                  Direct bank transfers and online banking payments
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Wallets */}
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <FaMobileAlt className="text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">Mobile Wallets</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-gray-600">
                  Easypaisa, JazzCash, NayaPay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
