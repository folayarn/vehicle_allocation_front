// import { useEffect, useMemo, useState } from "react";

// const useCardData = (dateRange = "yearly", selectedDate = null) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);

//   // Fetch data when filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const userId = sessionStorage.getItem('e');
//         if (!userId) {
//           throw new Error('User ID not found in session storage');
//         }

//         // Use the new optimized endpoint with filters
//         const response = await LoadDashboardSummary(userId, dateRange, selectedDate);
        
//         if (response.data.success && response.data.data) {
//           setDashboardData(response.data.data);
//         } else {
//           throw new Error(response.data.message || 'Failed to load dashboard data');
//         }
//       } catch (err) {
//         console.error("Failed to load dashboard data:", err);
//         setError(err.message || "Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [dateRange, selectedDate]); // Re-fetch when filters change

//   // Simple transformation of pre-aggregated data
//   const statisticsCardsData = useMemo(() => {
//     if (!dashboardData) return [];

//     const {
//       factoryProductStats,
//       productionStats,
//       stockStats,
//       rawMaterialStats,
//       productDutyStats,
//       paymentStats
//     } = dashboardData;

//     const safeDivide = (numerator, denominator) => 
//       denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

//     const totalDuty = productDutyStats.specificRateDuty + productDutyStats.advaloremDuty;

//     return [
//       {
//         total: factoryProductStats.total,
//         mainTitle: "Product Brands",
//         base_one: factoryProductStats.active,
//         base_two: factoryProductStats.inactive,
//         base_oneTitle: "Active(P)",
//         base_twoTitle: "Inactive(P)",
//         base_onePercentage: safeDivide(factoryProductStats.active, factoryProductStats.total),
//         base_twoPercentage: safeDivide(factoryProductStats.inactive, factoryProductStats.total),
//       },
//       {
//         total: productionStats.total,
//         mainTitle: "Productions",
//         base_one: productionStats.defective,
//         base_two: productionStats.finished,
//         base_oneTitle: "Defective(P)",
//         base_twoTitle: "Finished(P)",
//         base_onePercentage: safeDivide(productionStats.defective, productionStats.total),
//         base_twoPercentage: safeDivide(productionStats.finished, productionStats.total),
//       },
//       {
//         total: stockStats.total,
//         mainTitle: "Stocks",
//         base_one: stockStats.closed,
//         base_two: stockStats.open,
//         base_oneTitle: "Closed(S)",
//         base_twoTitle: "Open(S)",
//         base_onePercentage: safeDivide(stockStats.closed, stockStats.total),
//         base_twoPercentage: safeDivide(stockStats.open, stockStats.total),
//       },
//       {
//         total: rawMaterialStats.total,
//         mainTitle: "Raw Materials",
//         base_one: rawMaterialStats.available,
//         base_two: rawMaterialStats.used,
//         base_oneTitle: "Open(M)",
//         base_twoTitle: "Locked(M)",
//         base_onePercentage: safeDivide(rawMaterialStats.available, rawMaterialStats.total),
//         base_twoPercentage: safeDivide(rawMaterialStats.used, rawMaterialStats.total),
//       },
//       {
//         total: productDutyStats.totalProducts,
//         mainTitle: "Products",
//         base_one: productDutyStats.specificRateDuty,
//         base_two: productDutyStats.advaloremDuty,
//         base_oneTitle: "Specific Duty",
//         base_twoTitle: "Advalorem Duty",
//         base_onePercentage: safeDivide(productDutyStats.specificRateDuty, totalDuty),
//         base_twoPercentage: safeDivide(productDutyStats.advaloremDuty, totalDuty),
//         formattedBaseOne: `₦${productDutyStats.specificRateDuty?.toLocaleString() || '0'}`,
//         formattedBaseTwo: `₦${productDutyStats.advaloremDuty?.toLocaleString() || '0'}`,
//       },
//       {
//         total: paymentStats.totalAmount,
//         mainTitle: "Excise Duty Collected",
//         base_one: "",
//         base_two: paymentStats.totalAmount,
//         base_oneTitle: "Percentage Collected",
//         base_twoTitle: "Excise Duty To Be Paid",
//         base_onePercentage: safeDivide(paymentStats.totalAmount, totalDuty),
//         base_twoPercentage: 100,
//         formattedBaseTwo: `₦${totalDuty?.toLocaleString() || '0'}`,
//       }
//     ];
//   }, [dashboardData]);

//   return { 
//     statisticsCardsData, 
//     loading: loading || !dashboardData,
//     error
//   };
// };

// export default useCardData;