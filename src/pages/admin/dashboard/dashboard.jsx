import React, { useState, useCallback } from 'react';
import useCardData from '../../../data/card-data';
import StatisticsCard, { StatisticsDetailModal, CompactStatisticsCard } from '../../../components/CardComponent';
import { Typography, Button, Select, Option, Spinner } from '@material-tailwind/react';
import { FaSync, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'compact'
  const [dateRange, setDateRange] = useState('yearly');
  const [selectedDate, setSelectedDate] = useState(null);
  const { statisticsCardsData, loading, error, refetch } = useCardData(dateRange, selectedDate);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setSelectedDate(null); // Clear specific date when range changes
  };

  const handleTodayClick = () => {
    setDateRange('today');
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  if (loading && !statisticsCardsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
        <Typography className="ml-3">Loading dashboard data...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <Typography variant="h5" className="text-red-600 mb-2">
            Error Loading Dashboard
          </Typography>
          <Typography className="text-red-500 mb-4">
            {error}
          </Typography>
          <Button onClick={handleRefresh} color="red" className="flex items-center gap-2">
            <FaSync className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div>
            <Typography variant="h3" className="font-bold text-gray-800">
              Fleet Management Dashboard
            </Typography>
            <Typography variant="small" className="text-gray-500 mt-1">
              Real-time overview of your fleet operations
            </Typography>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2"
              variant="outlined"
              loading={isRefreshing}
            >
              <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
              variant="outlined"
              className="flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4" />
              {viewMode === 'detailed' ? 'Compact View' : 'Detailed View'}
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <Typography className="font-medium">Date Range:</Typography>
            </div>
            
            <Select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-40"
              label="Select Range"
            >
              <Option value="today">Today</Option>
              <Option value="weekly">Last 7 Days</Option>
              <Option value="monthly">Last 30 Days</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
            
            {dateRange === 'today' && (
              <Button size="sm" onClick={handleTodayClick} color="teal">
                Current Day
              </Button>
            )}
            
            <Typography variant="small" className="text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      {statisticsCardsData && statisticsCardsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {statisticsCardsData.map((card, index) => (
            viewMode === 'detailed' ? (
              <StatisticsCard 
                key={card.id || index} 
                data={card}
                onViewDetails={() => setSelectedCard(card)}
              />
            ) : (
              <CompactStatisticsCard 
                key={card.id || index} 
                data={card}
                onClick={() => setSelectedCard(card)}
              />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Typography variant="h5" className="text-gray-500">
            No data available
          </Typography>
          <Typography className="text-gray-400 mt-2">
            Try changing the date range or refreshing the data
          </Typography>
        </div>
      )}

      {/* Summary Statistics Bar */}
      {statisticsCardsData && statisticsCardsData.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <Typography variant="h6" className="mb-3 font-semibold">
            Quick Summary
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Typography className="text-gray-500 text-sm">Total Vehicles</Typography>
              <Typography className="text-2xl font-bold">
                {statisticsCardsData.find(c => c.mainTitle === "Total Vehicles")?.total || 0}
              </Typography>
            </div>
            <div className="text-center">
              <Typography className="text-gray-500 text-sm">Serviceable Rate</Typography>
              <Typography className="text-2xl font-bold text-green-600">
                {statisticsCardsData.find(c => c.mainTitle === "Total Vehicles")?.base_onePercentage || 0}%
              </Typography>
            </div>
            <div className="text-center">
              <Typography className="text-gray-500 text-sm">Active Zones</Typography>
              <Typography className="text-2xl font-bold text-blue-600">
                {statisticsCardsData.find(c => c.mainTitle === "Zones Covered")?.total || 0}
              </Typography>
            </div>
            <div className="text-center">
              <Typography className="text-gray-500 text-sm">Total Drivers</Typography>
              <Typography className="text-2xl font-bold text-purple-600">
                {statisticsCardsData.find(c => c.mainTitle === "Total Drivers")?.total || 0}
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <StatisticsDetailModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        data={selectedCard}
      />
    </div>
  );
};

// Optional: Add a DashboardSkeleton component for better loading experience
const DashboardSkeleton = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="mb-6">
      <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm h-64">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Update the useCardData hook to support refetch
// Add this to your card-data.js file:
/*
const useCardData = (dateRange = "yearly", selectedDate = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Your existing fetch logic
    fetchData();
  }, [dateRange, selectedDate, refreshKey]);

  return { 
    statisticsCardsData, 
    loading, 
    error,
    rawData: dashboardData,
    refetch // Add this to the return object
  };
};
*/

export default AdminDashboard;