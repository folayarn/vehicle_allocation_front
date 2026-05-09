import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Api from "../services/api";

const useCardData = (dateRange = "yearly", selectedDate = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const dispatch = useDispatch();

  // Refetch function to manually trigger data refresh
  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Fetch data when filters change or refresh is triggered
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

        // Call the API
        const response = await getDashboardSummary(userId, startDate, endDate);
        
        // Handle the response structure: { data: [...], totalRecords: number }
        if (response.data.data && Array.isArray(response.data.data)) {
          setDashboardData(response.data.data);
        } else if (Array.isArray(response)) {
          setDashboardData(response);
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
  }, [dateRange, selectedDate, refreshKey]);

  // Calculate statistics from vehicle data
  const statisticsCardsData = useMemo(() => {
    if (!dashboardData || !Array.isArray(dashboardData) || dashboardData.length === 0) {
      return getDefaultStatistics();
    }

    const vehicles = dashboardData;
    const totalVehicles = vehicles.length;
    
    // ========== VEHICLE CONDITION STATISTICS ==========
    const serviceableVehicles = vehicles.filter(v => v.condition === "SERVICEABLE").length;
    const unserviceableVehicles = vehicles.filter(v => v.condition === "UNSERVICEABLE").length;
    
    // ========== MAINTENANCE STATUS STATISTICS ==========
    const maintenanceOk = vehicles.filter(v => v.maintenanceStatus === "OK").length;
    const maintenanceDue = vehicles.filter(v => v.maintenanceStatus === "Due").length;
    const maintenanceOverdue = vehicles.filter(v => v.maintenanceStatus === "Overdue").length;
    
    // Calculate vehicles needing maintenance soon (within 500km)
    const vehiclesNeedingMaintenanceSoon = vehicles.filter(v => {
      if (v.maintenanceDueInKm && v.currentMileage) {
        const remainingKm = v.maintenanceDueInKm - v.currentMileage;
        return remainingKm <= 500 && remainingKm > 0;
      }
      return false;
    }).length;
    
    // Calculate total mileage across all vehicles
    const totalMileage = vehicles.reduce((sum, v) => sum + (v.currentMileage || 0), 0);
    const averageMileage = totalVehicles > 0 ? totalMileage / totalVehicles : 0;
    
    // ========== ZONE STATISTICS ==========
    const zoneStats = {};
    vehicles.forEach(vehicle => {
      if (vehicle.zone) {
        zoneStats[vehicle.zone] = (zoneStats[vehicle.zone] || 0) + 1;
      }
    });
    const uniqueZones = Object.keys(zoneStats).length;
    const maxVehiclesInZone = Math.max(...Object.values(zoneStats), 0);
    const minVehiclesInZone = Math.min(...Object.values(zoneStats), 0);
    
    // ========== ALLOCATION STATISTICS ==========
    let totalAllocations = 0;
    let currentYearAllocations = 0;
    const currentYear = new Date().getFullYear();
    
    vehicles.forEach(vehicle => {
      if (vehicle.allocations && vehicle.allocations.length > 0) {
        totalAllocations += vehicle.allocations.length;
        currentYearAllocations += vehicle.allocations.filter(a => {
          if (a.yearOfAllocation) {
            return a.yearOfAllocation === currentYear;
          }
          if (a.createdAt) {
            return new Date(a.createdAt).getFullYear() === currentYear;
          }
          return false;
        }).length;
      }
    });
    
    // ========== DRIVER STATISTICS ==========
    let totalDrivers = 0;
    let driversWithContact = 0;
    let driversWithLicense = 0;
    const allDrivers = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.drivers && vehicle.drivers.length > 0) {
        totalDrivers += vehicle.drivers.length;
        allDrivers.push(...vehicle.drivers);
        
        driversWithContact += vehicle.drivers.filter(d => d.phoneNumber && d.phoneNumber.trim() !== "").length;
        driversWithLicense += vehicle.drivers.filter(d => d.licenseNumber && d.licenseNumber.trim() !== "").length;
      }
    });
    
    // Get latest 5 drivers
    const latestDrivers = allDrivers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // ========== REMARK STATISTICS ==========
    let totalRemarks = 0;
    const allRemarks = [];
    vehicles.forEach(vehicle => {
      
      // Check if vehicle has remarks array
      if (vehicle.remarks && vehicle.remarks.length > 0) {
        totalRemarks += vehicle.remarks.length;
        vehicle.remarks.forEach(remark => {
          allRemarks.push({
            text: remark.remarkText,
            createdAt: remark.createdAt
          });
        });
      }
    });
    
    // Get latest 5 remarks
    const latestRemarks = allRemarks
      .sort((a, b) => new Date(b.createdAt || b.created) - new Date(a.createdAt || a.created))
      .slice(0, 5);
    
    // ========== LOGBOOK STATISTICS ==========
    let totalLogEntries = 0;
    let totalDistanceCovered = 0;
    let approvedLogs = 0;
    let pendingLogs = 0;
    let rejectedLogs = 0;
    const allLogEntries = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.logBooks && vehicle.logBooks.length > 0) {
        totalLogEntries += vehicle.logBooks.length;
        allLogEntries.push(...vehicle.logBooks);
        
        vehicle.logBooks.forEach(log => {
          // Calculate distance covered
          if (log.mileageTotal && log.mileageTotal > 0) {
            totalDistanceCovered += parseFloat(log.mileageTotal) || 0;
          } else if (log.mileageAfter && log.mileageBefore) {
            totalDistanceCovered += (parseFloat(log.mileageAfter) - parseFloat(log.mileageBefore)) || 0;
          }
          
          // Count by status
          const status = log.status;
          if (status === "Approved") {
            approvedLogs++;
          } else if (status === "Pending" || !status) {
            pendingLogs++;
          } else if (status === "Rejected") {
            rejectedLogs++;
          }
        });
      }
    });
    
    // Calculate average distance per trip
    const averageDistancePerTrip = totalLogEntries > 0 ? totalDistanceCovered / totalLogEntries : 0;
    
    // Get latest 5 log entries
    const latestLogs = allLogEntries
      .sort((a, b) => new Date(b.created || b.createdAt) - new Date(a.created || a.createdAt))
      .slice(0, 5);
    
    // ========== MAINTENANCE REPORT STATISTICS ==========
    let totalMaintenance = 0;
    let completedMaintenance = 0;
    let pendingMaintenance = 0;
    let inProgressMaintenance = 0;
    const allMaintenance = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.maintenanceReports && vehicle.maintenanceReports.length > 0) {
        totalMaintenance += vehicle.maintenanceReports.length;
        allMaintenance.push(...vehicle.maintenanceReports);
        
        // Note: Based on your API, maintenance reports only have Body and Title
        // You may want to add more fields in the backend
      }
    });
    
    // Get latest 5 maintenance records
    const latestMaintenance = allMaintenance
      .sort((a, b) => new Date(b.created || b.date) - new Date(a.created || a.date))
      .slice(0, 5);
    
    // ========== INCIDENT REPORT STATISTICS ==========
    let totalIncidents = 0;
    const allIncidents = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.incidentReports && vehicle.incidentReports.length > 0) {
        totalIncidents += vehicle.incidentReports.length;
        allIncidents.push(...vehicle.incidentReports);
        
        // Note: Based on your API, incident reports only have Body and Title
        // You may want to add more fields (status, priority, etc.) in the backend
      }
    });
    
    // Get latest 5 incidents
    const latestIncidents = allIncidents
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
    
    // ========== HELPER FUNCTIONS ==========
    const safeDivide = (numerator, denominator) => 
      denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const formatDistance = (km) => {
      if (km >= 1000) {
        return `${(km / 1000).toFixed(1)}k km`;
      }
      return `${Math.round(km)} km`;
    };
    
    // ========== RETURN ALL STATISTICS CARDS ==========
    return [
      // Card 1: Vehicle Statistics
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
        trend: calculateVehicleTrend(serviceableVehicles, totalVehicles),
        additionalData: vehicles.slice(0, 5).map(v => ({
          registrationNumber: v.registrationNumber,
          condition: v.condition,
          zone: v.zone,
          mileage: v.currentMileage
        }))
      },
      
      // Card 2: Maintenance Status (Based on vehicle maintenanceStatus field)
      {
        id: 2,
        total: totalVehicles,
        mainTitle: "Maintenance Status",
        base_one: maintenanceOk,
        base_two: maintenanceDue + maintenanceOverdue,
        base_oneTitle: "OK",
        base_twoTitle: "Needs Attention",
        base_onePercentage: safeDivide(maintenanceOk, totalVehicles),
        base_twoPercentage: safeDivide(maintenanceDue + maintenanceOverdue, totalVehicles),
        icon: "FaClipboardCheck",
        color: "green",
        trend: vehiclesNeedingMaintenanceSoon > 0 ? `${vehiclesNeedingMaintenanceSoon} due within 500km` : "All good",
        subStats: {
          maintenanceOk,
          maintenanceDue,
          maintenanceOverdue,
          needsAttentionSoon: vehiclesNeedingMaintenanceSoon,
          totalMileage: formatDistance(totalMileage),
          averageMileage: formatDistance(averageMileage)
        }
      },
      
      // Card 3: Zone Statistics
      {
        id: 3,
        total: uniqueZones,
        mainTitle: "Zones Covered",
        base_one: maxVehiclesInZone,
        base_two: minVehiclesInZone,
        base_oneTitle: "Most Vehicles in Zone",
        base_twoTitle: "Least Vehicles in Zone",
        base_onePercentage: safeDivide(maxVehiclesInZone, totalVehicles),
        base_twoPercentage: safeDivide(minVehiclesInZone, totalVehicles),
        icon: "MdLocationOn",
        color: "purple",
        trend: formatZoneTrend(uniqueZones, maxVehiclesInZone),
        subStats: {
          zoneBreakdown: zoneStats,
          topZone: Object.keys(zoneStats).reduce((a, b) => zoneStats[a] > zoneStats[b] ? a : b, ''),
          topZoneCount: maxVehiclesInZone
        }
      },
      
      // Card 4: Allocation Statistics
      {
        id: 4,
        total: totalAllocations,
        mainTitle: "Total Allocations",
        base_one: currentYearAllocations,
        base_two: totalAllocations - currentYearAllocations,
        base_oneTitle: `${currentYear} Allocations`,
        base_twoTitle: "Previous Allocations",
        base_onePercentage: safeDivide(currentYearAllocations, totalAllocations),
        base_twoPercentage: safeDivide(totalAllocations - currentYearAllocations, totalAllocations),
        icon: "FaHistory",
        color: "orange",
        trend: totalAllocations > 0 ? `+${Math.round((currentYearAllocations / totalAllocations) * 100)}%` : "0%"
      },
      
      // Card 5: Driver Statistics
      {
        id: 5,
        total: totalDrivers,
        mainTitle: "Total Drivers",
        base_one: driversWithContact,
        base_two: driversWithLicense,
        base_oneTitle: "With Contact",
        base_twoTitle: "With License",
        base_onePercentage: safeDivide(driversWithContact, totalDrivers),
        base_twoPercentage: safeDivide(driversWithLicense, totalDrivers),
        icon: "FaUser",
        color: "teal",
        trend: totalDrivers > 0 ? `${Math.round((driversWithContact / totalDrivers) * 100)}% have contact` : "0%",
        additionalData: latestDrivers,
        subStats: {
          driversWithLicense: driversWithLicense,
          driversWithoutContact: totalDrivers - driversWithContact,
          driversWithoutLicense: totalDrivers - driversWithLicense
        }
      },
      
      // Card 6: Remarks Statistics
      {
        id: 6,
        total: totalRemarks,
        mainTitle: "Total Remarks",
        base_one: latestRemarks.length,
        base_two: totalRemarks - latestRemarks.length,
        base_oneTitle: "Recent (5)",
        base_twoTitle: "Earlier",
        base_onePercentage: safeDivide(latestRemarks.length, totalRemarks),
        base_twoPercentage: safeDivide(totalRemarks - latestRemarks.length, totalRemarks),
        icon: "FaComment",
        color: "yellow",
        trend: totalRemarks > 0 ? `Last 5 of ${totalRemarks}` : "0%",
        additionalData: latestRemarks
      },
      
      // Card 7: Logbook Statistics
      {
        id: 7,
        total: totalLogEntries,
        mainTitle: "Logbook Entries",
        base_one: Math.round(totalDistanceCovered),
        base_two: Math.round(averageDistancePerTrip),
        base_oneTitle: "Total Distance (km)",
        base_twoTitle: "Avg Distance/Trip (km)",
        base_onePercentage: 100,
        base_twoPercentage: totalLogEntries > 0 ? 100 : 0,
        icon: "FaBook",
        color: "indigo",
        trend: `${approvedLogs} Approved, ${pendingLogs} Pending`,
        additionalData: latestLogs,
        subStats: {
          totalDistance: totalDistanceCovered,
          formattedDistance: formatDistance(totalDistanceCovered),
          averageDistance: averageDistancePerTrip.toFixed(1),
          approvedLogs: approvedLogs,
          pendingLogs: pendingLogs,
          rejectedLogs: rejectedLogs,
          completionRate: safeDivide(approvedLogs, totalLogEntries)
        }
      },
      
      // Card 8: Maintenance Reports Statistics
      {
        id: 8,
        total: totalMaintenance,
        mainTitle: "Maintenance Reports",
        base_one: totalMaintenance,
        base_two: 0,
        base_oneTitle: "Total Reports",
        base_twoTitle: "Pending Review",
        base_onePercentage: 100,
        base_twoPercentage: 0,
        icon: "FaWrench",
        color: "red",
        trend: totalMaintenance > 0 ? `${totalMaintenance} reports available` : "No reports",
        additionalData: latestMaintenance,
        subStats: {
          totalReports: totalMaintenance,
          hasData: totalMaintenance > 0
        }
      },
      
      // Card 9: Incident Reports Statistics
      {
        id: 9,
        total: totalIncidents,
        mainTitle: "Incident Reports",
        base_one: totalIncidents,
        base_two: 0,
        base_oneTitle: "Total Incidents",
        base_twoTitle: "Under Investigation",
        base_onePercentage: 100,
        base_twoPercentage: 0,
        icon: "MdWarning",
        color: "rose",
        trend: totalIncidents > 0 ? `${totalIncidents} incidents reported` : "No incidents",
        additionalData: latestIncidents,
        subStats: {
          totalIncidents: totalIncidents,
          hasData: totalIncidents > 0
        }
      }
    ];
  }, [dashboardData]);

  return { 
    statisticsCardsData, 
    loading: loading || !dashboardData,
    error,
    rawData: dashboardData,
    refetch
  };
};

// Helper function to get default statistics when no data
const getDefaultStatistics = () => {
  return [
    { id: 1, total: 0, mainTitle: "Total Vehicles", base_one: 0, base_two: 0, base_oneTitle: "Serviceable", base_twoTitle: "Unserviceable", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaCar", color: "blue", trend: "0%" },
    { id: 2, total: 0, mainTitle: "Maintenance Status", base_one: 0, base_two: 0, base_oneTitle: "OK", base_twoTitle: "Needs Attention", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaClipboardCheck", color: "green", trend: "0%" },
    { id: 3, total: 0, mainTitle: "Zones Covered", base_one: 0, base_two: 0, base_oneTitle: "Most Vehicles", base_twoTitle: "Least Vehicles", base_onePercentage: 0, base_twoPercentage: 0, icon: "MdLocationOn", color: "purple", trend: "0%" },
    { id: 4, total: 0, mainTitle: "Total Allocations", base_one: 0, base_two: 0, base_oneTitle: "Current Year", base_twoTitle: "Previous", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaHistory", color: "orange", trend: "0%" },
    { id: 5, total: 0, mainTitle: "Total Drivers", base_one: 0, base_two: 0, base_oneTitle: "With Contact", base_twoTitle: "With License", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaUser", color: "teal", trend: "0%" },
    { id: 6, total: 0, mainTitle: "Total Remarks", base_one: 0, base_two: 0, base_oneTitle: "Recent", base_twoTitle: "Earlier", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaComment", color: "yellow", trend: "0%" },
    { id: 7, total: 0, mainTitle: "Logbook Entries", base_one: 0, base_two: 0, base_oneTitle: "Distance", base_twoTitle: "Avg/Trip", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaBook", color: "indigo", trend: "0%" },
    { id: 8, total: 0, mainTitle: "Maintenance Reports", base_one: 0, base_two: 0, base_oneTitle: "Total Reports", base_twoTitle: "Pending", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaWrench", color: "red", trend: "0%" },
    { id: 9, total: 0, mainTitle: "Incident Reports", base_one: 0, base_two: 0, base_oneTitle: "Total Incidents", base_twoTitle: "Open", base_onePercentage: 0, base_twoPercentage: 0, icon: "MdWarning", color: "rose", trend: "0%" }
  ];
};

// Helper functions for trends
const calculateVehicleTrend = (serviceable, total) => {
  if (total === 0) return "0%";
  const percentage = (serviceable / total) * 100;
  if (percentage >= 75) return "Excellent";
  if (percentage >= 50) return "Good";
  if (percentage >= 25) return "Fair";
  return "Poor";
};

const formatZoneTrend = (zones, maxVehicles) => {
  if (zones === 0) return "0%";
  return `${zones} zone${zones > 1 ? 's' : ''} covered`;
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