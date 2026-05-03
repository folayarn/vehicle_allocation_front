// import { useState, useEffect, useCallback,useMemo, memo, lazy, Suspense } from "react";
// import CardComponent from "../../../components/CardComponent";
// //import useCardData from "../../../data/card-data";
// import Skeleton from "react-loading-skeleton";

// // Lazy load heavy components
// const ChartComponent = lazy(() => import("../../../components/ChartComponent"));

// // Error Boundary Component (memoized)
// const ErrorBoundary = memo(({ children }) => {
//   const [hasError, setHasError] = useState(false);

//   useEffect(() => {
//     const handleError = (error) => {
//       if (error.error?.message?.includes('disconnected port')) {
//         console.warn('Extension port error caught by boundary');
//         setHasError(true);
//         error.preventDefault();
//         return true;
//       }
//       return false;
//     };

//     window.addEventListener('error', handleError);
//     return () => window.removeEventListener('error', handleError);
//   }, []);

//   if (hasError) {
//     return (
//       <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-red-800 mb-2">
//             Extension Conflict Detected
//           </h3>
//           <p className="text-red-600 mb-4">
//             There's an issue with browser extensions. Please try refreshing the page.
//           </p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// });

// // Memoized Date Selector Components
// const DailySelector = memo(({ value, onChange }) => (
//   <input
//     type="date"
//     className="form-input px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//     value={value}
//     onChange={onChange}
//   />
// ));

// const WeeklySelector = memo(({ value, onChange }) => {
//   const weekOptions = [...Array(52)].map((_, week) => {
//     const currentYear = new Date().getFullYear();
//     const weekValue = `${currentYear}-W${(week + 1).toString().padStart(2, '0')}`;
//     return { value: weekValue, label: `Week ${week + 1}, ${currentYear}` };
//   });

//   return (
//     <select
//       className="form-select px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//       value={value}
//       onChange={onChange}
//     >
//       {weekOptions.map(week => (
//         <option key={week.value} value={week.value}>
//           {week.label}
//         </option>
//       ))}
//     </select>
//   );
// });

// const MonthlySelector = memo(({ value, onChange }) => {
//   const monthOptions = [
//     { value: "01", label: "January" }, { value: "02", label: "February" },
//     { value: "03", label: "March" }, { value: "04", label: "April" },
//     { value: "05", label: "May" }, { value: "06", label: "June" },
//     { value: "07", label: "July" }, { value: "08", label: "August" },
//     { value: "09", label: "September" }, { value: "10", label: "October" },
//     { value: "11", label: "November" }, { value: "12", label: "December" }
//   ].map(month => {
//     const currentYear = new Date().getFullYear();
//     return {
//       value: `${currentYear}-${month.value}`,
//       label: `${month.label} ${currentYear}`
//     };
//   });

//   return (
//     <select
//       className="form-select px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//       value={value}
//       onChange={onChange}
//     >
//       {monthOptions.map(month => (
//         <option key={month.value} value={month.value}>
//           {month.label}
//         </option>
//       ))}
//     </select>
//   );
// });

// const YearlySelector = memo(({ value, onChange }) => {
//   const yearOptions = [...Array(6)].map((_, i) => {
//     const year = new Date().getFullYear() - i;
//     return { value: year.toString(), label: year.toString() };
//   });

//   return (
//     <select
//       className="form-select px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//       value={value}
//       onChange={onChange}
//     >
//       {yearOptions.map(year => (
//         <option key={year.value} value={year.value}>
//           {year.label}
//         </option>
//       ))}
//     </select>
//   );
// });

// // Helper functions moved inside component or kept as regular functions
// const getCurrentWeek = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const firstDayOfYear = new Date(year, 0, 1);
//   const pastDaysOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
//   const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
//   return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
// };

// // Main Dashboard Component
// const AdminDashboard = () => {
//   const [dateRange, setDateRange] = useState("yearly");
//   const [selectedDate, setSelectedDate] = useState({
//     daily: new Date().toISOString().split('T')[0],
//     weekly: getCurrentWeek(),
//     monthly: new Date().toISOString().slice(0, 7),
//     yearly: new Date().getFullYear().toString()
//   });
//   const [error, setError] = useState(null);

//   // Use the hook with both dateRange and selectedDate
//   const { loading, statisticsCardsData } = useCardData(dateRange, selectedDate[dateRange]);

//   // Format date function inside component
//   const formatDateForDisplay = useCallback((dateRange, selectedDate) => {
//     try {
//       const dateValue = selectedDate[dateRange];
      
//       switch (dateRange) {
//         case "daily":
//           return new Date(dateValue).toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//           });
        
//         case "weekly":
//           const [year, weekStr] = dateValue.split('-W');
//           return `Week ${parseInt(weekStr, 10)}, ${year}`;
        
//         case "monthly":
//           const [monthYear, month] = dateValue.split('-');
//           return new Date(monthYear, parseInt(month) - 1).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long'
//           });
        
//         case "yearly":
//           return `Year ${dateValue}`;
        
//         default:
//           return dateValue;
//       }
//     } catch (err) {
//       console.error('Error formatting date for display:', err);
//       return selectedDate[dateRange];
//     }
//   }, []);

//   // Memoized event handlers
//   const handleDateRangeChange = useCallback((e) => {
//     try {
//       setDateRange(e.target.value);
//       setError(null);
//     } catch (err) {
//       console.error('Error changing date range:', err);
//       setError('Failed to change date range');
//     }
//   }, []);

//   const handleDateChange = useCallback((e) => {
//     try {
//       const value = e.target.value;
//       setSelectedDate(prev => ({
//         ...prev,
//         [dateRange]: value
//       }));
//       setError(null);
//     } catch (err) {
//       console.error('Error handling date change:', err);
//       setError('Failed to update date selection');
//     }
//   }, [dateRange]);

//   // Memoized date input renderer
//   const renderDateInput = useCallback(() => {
//     try {
//       const props = {
//         value: selectedDate[dateRange],
//         onChange: handleDateChange
//       };

//       switch (dateRange) {
//         case "daily":
//           return <DailySelector {...props} />;
//         case "weekly":
//           return <WeeklySelector {...props} />;
//         case "monthly":
//           return <MonthlySelector {...props} />;
//         case "yearly":
//           return <YearlySelector {...props} />;
//         default:
//           return null;
//       }
//     } catch (err) {
//       console.error('Error rendering date input:', err);
//       return (
//         <div className="text-red-500 text-sm p-2 border border-red-200 rounded bg-red-50">
//           Error loading date selector
//         </div>
//       );
//     }
//   }, [dateRange, selectedDate, handleDateChange]);

//   // Memoized skeleton loader
//   const skeletonCards = useMemo(() => 
//     [...Array(3)].map((_, index) => (
//       <div key={index} className="h-36">
//         <Skeleton height="100%" containerClassName="h-full" />
//       </div>
//     )), []
//   );

//   if (error) {
//     return (
//       <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-red-800 mb-2">
//             Dashboard Error
//           </h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <div className="space-x-2">
//             <button 
//               onClick={() => setError(null)}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Try Again
//             </button>
//             <button 
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Reload Page
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <div className="px-4 md:px-6 lg:px-8 py-6 bg-gray-50 w-full">
//         <div className="mx-auto">
//           {/* Header and Date Range Selector */}
//           <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center mb-6 gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                 Dashboard Overview
//               </h1>
//               <p className="text-sm text-gray-600 mt-1">
//                 {formatDateForDisplay(dateRange, selectedDate)}
//               </p>
//             </div>
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-600">View:</span>
//                 <select
//                   className="form-select px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
//                   value={dateRange}
//                   onChange={handleDateRangeChange}
//                 >
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="yearly">Yearly</option>
//                 </select>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-600">Date:</span>
//                 {renderDateInput()}
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
//             {loading ? skeletonCards : (
//               statisticsCardsData.map((data, index) => (
//                 <CardComponent 
//                   key={`card-${index}-${dateRange}-${selectedDate[dateRange]}`} 
//                   {...data} 
//                   className="hover:shadow-lg transition-shadow duration-300"
//                 />
//               ))
//             )}
//           </div>

//           {/* Chart Section with Lazy Loading */}
//           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
//             <div className="mb-4 flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Performance Metrics
//               </h2>
//               <span className="text-sm text-gray-500">
//                 {formatDateForDisplay(dateRange, selectedDate)}
//               </span>
//             </div>
//             <div className="h-auto min-h-[400px]">
//               <Suspense fallback={
//                 <div className="flex items-center justify-center h-64">
//                   <div className="text-gray-500">Loading chart...</div>
//                 </div>
//               }>
//                 <ChartComponent 
//                   statisticsCardsData={statisticsCardsData} 
//                   dateRange={dateRange}
//                   selectedDate={selectedDate[dateRange]}
//                 />
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default memo(AdminDashboard);