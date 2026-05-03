import React from 'react';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

const CardComponent = ({
  total = 0,
  mainTitle,
  base_one = 0,
  base_two = 0,
  base_oneTitle,
  base_twoTitle,
  base_onePercentage = 0,
  base_twoPercentage = 0,
  formattedBaseOne, // Add new prop
  formattedBaseTwo  // Add new prop
}) => {
  // Determine icon and color based on percentage value
  const getPercentageDisplay = (percentage) => {
    if (percentage > 0) {
      return {
        icon: <FaArrowUp className="ml-1" />,
        color: 'text-green-500'
      };
    } else if (percentage < 0) {
      return {
        icon: <FaArrowDown className="ml-1" />,
        color: 'text-red-500'
      };
    } else {
      return {
        icon: <FaEquals className="ml-1" />,
        color: 'text-gray-500'
      };
    }
  };

  const baseOneDisplay = getPercentageDisplay(base_onePercentage);
  const baseTwoDisplay = getPercentageDisplay(base_twoPercentage);

  // Use formatted values if available, otherwise use default formatting
  const displayBaseOne = formattedBaseOne || base_one.toLocaleString();
  const displayBaseTwo = formattedBaseTwo || base_two.toLocaleString();

  return (
    <div className="shadow-lg rounded-xl bg-white p-5 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Main Title */}
      <h4 className="text-md font-semibold text-gray-600 uppercase tracking-wider mb-1">
        {mainTitle}
      </h4>
      
      {/* Total Value */}
      <div className="text-3xl font-bold text-gray-800 mb-4">
        {total.toLocaleString()}
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-100" />

      {/* First Metric */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium text-gray-500">
          {base_oneTitle}
        </div>
        <div className={`flex items-center ${baseOneDisplay.color} font-semibold`}>
          <span className="mr-2">{displayBaseOne}</span>
         {mainTitle !== "Products" && <span>({Math.abs(base_onePercentage)}%)</span>} 
        
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-100" />

      {/* Second Metric */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          {base_twoTitle}
        </div>
        <div className={`flex items-center ${baseTwoDisplay.color} font-semibold`}>
          <span className="mr-2">{displayBaseTwo}</span>
        {mainTitle !== "Products" && <span>({Math.abs(base_twoPercentage)}%)</span>}  
          
        </div>
      </div>
    </div>
  );
};

export default CardComponent;