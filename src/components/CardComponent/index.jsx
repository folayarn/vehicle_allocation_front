import React from 'react';
import { Card, Typography, Progress, IconButton, Tooltip } from '@material-tailwind/react';
import { 
  FaCar, 
  FaHistory, 
  FaUser, 
  FaComment, 
  FaMoneyBill,
  FaArrowUp,
  FaArrowDown,
  FaInfoCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const iconMap = {
  FaCar: FaCar,
  MdLocationOn: MdLocationOn,
  FaHistory: FaHistory,
  FaUser: FaUser,
  FaComment: FaComment,
  FaMoneyBill: FaMoneyBill
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    progress: 'bg-blue-500',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    progress: 'bg-green-500',
    border: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    progress: 'bg-purple-500',
    border: 'border-purple-200'
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-500',
    text: 'text-teal-600',
    progress: 'bg-teal-500',
    border: 'border-teal-200'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    progress: 'bg-orange-500',
    border: 'border-orange-200'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-500',
    text: 'text-yellow-600',
    progress: 'bg-yellow-500',
    border: 'border-yellow-200'
  }
};

const StatisticsCard = ({ data, onViewDetails }) => {
  const {
    total,
    mainTitle,
    base_one,
    base_two,
    base_oneTitle,
    base_twoTitle,
    base_onePercentage,
    base_twoPercentage,
    icon,
    color = 'blue',
    trend,
    formattedBaseOne,
    formattedBaseTwo,
    additionalData
  } = data;

  const IconComponent = iconMap[icon] || FaCar;
  const colors = colorMap[color];

  // Format total if it's a number with currency
  const formattedTotal = typeof total === 'string' && total.includes('₦') 
    ? total 
    : typeof total === 'number' 
      ? total.toLocaleString() 
      : total;

  // Determine trend direction and color
  const trendValue = trend ? parseInt(trend) : 0;
  const isPositiveTrend = trendValue > 0;
  const TrendIcon = isPositiveTrend ? HiTrendingUp : HiTrendingDown;
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header Section */}
      <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="small" className="text-gray-600 font-medium mb-1">
              {mainTitle}
            </Typography>
            <Typography variant="h2" className="font-bold text-3xl">
              {formattedTotal}
            </Typography>
          </div>
          <div className={`${colors.icon} p-3 rounded-xl shadow-lg`}>
            <IconComponent className="text-white text-2xl" />
          </div>
        </div>
        
        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <Typography variant="small" className={trendColor}>
              {trend} from last period
            </Typography>
          </div>
        )}
      </div>

      {/* Body Section - Two metrics */}
      <div className="p-6 space-y-4">
        {/* First Metric */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Typography variant="small" className="text-gray-600 font-medium">
              {base_oneTitle}
            </Typography>
            <Typography variant="small" className="font-semibold text-gray-800">
              {formattedBaseOne || base_one?.toLocaleString() || base_one || 0}
            </Typography>
          </div>
          <div className="relative">
            <Progress 
              value={base_onePercentage || 0} 
              size="sm"
              className="bg-gray-200"
              barClassName={colors.progress}
            />
            <Typography variant="small" className="text-gray-500 mt-1">
              {base_onePercentage}% of total
            </Typography>
          </div>
        </div>

        {/* Second Metric */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Typography variant="small" className="text-gray-600 font-medium">
              {base_twoTitle}
            </Typography>
            <Typography variant="small" className="font-semibold text-gray-800">
              {formattedBaseTwo || base_two?.toLocaleString() || base_two || 0}
            </Typography>
          </div>
          <div className="relative">
            <Progress 
              value={base_twoPercentage || 0} 
              size="sm"
              className="bg-gray-200"
              barClassName={colors.progress}
            />
            <Typography variant="small" className="text-gray-500 mt-1">
              {base_twoPercentage}% of total
            </Typography>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className={`px-6 py-3 bg-gray-50 border-t ${colors.border} flex justify-between items-center`}>
        <Tooltip content="View detailed information">
          <IconButton
            variant="text"
            size="sm"
            onClick={() => onViewDetails?.(data)}
            className={`${colors.text} hover:bg-gray-100`}
          >
            <FaInfoCircle className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        
        {/* Additional info for remarks or special data */}
        {additionalData && additionalData.length > 0 && (
          <div className="flex gap-1">
            {additionalData.slice(0, 3).map((item, idx) => (
              <Tooltip key={idx} content={item.remarkText || item.text}>
                <div className={`w-2 h-2 rounded-full ${colors.progress}`} />
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Alternative Compact Version
export const CompactStatisticsCard = ({ data }) => {
  const {
    total,
    mainTitle,
    base_one,
    base_two,
    base_oneTitle,
    base_twoTitle,
    icon,
    color = 'blue'
  } = data;

  const IconComponent = iconMap[icon] || FaCar;
  const colors = colorMap[color];

  const formattedTotal = typeof total === 'number' ? total.toLocaleString() : total;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className={`${colors.icon} p-2 rounded-lg`}>
          <IconComponent className="text-white text-lg" />
        </div>
        <Typography variant="h4" className="font-bold">
          {formattedTotal}
        </Typography>
      </div>
      
      <Typography variant="small" className="text-gray-600 mb-3">
        {mainTitle}
      </Typography>
      
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <Typography variant="small" className="text-gray-500">
            {base_oneTitle}
          </Typography>
          <Typography variant="h6" className="font-semibold">
            {base_one?.toLocaleString() || base_one || 0}
          </Typography>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <Typography variant="small" className="text-gray-500">
            {base_twoTitle}
          </Typography>
          <Typography variant="h6" className="font-semibold">
            {base_two?.toLocaleString() || base_two || 0}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

// Detailed Modal Component for viewing more information
export const StatisticsDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const {
    total,
    mainTitle,
    base_one,
    base_two,
    base_oneTitle,
    base_twoTitle,
    base_onePercentage,
    base_twoPercentage,
    additionalData
  } = data;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <Typography variant="h5" className="font-bold">
            {mainTitle} Details
          </Typography>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <Typography variant="h2" className="font-bold text-4xl">
              {typeof total === 'number' ? total.toLocaleString() : total}
            </Typography>
            <Typography variant="small" className="text-gray-500">
              Total {mainTitle}
            </Typography>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <Typography className="font-medium">{base_oneTitle}</Typography>
                <Typography className="font-bold">
                  {base_one?.toLocaleString() || base_one || 0}
                </Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2" 
                  style={{ width: `${base_onePercentage}%` }}
                />
              </div>
              <Typography className="text-sm text-gray-500 mt-2">
                {base_onePercentage}% of total
              </Typography>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <Typography className="font-medium">{base_twoTitle}</Typography>
                <Typography className="font-bold">
                  {base_two?.toLocaleString() || base_two || 0}
                </Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2" 
                  style={{ width: `${base_twoPercentage}%` }}
                />
              </div>
              <Typography className="text-sm text-gray-500 mt-2">
                {base_twoPercentage}% of total
              </Typography>
            </div>
          </div>

          {additionalData && additionalData.length > 0 && (
            <div>
              <Typography variant="h6" className="font-semibold mb-3">
                Recent Items
              </Typography>
              <div className="space-y-2">
                {additionalData.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm">{item.remarkText || item.text}</Typography>
                    <Typography className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={onClose}
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;