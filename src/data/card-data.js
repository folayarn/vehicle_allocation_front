import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Api from "../services/api";

const useCardData = (dateRange = "yearly", selectedDate = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const dispatch = useDispatch();

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = sessionStorage.getItem('e');
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }

        // Calculate date range based on selected filter
        let startDate = null;
        let endDate = null;
        
        if (selectedDate) {
          // If specific date is selected
          startDate = selectedDate;
          endDate = selectedDate;
        } else if (dateRange !== "yearly") {
          // Calculate based on date range
          const now = new Date();
          endDate = now.toISOString();
          
          switch(dateRange) {
            case "today":
              startDate = new Date(now.setHours(0,0,0,0)).toISOString();
              break;
            case "weekly":
              startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
              break;
            case "monthly":
              startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
              break;
            default:
              startDate = null;
          }
        }

        // Call the API - YOUR API RETURNS { data: [...] }
        const response = await getDashboardSummary(userId, startDate, endDate);
        
        // Check if response has data property (your API structure)
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setDashboardData(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          // Alternative structure if API returns array directly
          setDashboardData(response.data);
        } else {
          console.warn('Unexpected API response structure:', response);
          setDashboardData([]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        setDashboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedDate]);

  // Calculate statistics from vehicle data
  const statisticsCardsData = useMemo(() => {
    if (!dashboardData || !Array.isArray(dashboardData) || dashboardData.length === 0) {
      return getDefaultStatistics();
    }

    const vehicles = dashboardData;
    const totalVehicles = vehicles.length;
    
    // Count vehicles by condition
    const serviceableVehicles = vehicles.filter(v => v.condition === "SERVICEABLE").length;
    const unserviceableVehicles = vehicles.filter(v => v.condition === "UNSERVICEABLE").length;
    
    // Count vehicles by zone
    const zoneStats = {};
    vehicles.forEach(vehicle => {
      if (vehicle.zone) {
        zoneStats[vehicle.zone] = (zoneStats[vehicle.zone] || 0) + 1;
      }
    });
    const uniqueZones = Object.keys(zoneStats).length;
    const maxVehiclesInZone = Math.max(...Object.values(zoneStats), 0);
    const minVehiclesInZone = Math.min(...Object.values(zoneStats), 0);
    
    // Calculate allocation statistics
    let totalAllocations = 0;
    let currentYearAllocations = 0;
    const currentYear = new Date().getFullYear();
    
    vehicles.forEach(vehicle => {
      if (vehicle.allocations && vehicle.allocations.length > 0) {
        totalAllocations += vehicle.allocations.length;
        currentYearAllocations += vehicle.allocations.filter(a => a.yearOfAllocation === currentYear).length;
      }
    });
    
    // Calculate driver statistics
    let totalDrivers = 0;
    let driversWithContact = 0;
    vehicles.forEach(vehicle => {
      if (vehicle.drivers && vehicle.drivers.length > 0) {
        totalDrivers += vehicle.drivers.length;
        driversWithContact += vehicle.drivers.filter(d => d.phoneNumber).length;
      }
    });
    
    // Calculate remark statistics
    let totalRemarks = 0;
    const allRemarks = [];
    vehicles.forEach(vehicle => {
      if (vehicle.remarks && vehicle.remarks.length > 0) {
        totalRemarks += vehicle.remarks.length;
        allRemarks.push(...vehicle.remarks);
      }
    });
    
    // Get latest 5 remarks
    const latestRemarks = allRemarks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Calculate vehicle value (if you have this field, otherwise use a placeholder)
    const totalVehicleValue = vehicles.reduce((sum, vehicle) => {
      // You can add a 'value' field to your VehicleAssessment model
      return sum + (vehicle.estimatedValue || 0);
    }, 0);
    
    const averageVehicleValue = totalVehicles > 0 ? totalVehicleValue / totalVehicles : 0;

    const safeDivide = (numerator, denominator) => 
      denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

    return [
      {
        id: 1,
        total: totalVehicles,
        mainTitle: "Total Vehicles",
        base_one: serviceableVehicles,
        base_two: unserviceableVehicles,
        base_oneTitle: "Serviceable",
        base_twoTitle: "Unserviceable",
        base_onePercentage: safeDivide(serviceableVehicles, totalVehicles),
        base_twoPercentage: safeDivide(unserviceableVehicles, totalVehicles),
        icon: "FaCar",
        color: "blue",
        trend: "+12%"
      },
      {
        id: 2,
        total: uniqueZones,
        mainTitle: "Zones Covered",
        base_one: maxVehiclesInZone,
        base_two: minVehiclesInZone,
        base_oneTitle: "Most Vehicles in Zone",
        base_twoTitle: "Least Vehicles in Zone",
        base_onePercentage: safeDivide(maxVehiclesInZone, totalVehicles),
        base_twoPercentage: safeDivide(minVehiclesInZone, totalVehicles),
        icon: "MdLocationOn",
        color: "green",
        trend: "+5%"
      },
      {
        id: 3,
        total: totalAllocations,
        mainTitle: "Total Allocations",
        base_one: currentYearAllocations,
        base_two: totalAllocations - currentYearAllocations,
        base_oneTitle: `${currentYear} Allocations`,
        base_twoTitle: "Previous Allocations",
        base_onePercentage: safeDivide(currentYearAllocations, totalAllocations),
        base_twoPercentage: safeDivide(totalAllocations - currentYearAllocations, totalAllocations),
        icon: "FaHistory",
        color: "purple",
        trend: "+8%"
      },
      {
        id: 4,
        total: totalDrivers,
        mainTitle: "Total Drivers",
        base_one: driversWithContact,
        base_two: totalDrivers - driversWithContact,
        base_oneTitle: "With Contact",
        base_twoTitle: "No Contact",
        base_onePercentage: safeDivide(driversWithContact, totalDrivers),
        base_twoPercentage: safeDivide(totalDrivers - driversWithContact, totalDrivers),
        icon: "FaUser",
        color: "teal",
        trend: "+3%"
      },
      {
        id: 5,
        total: totalRemarks,
        mainTitle: "Total Remarks",
        base_one: latestRemarks.length,
        base_two: totalRemarks - latestRemarks.length,
        base_oneTitle: "Recent (5)",
        base_twoTitle: "Earlier",
        base_onePercentage: safeDivide(latestRemarks.length, totalRemarks),
        base_twoPercentage: safeDivide(totalRemarks - latestRemarks.length, totalRemarks),
        icon: "FaComment",
        color: "orange",
        trend: "+15%",
        additionalData: latestRemarks
      },
      
    ];
  }, [dashboardData]);

  return { 
    statisticsCardsData, 
    loading: loading || !dashboardData,
    error,
    rawData: dashboardData
  };
};

// Helper function to get default statistics when no data
const getDefaultStatistics = () => {
  return [
    { id: 1, total: 0, mainTitle: "Total Vehicles", base_one: 0, base_two: 0, base_oneTitle: "Serviceable", base_twoTitle: "Unserviceable", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaCar", color: "blue", trend: "0%" },
    { id: 2, total: 0, mainTitle: "Zones Covered", base_one: 0, base_two: 0, base_oneTitle: "Most Vehicles", base_twoTitle: "Least Vehicles", base_onePercentage: 0, base_twoPercentage: 0, icon: "MdLocationOn", color: "green", trend: "0%" },
    { id: 3, total: 0, mainTitle: "Total Allocations", base_one: 0, base_two: 0, base_oneTitle: "Current Year", base_twoTitle: "Previous", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaHistory", color: "purple", trend: "0%" },
    { id: 4, total: 0, mainTitle: "Total Drivers", base_one: 0, base_two: 0, base_oneTitle: "With Contact", base_twoTitle: "No Contact", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaUser", color: "teal", trend: "0%" },
    { id: 5, total: 0, mainTitle: "Total Remarks", base_one: 0, base_two: 0, base_oneTitle: "Recent", base_twoTitle: "Earlier", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaComment", color: "orange", trend: "0%" },
  ];
};

export const getDashboardSummary = (userId, startDate, endDate) => {
  return Api.get(`/VehicleAssessment/get-dash/${userId}`, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }
  });
};

export default useCardData;