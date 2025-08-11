const DeliveryInfo = () => {
  return (
    <div className="bg-white py-12 px-6 md:px-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-gray-900 mb-8">
        <span className="font-medium">Delivery</span> Information
      </h1>
      
      <div className="space-y-8">
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-3">Delivery Areas</h2>
          <p className="text-gray-600">
            We currently deliver to all areas in FortAbbas. 
            Enter your address at checkout to confirm availability.
          </p>
        </div>
        
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-3">Delivery Times</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• Starting : 9AM</li>
            <li>• Till : 9PM</li>
          </ul>
        </div>
        
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-3">Fees</h2>
          <p className="text-gray-600">
            Delivery fees start at 50. Free delivery on all orders over 1000.
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-3">Tracking</h2>
          <p className="text-gray-600">
            You can track your order on website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;