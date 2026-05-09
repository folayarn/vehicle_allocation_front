import React, { useState } from 'react';
import { Card, Typography, Progress, IconButton, Tooltip, Badge } from '@material-tailwind/react';
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
  FaEyeSlash,
  FaClipboardCheck,
  FaWrench,
  FaBook
} from 'react-icons/fa';
import { MdLocationOn, MdWarning } from 'react-icons/md';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const iconMap = {
  FaCar: FaCar,
  MdLocationOn: MdLocationOn,
  FaHistory: FaHistory,
  FaUser: FaUser,
  FaComment: FaComment,
  FaMoneyBill: FaMoneyBill,
  FaClipboardCheck: FaClipboardCheck,
  FaWrench: FaWrench,
  FaBook: FaBook,
  MdWarning: MdWarning
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    progress: 'bg-blue-500',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    progress: 'bg-green-500',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    progress: 'bg-purple-500',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800'
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-500',
    text: 'text-teal-600',
    progress: 'bg-teal-500',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    progress: 'bg-orange-500',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-500',
    text: 'text-yellow-600',
    progress: 'bg-yellow-500',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-500',
    text: 'text-indigo-600',
    progress: 'bg-indigo-500',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
    progress: 'bg-red-500',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-500',
    text: 'text-rose-600',
    progress: 'bg-rose-500',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800'
  }
};

const StatisticsCard = ({ data, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
    additionalData,
    subStats
  } = data;

  const IconComponent = iconMap[icon] || FaCar;
  const colors = colorMap[color];

  // Format total based on type
  const formattedTotal = typeof total === 'string' && total.includes('₦') 
    ? total 
    : typeof total === 'number' 
      ? total.toLocaleString() 
      : total;

  // Determine trend direction and color
  const isPositiveTrend = trend && (trend.includes('+') || trend.includes('Excellent') || trend.includes('Good'));
  const TrendIcon = isPositiveTrend ? HiTrendingUp : HiTrendingDown;
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';

  // Helper to format display values
  const formatDisplayValue = (value, title) => {
    if (title?.toLowerCase().includes('cost') || title?.toLowerCase().includes('currency')) {
      return `₦${value?.toLocaleString() || 0}`;
    }
    if (title?.toLowerCase().includes('distance') || title?.toLowerCase().includes('mileage')) {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k km`;
      }
      return `${value?.toLocaleString() || 0} km`;
    }
    return value?.toLocaleString() || 0;
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      {/* Header Section */}
      <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Typography variant="small" className="text-gray-600 font-medium mb-1">
              {mainTitle}
            </Typography>
            <Typography variant="h2" className="font-bold text-3xl">
              {formattedTotal}
            </Typography>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                <Typography variant="small" className={trendColor}>
                  {trend}
                </Typography>
              </div>
            )}
          </div>
          <div className={`${colors.icon} p-3 rounded-xl shadow-lg`}>
            <IconComponent className="text-white text-2xl" />
          </div>
        </div>
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
              {formatDisplayValue(base_one, base_oneTitle)}
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
              {formatDisplayValue(base_two, base_twoTitle)}
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

        {/* Additional Sub-stats if available */}
        {subStats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {subStats.formattedCost && (
                <div className="text-center">
                  <Typography variant="small" className="text-gray-500">
                    Total Cost
                  </Typography>
                  <Typography variant="small" className="font-semibold">
                    {subStats.formattedCost}
                  </Typography>
                </div>
              )}
              {subStats.formattedDistance && (
                <div className="text-center">
                  <Typography variant="small" className="text-gray-500">
                    Total Distance
                  </Typography>
                  <Typography variant="small" className="font-semibold">
                    {subStats.formattedDistance}
                  </Typography>
                </div>
              )}
              {subStats.resolutionRate !== undefined && (
                <div className="text-center">
                  <Typography variant="small" className="text-gray-500">
                    Resolution Rate
                  </Typography>
                  <Typography variant="small" className="font-semibold">
                    {subStats.resolutionRate}%
                  </Typography>
                </div>
              )}
              {subStats.completionRate !== undefined && (
                <div className="text-center">
                  <Typography variant="small" className="text-gray-500">
                    Completion Rate
                  </Typography>
                  <Typography variant="small" className="font-semibold">
                    {subStats.completionRate}%
                  </Typography>
                </div>
              )}
            </div>
          </div>
        )}
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
        
        {/* Quick indicators */}
        {additionalData && additionalData.length > 0 && (
          <div className="flex gap-1">
            <Badge
              color="blue"
              className="text-xs"
            >
              {additionalData.length} recent
            </Badge>
          </div>
        )}
        
        {subStats?.urgent > 0 && (
          <Badge color="red" className="text-xs">
            {subStats.urgent} Urgent
          </Badge>
        )}
        
        {subStats?.highPriority > 0 && (
          <Badge color="red" className="text-xs">
            {subStats.highPriority} High Priority
          </Badge>
        )}
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
    additionalData,
    subStats,
    icon,
    color = 'blue'
  } = data;

  const colors = colorMap[color];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className={`sticky top-0 bg-white border-b p-4 flex justify-between items-center ${colors.border}`}>
          <Typography variant="h5" className="font-bold">
            {mainTitle} Details
          </Typography>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
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
            <div className={`bg-gray-50 rounded-lg p-4 border-l-4 ${colors.border}`}>
              <div className="flex justify-between mb-2">
                <Typography className="font-medium">{base_oneTitle}</Typography>
                <Typography className="font-bold">
                  {base_one?.toLocaleString() || base_one || 0}
                </Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${colors.progress} rounded-full h-2`} 
                  style={{ width: `${base_onePercentage}%` }}
                />
              </div>
              <Typography className="text-sm text-gray-500 mt-2">
                {base_onePercentage}% of total
              </Typography>
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 border-l-4 ${colors.border}`}>
              <div className="flex justify-between mb-2">
                <Typography className="font-medium">{base_twoTitle}</Typography>
                <Typography className="font-bold">
                  {base_two?.toLocaleString() || base_two || 0}
                </Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${colors.progress} rounded-full h-2`} 
                  style={{ width: `${base_twoPercentage}%` }}
                />
              </div>
              <Typography className="text-sm text-gray-500 mt-2">
                {base_twoPercentage}% of total
              </Typography>
            </div>
          </div>

          {/* Sub Statistics Section */}
          {subStats && Object.keys(subStats).length > 0 && (
            <div>
              <Typography variant="h6" className="font-semibold mb-3">
                Additional Statistics
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {subStats.zoneBreakdown && (
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <Typography className="font-medium mb-2">Zone Distribution</Typography>
                    <div className="space-y-2">
                      {Object.entries(subStats.zoneBreakdown).map(([zone, count]) => (
                        <div key={zone} className="flex justify-between text-sm">
                          <span>Zone {zone}</span>
                          <span className="font-semibold">{count} vehicles</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {subStats.formattedCost && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm text-gray-500">Total Cost</Typography>
                    <Typography className="font-semibold text-lg">{subStats.formattedCost}</Typography>
                  </div>
                )}
                
                {subStats.formattedDistance && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm text-gray-500">Total Distance</Typography>
                    <Typography className="font-semibold text-lg">{subStats.formattedDistance}</Typography>
                  </div>
                )}
                
                {subStats.averageDistance && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm text-gray-500">Average Distance/Trip</Typography>
                    <Typography className="font-semibold text-lg">{subStats.averageDistance} km</Typography>
                  </div>
                )}
                
                {(subStats.resolutionRate !== undefined || subStats.completionRate !== undefined) && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm text-gray-500">Rate</Typography>
                    <Typography className="font-semibold text-lg">
                      {subStats.resolutionRate || subStats.completionRate}%
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Data Section */}
          {additionalData && additionalData.length > 0 && (
            <div>
              <Typography variant="h6" className="font-semibold mb-3">
                Recent Items ({additionalData.length})
              </Typography>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {additionalData.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <Typography className="text-sm">
                      {item.text || item.remarkText || item.name || item.registrationNumber}
                    </Typography>
                    {item.condition && (
                      <Badge color={item.condition === "SERVICEABLE" ? "green" : "red"} className="mt-1">
                        {item.condition}
                      </Badge>
                    )}
                    {item.createdAt && (
                      <Typography className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={onClose}
            className={`w-full ${colors.icon} text-white py-2 rounded-lg hover:opacity-90 transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact version for dashboard grid
export const CompactStatisticsCard = ({ data, onClick }) => {
  const {
    total,
    mainTitle,
    base_one,
    base_two,
    base_oneTitle,
    base_twoTitle,
    icon,
    color = 'blue',
    trend
  } = data;

  const IconComponent = iconMap[icon] || FaCar;
  const colors = colorMap[color];

  const formattedTotal = typeof total === 'number' ? total.toLocaleString() : total;

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full"
      onClick={onClick}
    >
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
      
      {trend && (
        <div className="flex items-center gap-1 mb-3">
          {trend.includes('+') ? (
            <FaArrowUp className="text-green-500 text-xs" />
          ) : (
            <FaArrowDown className="text-red-500 text-xs" />
          )}
          <Typography variant="small" className="text-gray-500 text-xs">
            {trend}
          </Typography>
        </div>
      )}
      
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

export default StatisticsCard;