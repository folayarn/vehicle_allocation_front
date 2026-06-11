import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Api from "../services/API";

const useAssetCardData = (dateRange = "yearly", selectedDate = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const dispatch = useDispatch();

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

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
          startDate = selectedDate;
          endDate = selectedDate;
        } else if (dateRange !== "yearly") {
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

        const response = await getDashboardSummary(userId, startDate, endDate);
        
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

  const statisticsCardsData = useMemo(() => {
    if (!dashboardData || !Array.isArray(dashboardData) || dashboardData.length === 0) {
      return getDefaultStatistics();
    }

    const assets = dashboardData;
    const totalAssets = assets.length;
    
    // ========== ASSET CONDITION STATISTICS ==========
    const goodCondition = assets.filter(a => a.condition === "good").length;
    const fairCondition = assets.filter(a => a.condition === "fair").length;
    const poorCondition = assets.filter(a => a.condition === "poor").length;
    const underRenovation = assets.filter(a => a.condition === "under_renovation").length;
    const unknownCondition = assets.filter(a => a.condition === "unknown" || !a.condition).length;
    
    // ========== ASSET STATUS STATISTICS ==========
    const serviceable = assets.filter(a => a.assetStatus === "serviceable").length;
    const dilapidated = assets.filter(a => a.assetStatus === "dilapidated").length;
    const ongoing = assets.filter(a => a.assetStatus === "ongoing").length;
    const needsRenovation = assets.filter(a => a.assetStatus === "needs_renovation").length;
    const abandoned = assets.filter(a => a.assetStatus === "abandoned").length;
    const active = assets.filter(a => a.assetStatus === "active").length;
    const fairStatus = assets.filter(a => a.assetStatus === "fair").length;
    
    // ========== ASSET TYPE STATISTICS ==========
    const landAssets = assets.filter(a => a.assetType === "land").length;
    const electricalAssets = assets.filter(a => a.assetType === "electrical").length;
    const projectAssets = assets.filter(a => a.assetType === "project").length;
    
    // ========== ZONE STATISTICS ==========
    const zoneStats = {};
    assets.forEach(asset => {
      if (asset.zone) {
        zoneStats[asset.zone] = (zoneStats[asset.zone] || 0) + 1;
      }
    });
    const uniqueZones = Object.keys(zoneStats).length;
    const maxAssetsInZone = Math.max(...Object.values(zoneStats), 0);
    
    // Get top 5 zones
    const topZones = Object.entries(zoneStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([zone, count]) => ({ zone, count }));
    
    // ========== COMMAND STATISTICS ==========
    const commandStats = {};
    assets.forEach(asset => {
      if (asset.command) {
        commandStats[asset.command] = (commandStats[asset.command] || 0) + 1;
      }
    });
    const uniqueCommands = Object.keys(commandStats).length;
    const topCommand = Object.entries(commandStats)
      .sort((a, b) => b[1] - a[1])[0];
    
    // ========== BUILDING CATEGORY STATISTICS ==========
    const categoryStats = {};
    assets.forEach(asset => {
      if (asset.category && asset.category !== "-") {
        categoryStats[asset.category] = (categoryStats[asset.category] || 0) + 1;
      }
    });
    
    // ========== FINANCIAL STATISTICS ==========
    const totalConstructionCost = assets.reduce((sum, a) => sum + (a.constructionCost || 0), 0);
    const totalRenovationCost = assets.reduce((sum, a) => sum + (a.renovationCost || 0), 0);
    const totalAcquisitionCost = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
    
    // Assets with high construction cost (> 500M)
    const highValueAssets = assets.filter(a => (a.constructionCost || 0) > 500000000).length;
    
    // ========== BUILDING STATISTICS ==========
    const totalBuildings = assets.reduce((sum, a) => sum + (a.noOfBuilding || 0), 0);
    
    // Residential vs Administrative breakdown
    const residentialBuildings = assets.filter(a => 
      a.category === "Residential" || 
      a.buildingType === "Residential" ||
      a.assetName?.toLowerCase().includes("barrack") ||
      a.assetName?.toLowerCase().includes("flat") ||
      a.assetName?.toLowerCase().includes("quarters")
    ).length;
    
    const administrativeBuildings = assets.filter(a => 
      a.category === "Administrative" || 
      a.buildingType === "Administrative" ||
      a.assetName?.toLowerCase().includes("office") ||
      a.assetName?.toLowerCase().includes("block")
    ).length;
    
    // ========== RECENT ASSETS ==========
    const recentAssets = [...assets]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        name: a.assetName,
        type: a.assetType,
        command: a.command,
        zone: a.zone,
        status: a.assetStatus,
        condition: a.condition,
        createdAt: a.createdAt
      }));
    
    // ========== GENERATOR STATISTICS ==========
    const generators = assets.filter(a => 
      a.assetName?.toLowerCase().includes("generator") ||
      a.assetType === "electrical" && a.brandName
    );
    const totalGenerators = generators.length;
    const totalGeneratorCapacity = generators.reduce((sum, g) => {
      let capacity = 0;
      if (g.capacity) {
        const match = String(g.capacity).match(/(\d+(?:\.\d+)?)/);
        if (match) capacity += parseFloat(match[1]);
      }
      return sum + capacity;
    }, 0);
    
    // ========== TRANSFORMER STATISTICS ==========
    const transformers = assets.filter(a => 
      a.assetName?.toLowerCase().includes("transformer")
    );
    const totalTransformers = transformers.length;
    
    // ========== LAND STATISTICS ==========
    const landParcels = assets.filter(a => a.assetType === "land");
    const totalLandArea = landParcels.reduce((sum, l) => {
      if (l.capacity) {
        const match = String(l.capacity).match(/(\d+(?:\.\d+)?)/);
        if (match) return sum + parseFloat(match[1]);
      }
      return sum;
    }, 0);
    
    // ========== HELPER FUNCTIONS ==========
    const safeDivide = (numerator, denominator) => 
      denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
    
    const formatCurrency = (amount) => {
      if (amount >= 1000000000) {
        return `₦${(amount / 1000000000).toFixed(1)}B`;
      }
      if (amount >= 1000000) {
        return `₦${(amount / 1000000).toFixed(1)}M`;
      }
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const formatArea = (area) => {
      if (area >= 10000) {
        return `${(area / 10000).toFixed(1)} hectares`;
      }
      return `${area.toFixed(0)} sqm`;
    };
    
    // ========== RETURN ALL STATISTICS CARDS ==========
    return [
      // Card 1: Total Assets (with condition breakdown)
      {
        id: 1,
        total: totalAssets,
        mainTitle: "Total Assets",
        base_one: goodCondition,
        base_two: fairCondition + poorCondition,
        base_oneTitle: "Good Condition",
        base_twoTitle: "Needs Attention",
        base_onePercentage: safeDivide(goodCondition, totalAssets),
        base_twoPercentage: safeDivide(fairCondition + poorCondition, totalAssets),
        icon: "FaBuilding",
        color: "blue",
        trend: `${Math.round((goodCondition / totalAssets) * 100)}% in good condition`,
        additionalData: recentAssets.slice(0, 5)
      },
      
      // Card 2: Asset Status Breakdown
      {
        id: 2,
        total: totalAssets,
        mainTitle: "Asset Status",
        base_one: serviceable,
        base_two: dilapidated + needsRenovation,
        base_oneTitle: "Serviceable",
        base_twoTitle: "Needs Work",
        base_onePercentage: safeDivide(serviceable, totalAssets),
        base_twoPercentage: safeDivide(dilapidated + needsRenovation, totalAssets),
        icon: "FaClipboardList",
        color: "green",
        trend: `${ongoing} projects ongoing, ${active} active`,
        subStats: {
          serviceable,
          dilapidated,
          needsRenovation,
          ongoing,
          abandoned,
          active,
          fairStatus
        }
      },
      
      // Card 3: Asset Type Distribution
      {
        id: 3,
        total: totalAssets,
        mainTitle: "Asset Types",
        base_one: landAssets,
        base_two: electricalAssets,
        base_oneTitle: "Land Assets",
        base_twoTitle: "Electrical",
        base_onePercentage: safeDivide(landAssets, totalAssets),
        base_twoPercentage: safeDivide(electricalAssets, totalAssets),
        icon: "MdCategory",
        color: "purple",
        trend: `${projectAssets} development projects`,
        subStats: {
          land: landAssets,
          electrical: electricalAssets,
          project: projectAssets,
          buildings: totalBuildings,
          generators: totalGenerators,
          transformers: totalTransformers
        }
      },
      
      // Card 4: Zone Coverage
      {
        id: 4,
        total: uniqueZones,
        mainTitle: "Zones Covered",
        base_one: maxAssetsInZone,
        base_two: uniqueCommands,
        base_oneTitle: "Max Assets in Zone",
        base_twoTitle: "Commands",
        base_onePercentage: safeDivide(maxAssetsInZone, totalAssets),
        base_twoPercentage: 100,
        icon: "MdLocationOn",
        color: "indigo",
        trend: topCommand ? `${topCommand[0]}: ${topCommand[1]} assets` : "No data",
        additionalData: topZones,
        subStats: {
          topZones: topZones,
          totalCommands: uniqueCommands,
          zoneBreakdown: zoneStats
        }
      },
      
      // Card 5: Financial Summary
      {
        id: 5,
        total: totalConstructionCost + totalRenovationCost + totalAcquisitionCost,
        mainTitle: "Total Asset Value",
        base_one: totalConstructionCost,
        base_two: totalRenovationCost,
        base_oneTitle: "Construction Cost",
        base_twoTitle: "Renovation Cost",
        base_onePercentage: 100,
        base_twoPercentage: 100,
        icon: "FaMoneyBillWave",
        color: "orange",
        trend: `${highValueAssets} assets > ₦500M`,
        additionalData: [
          { label: "Construction", value: formatCurrency(totalConstructionCost) },
          { label: "Renovation", value: formatCurrency(totalRenovationCost) },
          { label: "Acquisition", value: formatCurrency(totalAcquisitionCost) }
        ],
        subStats: {
          totalConstructionCost: formatCurrency(totalConstructionCost),
          totalRenovationCost: formatCurrency(totalRenovationCost),
          totalAcquisitionCost: formatCurrency(totalAcquisitionCost),
          highValueAssets
        }
      },
      
      // Card 6: Building Categories
      {
        id: 6,
        total: totalBuildings,
        mainTitle: "Building Count",
        base_one: residentialBuildings,
        base_two: administrativeBuildings,
        base_oneTitle: "Residential",
        base_twoTitle: "Administrative",
        base_onePercentage: safeDivide(residentialBuildings, totalBuildings || 1),
        base_twoPercentage: safeDivide(administrativeBuildings, totalBuildings || 1),
        icon: "FaHome",
        color: "teal",
        trend: `Total ${totalBuildings} buildings`,
        additionalData: Object.entries(categoryStats).slice(0, 5).map(([cat, count]) => ({
          category: cat,
          count
        })),
        subStats: {
          totalBuildings,
          residential: residentialBuildings,
          administrative: administrativeBuildings,
          categoryBreakdown: categoryStats
        }
      },
      
      // Card 7: Electrical Infrastructure
      {
        id: 7,
        total: totalGenerators,
        mainTitle: "Generators",
        base_one: totalGenerators,
        base_two: totalTransformers,
        base_oneTitle: "Generators",
        base_twoTitle: "Transformers",
        base_onePercentage: safeDivide(totalGenerators, totalGenerators + totalTransformers || 1),
        base_twoPercentage: safeDivide(totalTransformers, totalGenerators + totalTransformers || 1),
        icon: "FaBolt",
        color: "yellow",
        trend: `${totalGeneratorCapacity.toFixed(0)} kVA total capacity`,
        subStats: {
          totalGenerators,
          totalTransformers,
          totalGeneratorCapacity: `${totalGeneratorCapacity.toFixed(0)} kVA`,
          avgGeneratorCapacity: totalGenerators > 0 ? `${(totalGeneratorCapacity / totalGenerators).toFixed(0)} kVA` : "0 kVA"
        }
      },
      
      // Card 8: Land Assets
      {
        id: 8,
        total: landAssets,
        mainTitle: "Land Parcels",
        base_one: landAssets,
        base_two: Math.round(totalLandArea),
        base_oneTitle: "Number of Parcels",
        base_twoTitle: "Total Area",
        base_onePercentage: 100,
        base_twoPercentage: 100,
        icon: "FaMapMarkerAlt",
        color: "green",
        trend: totalLandArea > 0 ? formatArea(totalLandArea) : "Area data available",
        subStats: {
          landParcels: landAssets,
          totalAreaSqm: totalLandArea,
          formattedArea: formatArea(totalLandArea),
          avgParcelSize: landAssets > 0 ? formatArea(totalLandArea / landAssets) : "N/A"
        }
      },
      
      // Card 9: Recent Activity
      {
        id: 9,
        total: recentAssets.length,
        mainTitle: "Recent Additions",
        base_one: recentAssets.filter(a => a.status === "serviceable").length,
        base_two: recentAssets.filter(a => a.status === "ongoing").length,
        base_oneTitle: "Serviceable",
        base_twoTitle: "Ongoing Projects",
        base_onePercentage: safeDivide(recentAssets.filter(a => a.status === "serviceable").length, recentAssets.length || 1),
        base_twoPercentage: safeDivide(recentAssets.filter(a => a.status === "ongoing").length, recentAssets.length || 1),
        icon: "FaClock",
        color: "rose",
        trend: `Last ${recentAssets.length} assets added`,
        additionalData: recentAssets.map(a => ({
          name: a.name?.length > 30 ? a.name.substring(0, 30) + "..." : a.name,
          status: a.status,
          condition: a.condition,
          command: a.command,
          date: new Date(a.createdAt).toLocaleDateString()
        }))
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

const getDefaultStatistics = () => {
  return [
    { id: 1, total: 0, mainTitle: "Total Assets", base_one: 0, base_two: 0, base_oneTitle: "Good", base_twoTitle: "Needs Work", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaBuilding", color: "blue", trend: "0%" },
    { id: 2, total: 0, mainTitle: "Asset Status", base_one: 0, base_two: 0, base_oneTitle: "Serviceable", base_twoTitle: "Needs Work", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaClipboardList", color: "green", trend: "0%" },
    { id: 3, total: 0, mainTitle: "Asset Types", base_one: 0, base_two: 0, base_oneTitle: "Land", base_twoTitle: "Electrical", base_onePercentage: 0, base_twoPercentage: 0, icon: "MdCategory", color: "purple", trend: "0%" },
    { id: 4, total: 0, mainTitle: "Zones Covered", base_one: 0, base_two: 0, base_oneTitle: "Max Assets", base_twoTitle: "Commands", base_onePercentage: 0, base_twoPercentage: 0, icon: "MdLocationOn", color: "indigo", trend: "0%" },
    { id: 5, total: 0, mainTitle: "Total Value", base_one: 0, base_two: 0, base_oneTitle: "Construction", base_twoTitle: "Renovation", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaMoneyBillWave", color: "orange", trend: "0%" },
    { id: 6, total: 0, mainTitle: "Buildings", base_one: 0, base_two: 0, base_oneTitle: "Residential", base_twoTitle: "Administrative", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaHome", color: "teal", trend: "0%" },
    { id: 7, total: 0, mainTitle: "Electrical", base_one: 0, base_two: 0, base_oneTitle: "Generators", base_twoTitle: "Transformers", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaBolt", color: "yellow", trend: "0%" },
    { id: 8, total: 0, mainTitle: "Land", base_one: 0, base_two: 0, base_oneTitle: "Parcels", base_twoTitle: "Area", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaMapMarkerAlt", color: "green", trend: "0%" },
    { id: 9, total: 0, mainTitle: "Recent", base_one: 0, base_two: 0, base_oneTitle: "Serviceable", base_twoTitle: "Ongoing", base_onePercentage: 0, base_twoPercentage: 0, icon: "FaClock", color: "rose", trend: "0%" }
  ];
};

export const getDashboardSummary = (userId, startDate, endDate) => {
  return Api.get(`/Assets/get-dash/${userId}`, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }
  });
};

export default useAssetCardData;