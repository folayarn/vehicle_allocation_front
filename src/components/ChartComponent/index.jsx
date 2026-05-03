import React, { useState } from 'react';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const ChartComponent = ({ statisticsCardsData }) => {
  const [activeView, setActiveView] = useState('overview');
  
  // Separate Products data from other metrics
  const productsData = statisticsCardsData.find(item => item.mainTitle === "Products" );
  const otherMetricsData = statisticsCardsData.filter(item => item.mainTitle !== "Products" && item.mainTitle !== "Excise Duty Collected");
  
  // If no data is available
  if (statisticsCardsData.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center" style={{ height: '450px' }}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // View selector component
  const ViewSelector = () => (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            activeView === 'overview' 
              ? 'bg-teal-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            activeView === 'comparison' 
              ? 'bg-teal-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border-t border-b'
          }`}
          onClick={() => setActiveView('comparison')}
        >
          Comparison
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            activeView === 'composition' 
              ? 'bg-teal-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
          onClick={() => setActiveView('composition')}
        >
          Composition
        </button>
      </div>
    </div>
  );

  // 1. PRODUCTS DUTY CHART - Doughnut Chart
  const productsDoughnutData = {
    labels: ['Specific Rate Duty', 'Advalorem Duty'],
    datasets: [
      {
        data: [productsData?.base_one, productsData?.base_two],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)', // Green
          'rgba(99, 102, 241, 0.8)', // Indigo
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(99, 102, 241, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(79, 70, 229, 1)',
        ],
      },
    ],
  };

  const productsDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: `Products Duty Distribution`,
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const totalDuty = productsData.base_one + productsData.base_two;
            const percentage = Math.round((value / totalDuty) * 100);
            return `${context.label}: ₦${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  // 2. OVERVIEW VIEW - Polar Area Chart for other metrics
  const polarData = {
    labels: otherMetricsData.map(item => item.mainTitle),
    datasets: [
      {
        data: otherMetricsData.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Total Items by Category',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      r: {
        ticks: {
          display: false
        }
      }
    }
  };

  // 3. COMPARISON VIEW - Grouped Bar Chart for other metrics
  const barData = {
    labels: otherMetricsData.map(item => item.mainTitle),
    datasets: [
      {
        label: 'Metric 1',
        data: otherMetricsData.map(item => item.base_one),
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
      },
      {
        label: 'Metric 2',
        data: otherMetricsData.map(item => item.base_two),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparison of Metrics Across Categories',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            const item = otherMetricsData[context.dataIndex];
            
            let metricLabel = '';
            if (datasetLabel === 'Metric 1') {
              switch(item.mainTitle) {
                case "Factory Products": metricLabel = "Active"; break;
                case "Productions": metricLabel = "Defective"; break;
                case "Stocks": metricLabel = "Closed"; break;
                case "Raw Materials": metricLabel = "Available"; break;
              }
            } else {
              switch(item.mainTitle) {
                case "Factory Products": metricLabel = "Inactive"; break;
                case "Productions": metricLabel = "Finished"; break;
                case "Stocks": metricLabel = "Open"; break;
                case "Raw Materials": metricLabel = "Used"; break;
              }
            }
            
            return `${metricLabel}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    }
  };

  // 4. COMPOSITION VIEW - Doughnut Charts Grid for other metrics
  const doughnutCharts = otherMetricsData.map((item, index) => {
    const colors = [
      ['rgba(52, 211, 153, 0.8)', 'rgba(99, 102, 241, 0.8)'],
      ['rgba(255, 159, 64, 0.8)', 'rgba(153, 102, 255, 0.8)'],
      ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
      ['rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
    ];
    
    const data = {
      labels: ['Metric 1', 'Metric 2'],
      datasets: [
        {
          data: [item.base_one, item.base_two],
          backgroundColor: colors[index],
          borderColor: colors[index]?.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: item.mainTitle,
          font: { size: 14 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              const percentage = Math.round((value / item.total) * 100);
              let label = '';
              
              switch(item.mainTitle) {
                case "Factory Products": 
                  label = context.dataIndex === 0 ? "Active" : "Inactive";
                  break;
                case "Productions": 
                  label = context.dataIndex === 0 ? "Defective" : "Finished";
                  break;
                case "Stocks": 
                  label = context.dataIndex === 0 ? "Closed" : "Open";
                  break;
                case "Raw Materials": 
                  label = context.dataIndex === 0 ? "Available" : "Used";
                  break;
              }
              
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      },
    };
    
    return { data, options };
  });

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Performance Metrics
        </h2>
      </div>
      
      {/* Products Duty Chart - Always visible */}
      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Products Duty Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div style={{ height: '300px' }}>
              <Doughnut data={productsDoughnutData} options={productsDoughnutOptions} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Specific Duty: <span className="font-semibold">₦{productsData?.base_one.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Advalorem Duty: <span className="font-semibold">₦{productsData?.base_two.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total Duty: <span className="font-semibold">₦{(productsData?.base_one + productsData?.base_two).toLocaleString()}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Summary</h4>
            <p className="text-sm text-gray-600 mb-4">
              This chart shows the distribution of duty types for all products. 
              The specific rate duty is applied as a fixed amount per unit, while 
              advalorem duty is calculated as a percentage of the product value.
            </p>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
              <span className="text-sm">Specific Rate Duty</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-indigo-400 rounded mr-2"></div>
              <span className="text-sm">Advalorem Duty</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Other Metrics Charts with view selector */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4">Operations Metrics</h3>
        <ViewSelector />
        
        {activeView === 'overview' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div style={{ height: '400px' }}>
              <PolarArea data={polarData} options={polarOptions} />
            </div>
          </div>
        )}
        
        {activeView === 'comparison' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div style={{ height: '400px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        )}
        
        {activeView === 'composition' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4" style={{ height: '400px' }}>
              {doughnutCharts.map((chart, index) => (
                <div key={index} style={{ height: '200px' }}>
                  <Doughnut data={chart.data} options={chart.options} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;