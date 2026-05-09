import React, { useState } from 'react';
import { Card, Typography, Button, Chip, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react';
import {
  FaFileAlt,
  FaImages,
  FaHistory,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWrench,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTruck,
  FaTimes,
  FaHashtag,
  FaUserTie,
  FaBuilding,
  FaComment,
  FaIdCard,
  FaClock,
  FaUser,
  FaPhone,
  FaAddressCard,
  FaClipboardList,
  FaFilePdf,
  FaGasPump,
  FaRoad,
  FaToolbox,
  FaCarCrash,
  FaBook,
  FaUserMd,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaExchangeAlt,
  FaUserPlus,
  FaUserMinus,
  FaFlagCheckered,
  FaInfoCircle,
  FaWrench as FaMaintenance,
  FaClipboardCheck,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { MdWork, MdLocationOn, MdDescription } from 'react-icons/md';
import { GiGearHammer } from 'react-icons/gi';

const ViewVehicle = ({ vehicleData, setOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const {
    registrationNumber,
    chassisNumber,
    vehicleTypeModel,
    engineNumber,
    vehicleLocation,
    command,
    zone,
    condition,
    remark,
    comments,
    pictureA,
    pictureB,
    pictureC,
    pictureD,
    pictureE,
    allocations = [],
    drivers = [],
    remarks = [],
    maintenanceReports = [],
    incidentReports = [],
    logBooks = [],
    activityLogs = [],
    createdAt,
    timestamp,
    initialMileage,
    currentMileage,
    lastMaintenanceDate,
    lastMaintenanceMileage,
    maintenanceDueInKm,
    maintenanceStatus,
    recommendedAction
  } = vehicleData;

  // Helper function to get Google Drive embed URL
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url) return null;
    
    let fileId = null;
    
    let match = url.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
    
    if (!fileId) {
      match = url.match(/\/file\/d\/([^/]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    
    if (!fileId) {
      match = url.match(/uc\?export=view&id=([^&]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    
    return url;
  };

  const getFullSizeImageUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const getConditionInfo = (condition) => {
    if (!condition) return { color: 'gray', icon: <FaTruck className="w-5 h-5" />, text: 'N/A', bgColor: 'bg-gray-100' };
    
    const conditionUpper = condition.toUpperCase();
    const conditionMap = {
      'UNSERVICEABLE': { color: 'RED', icon: <FaTimes className="w-5 h-5" />, text: 'Unserviceable', bgColor: 'bg-red-50 text-red-700' },
      'SERVICEABLE': { color: 'green', icon: <FaCheckCircle className="w-5 h-5" />, text: 'Serviceable', bgColor: 'bg-green-50 text-green-700' }
    };
    
    return conditionMap[conditionUpper] || { color: 'gray', icon: <FaTruck className="w-5 h-5" />, text: condition, bgColor: 'bg-gray-100 text-gray-700' };
  };

  const getMaintenanceStatusInfo = (status) => {
    if (!status) return { color: 'gray', icon: <FaToolbox />, text: 'Unknown', bgColor: 'bg-gray-100' };
    
    const statusMap = {
      'OK': { color: 'green', icon: <FaCheckCircle />, text: 'OK', bgColor: 'bg-green-50 text-green-700' },
      'DUE_SOON': { color: 'orange', icon: <FaExclamationTriangle />, text: 'Due Soon', bgColor: 'bg-orange-50 text-orange-700' },
      'OVERDUE': { color: 'red', icon: <FaExclamationTriangle />, text: 'Overdue', bgColor: 'bg-red-50 text-red-700' },
      'CRITICAL': { color: 'red', icon: <FaExclamationTriangle />, text: 'Critical', bgColor: 'bg-red-50 text-red-700' }
    };
    
    return statusMap[status] || { color: 'gray', icon: <FaToolbox />, text: status, bgColor: 'bg-gray-100' };
  };

  // Get icon and color for activity type
  const getActivityIcon = (activityType) => {
    if (!activityType) return { icon: <FaInfoCircle />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    
    const typeMap = {
      'CREATED': { icon: <FaPlusCircle />, color: 'text-green-600', bgColor: 'bg-green-100' },
      'UPDATED': { icon: <FaEdit />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'DELETED': { icon: <FaTrashAlt />, color: 'text-red-600', bgColor: 'bg-red-100' },
      'ALLOCATED': { icon: <FaExchangeAlt />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      'DEALLOCATED': { icon: <FaExchangeAlt />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      'DRIVER_ASSIGNED': { icon: <FaUserPlus />, color: 'text-teal-600', bgColor: 'bg-teal-100' },
      'DRIVER_REMOVED': { icon: <FaUserMinus />, color: 'text-red-600', bgColor: 'bg-red-100' },
      'MAINTENANCE': { icon: <FaMaintenance />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'INCIDENT': { icon: <FaCarCrash />, color: 'text-red-600', bgColor: 'bg-red-100' },
      'LOG_ENTRY': { icon: <FaBook />, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      'STATUS_CHANGE': { icon: <FaFlagCheckered />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      'REMARK': { icon: <FaComment />, color: 'text-gray-600', bgColor: 'bg-gray-100' }
    };
    
    return typeMap[activityType] || { icon: <FaInfoCircle />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  };

  const conditionInfo = getConditionInfo(condition);
  const maintenanceStatusInfo = getMaintenanceStatusInfo(maintenanceStatus);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const pictures = [
    { key: 'A', url: pictureA, label: 'Front View' },
    { key: 'B', url: pictureB, label: 'Rear View' },
    { key: 'C', url: pictureC, label: 'Side View' },
    { key: 'D', url: pictureD, label: 'Interior View' },
    { key: 'E', url: pictureE, label: 'Additional View' },
  ].filter(pic => pic.url);

  const getAllocationTypeColor = (type) => {
    if (!type) return 'gray';
    const typeUpper = type.toUpperCase();
    if (typeUpper === 'PERMANENT') return 'blue';
    if (typeUpper === 'TEMPORARY') return 'orange';
    if (typeUpper === 'OFFICE') return 'teal';
    return 'green';
  };

  const getSeverityColor = (severity) => {
    if (!severity) return 'gray';
    const severityUpper = severity.toUpperCase();
    if (severityUpper === 'CRITICAL') return 'red';
    if (severityUpper === 'MAJOR') return 'orange';
    if (severityUpper === 'MINOR') return 'yellow';
    return 'blue';
  };

  // Define all tabs
  const tabs = [
    { value: 'details', label: 'Vehicle Details', icon: <FaTruck className="w-4 h-4" />, count: null },
    { value: 'drivers', label: 'Drivers', icon: <FaUserTie className="w-4 h-4" />, count: drivers.length },
    { value: 'allocations', label: 'Allocations', icon: <FaExchangeAlt className="w-4 h-4" />, count: allocations.length },
    { value: 'maintenance', label: 'Maintenance', icon: <FaToolbox className="w-4 h-4" />, count: maintenanceReports?.length || 0 },
    { value: 'incidents', label: 'Incidents', icon: <FaCarCrash className="w-4 h-4" />, count: incidentReports?.length || 0 },
    { value: 'logbooks', label: 'Log Books', icon: <FaBook className="w-4 h-4" />, count: logBooks?.length || 0 },
    { value: 'activity', label: 'Activity Log', icon: <FaHistory className="w-4 h-4" />, count: activityLogs?.length || 0 },
    { value: 'remarks', label: 'Remarks', icon: <FaComment className="w-4 h-4" />, count: remarks.length },
    { value: 'photos', label: 'Photos', icon: <FaImages className="w-4 h-4" />, count: pictures.length },
  ].filter(tab => tab.count !== 0 || tab.value === 'details'); // Always show details tab

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-3">
                <FaTruck className="text-teal-600" />
                {registrationNumber || 'Vehicle Details'}
              </Typography>
              <div className="flex items-center gap-3 flex-wrap">
                <Chip 
                  icon={conditionInfo.icon}
                  value={conditionInfo.text}
                  className={`${conditionInfo.bgColor} font-medium`}
                />
                {maintenanceStatus && (
                  <Chip 
                    icon={maintenanceStatusInfo.icon}
                    value={`Maintenance: ${maintenanceStatusInfo.text}`}
                    className={`${maintenanceStatusInfo.bgColor} font-medium`}
                  />
                )}
                {vehicleTypeModel && (
                  <Typography variant="small" className="text-gray-500">
                    {vehicleTypeModel}
                  </Typography>
                )}
              </div>
            </div>
            <Button
              variant="text"
              color="red"
              onClick={() => setOpen(false)}
              className="text-2xl p-2 hover:bg-red-50 rounded-full"
            >
              <FaTimes />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Inline Tabs - Horizontal Scroll */}
          <div className="sticky top-0 z-5 bg-white border-b border-gray-200 overflow-x-auto hide-scrollbar">
            <div className="flex min-w-max px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                    border-b-2 whitespace-nowrap
                    ${activeTab === tab.value 
                      ? 'border-teal-500 text-teal-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`
                      ml-1 px-1.5 py-0.5 text-xs rounded-full
                      ${activeTab === tab.value 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-gray-100 text-gray-500'}
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          <div className="p-6">
            {/* Vehicle Details Tab */}
            {activeTab === 'details' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <FaTruck className="text-teal-600" />
                    Basic Information
                  </Typography>
                  
                  <div className="space-y-3">
                    <InfoRow 
                      icon={<FaHashtag />}
                      label="Registration Number"
                      value={registrationNumber}
                      isMonospace
                    />
                    <InfoRow 
                      icon={<FaIdCard />}
                      label="Chassis Number"
                      value={chassisNumber}
                      isMonospace
                    />
                    <InfoRow 
                      icon={<GiGearHammer />}
                      label="Engine Number"
                      value={engineNumber}
                      isMonospace
                    />
                    <InfoRow 
                      icon={<FaWrench />}
                      label="Vehicle Type/Model"
                      value={vehicleTypeModel}
                    />
                  </div>
                </div>

                {/* Location & Assignment */}
                <div className="space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <MdLocationOn className="text-teal-600" />
                    Location & Assignment
                  </Typography>
                  
                  <div className="space-y-3">
                    <InfoRow 
                      icon={<FaMapMarkerAlt />}
                      label="Current Location"
                      value={vehicleLocation}
                    />
                    <InfoRow 
                      icon={<FaBuilding />}
                      label="Command"
                      value={command}
                    />
                    <InfoRow 
                      icon={<MdWork />}
                      label="Zone"
                      value={zone}
                    />
                  </div>
                </div>

                {/* Maintenance Information */}
                <div className="lg:col-span-2 space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <FaToolbox className="text-teal-600" />
                    Maintenance Information
                  </Typography>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoRow 
                      icon={<FaRoad />}
                      label="Initial Mileage"
                      value={initialMileage ? `${Number(initialMileage).toLocaleString()} km` : 'N/A'}
                    />
                    <InfoRow 
                      icon={<FaGasPump />}
                      label="Current Mileage"
                      value={currentMileage ? `${Number(currentMileage).toLocaleString()} km` : 'N/A'}
                    />
                    <InfoRow 
                      icon={<FaCalendarAlt />}
                      label="Last Maintenance Date"
                      value={formatDateOnly(lastMaintenanceDate)}
                    />
                    <InfoRow 
                      icon={<FaRoad />}
                      label="Last Maintenance Mileage"
                      value={lastMaintenanceMileage ? `${Number(lastMaintenanceMileage).toLocaleString()} km` : 'N/A'}
                    />
                    <InfoRow 
                      icon={<FaExclamationTriangle />}
                      label="Maintenance Due In"
                      value={maintenanceDueInKm ? `${Number(maintenanceDueInKm).toLocaleString()} km` : 'N/A'}
                    />
                    <InfoRow 
                      icon={maintenanceStatusInfo.icon}
                      label="Maintenance Status"
                      value={maintenanceStatusInfo.text}
                      badgeColor={maintenanceStatusInfo.bgColor}
                    />
                  </div>
                  
                  {recommendedAction && (
                    <InfoRow 
                      icon={<FaComment />}
                      label="Recommended Action"
                      value={recommendedAction}
                      isMultiline
                    />
                  )}
                </div>

                {/* Additional Information */}
                <div className="lg:col-span-2 space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <FaClipboardList className="text-teal-600" />
                    Additional Information
                  </Typography>
                  
                  {remark && (
                    <InfoRow 
                      icon={<FaComment />}
                      label="Remark"
                      value={remark}
                      isMultiline
                    />
                  )}

                  {comments && (
                    <InfoRow 
                      icon={<FaComment />}
                      label="Comments"
                      value={comments}
                      isMultiline
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <InfoRow 
                      icon={<FaCalendarAlt />}
                      label="Created At"
                      value={formatDate(createdAt)}
                    />
                    {timestamp && (
                      <InfoRow 
                        icon={<FaClock />}
                        label="Last Updated"
                        value={formatDate(timestamp)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Drivers Tab */}
            {activeTab === 'drivers' && drivers.length > 0 && (
              <div className="grid gap-4">
                {drivers.map((driver, index) => (
                  <div key={driver.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                        <FaUserTie className="text-teal-600" />
                        {driver.name || 'Unnamed Driver'}
                      </Typography>
                      <Chip 
                        value={`Ser No: ${driver.serNo || 'N/A'}`}
                        size="sm"
                        color="teal"
                        className="font-mono"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoRow 
                        icon={<FaHashtag />}
                        label="Service Number"
                        value={driver.serNo}
                        isMonospace
                        compact
                      />
                      <InfoRow 
                        icon={<FaUserTie />}
                        label="Rank"
                        value={driver.rank}
                        compact
                      />
                      <InfoRow 
                        icon={<FaIdCard />}
                        label="License Number"
                        value={driver.licenseNumber}
                        isMonospace
                        compact
                      />
                      <InfoRow 
                        icon={<FaPhone />}
                        label="Phone Number"
                        value={driver.phoneNumber}
                        compact
                      />
                      <InfoRow 
                        icon={<FaAddressCard />}
                        label="Address"
                        value={driver.address}
                        isMultiline
                        compact
                        className="md:col-span-2"
                      />
                      <InfoRow 
                        icon={<FaClock />}
                        label="Assigned On"
                        value={formatDate(driver.createdAt)}
                        compact
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Allocations Tab */}
            {activeTab === 'allocations' && allocations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Officer/Office</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Assignment</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allocations.map((allocation, index) => (
                      <tr key={allocation.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {allocation.officerName && (
                              <Typography variant="small" className="font-medium">
                                {allocation.officerName}
                              </Typography>
                            )}
                            {allocation.office && (
                              <Typography variant="small" className="text-gray-600">
                                {allocation.office}
                              </Typography>
                            )}
                            {allocation.rank && (
                              <Typography variant="small" className="text-gray-500">
                                {allocation.rank}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {allocation.officerSerNo && (
                              <Typography variant="small" className="font-mono text-gray-600">
                                Ser: {allocation.officerSerNo}
                              </Typography>
                            )}
                            {allocation.department && (
                              <Typography variant="small" className="text-gray-500">
                                Dept: {allocation.department}
                              </Typography>
                            )}
                            {allocation.unit && (
                              <Typography variant="small" className="text-gray-500">
                                Unit: {allocation.unit}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <Chip 
                              value={allocation.type || 'N/A'} 
                              size="sm" 
                              color={getAllocationTypeColor(allocation.type)}
                              className="w-fit"
                            />
                            {allocation.command && (
                              <Typography variant="small" className="text-gray-600">
                                {allocation.command}
                              </Typography>
                            )}
                            {allocation.zone && (
                              <Typography variant="small" className="text-gray-500">
                                Zone: {allocation.zone}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{allocation.yearOfAllocation || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {allocation.filePath && (
                            <a 
                              href={"http://localhost:7119"+allocation.filePath} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                            >
                              <FaFilePdf className="w-4 h-4" />
                              <span className="text-xs">View</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Maintenance Reports Tab */}
            {activeTab === 'maintenance' && (
              <>
                {maintenanceReports && maintenanceReports.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceReports.map((report, index) => (
                      <div key={report.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                          <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                            <FaToolbox className="text-teal-600" />
                            Maintenance Report #{index + 1}
                          </Typography>
                          <Chip 
                            value={report.maintenanceType || 'Regular'}
                            size="sm"
                            color="teal"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <InfoRow 
                            icon={<FaCalendarAlt />}
                            label="Maintenance Date"
                            value={formatDateOnly(report.maintenanceDate)}
                            compact
                          />
                          <InfoRow 
                            icon={<FaRoad />}
                            label="Mileage at Service"
                            value={report.mileage ? `${Number(report.mileage).toLocaleString()} km` : 'N/A'}
                            compact
                          />
                          <InfoRow 
                            icon={<MdDescription />}
                            label="Description"
                            value={report.description}
                            isMultiline
                            compact
                            className="md:col-span-2"
                          />
                          <InfoRow 
                            icon={<FaWrench />}
                            label="Parts Replaced"
                            value={report.partsReplaced}
                            isMultiline
                            compact
                            className="md:col-span-2"
                          />
                          <InfoRow 
                            icon={<FaUserMd />}
                            label="Technician"
                            value={report.technician}
                            compact
                          />
                          <InfoRow 
                            icon={<FaClock />}
                            label="Next Service Due"
                            value={report.nextServiceDue ? `${Number(report.nextServiceDue).toLocaleString()} km` : 'N/A'}
                            compact
                          />
                          <InfoRow 
                            icon={<FaFilePdf />}
                            label="Service Report"
                            value={report.filePath ? (
                              <a 
                                href={"http://localhost:7119"+report.filePath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-1"
                              >
                                <FaFilePdf className="w-4 h-4" />
                                <span className="text-sm">View Document</span>
                              </a>
                            ) : 'N/A'}
                            compact
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaToolbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <Typography>No maintenance records found for this vehicle.</Typography>
                  </div>
                )}
              </>
            )}

            {/* Incident Reports Tab */}
            {activeTab === 'incidents' && (
              <>
                {incidentReports && incidentReports.length > 0 ? (
                  <div className="space-y-4">
                    {incidentReports.map((incident, index) => (
                      <div key={incident.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                          <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                            <FaCarCrash className="text-red-600" />
                            {incident.incidentType || 'Incident'} Report
                          </Typography>
                          <Chip 
                            value={incident.severity || 'Unknown'}
                            size="sm"
                            color={getSeverityColor(incident.severity)}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <InfoRow 
                            icon={<FaCalendarAlt />}
                            label="Incident Date"
                            value={formatDateOnly(incident.incidentDate)}
                            compact
                          />
                          <InfoRow 
                            icon={<FaMapMarkerAlt />}
                            label="Location"
                            value={incident.location}
                            compact
                          />
                          <InfoRow 
                            icon={<MdDescription />}
                            label="Description"
                            value={incident.description}
                            isMultiline
                            compact
                            className="md:col-span-2"
                          />
                          <InfoRow 
                            icon={<FaWrench />}
                            label="Damage Report"
                            value={incident.damageReport}
                            isMultiline
                            compact
                            className="md:col-span-2"
                          />
                          <InfoRow 
                            icon={<FaUserTie />}
                            label="Reported By"
                            value={incident.reportedBy}
                            compact
                          />
                          <InfoRow 
                            icon={<FaClipboardList />}
                            label="Status"
                            value={incident.status || 'Under Investigation'}
                            compact
                            badgeColor={incident.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                          />
                          <InfoRow 
                            icon={<FaFilePdf />}
                            label="Incident Report"
                            value={incident.filePath ? (
                              <a 
                                href={"http://localhost:7119"+incident.filePath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-1"
                              >
                                <FaFilePdf className="w-4 h-4" />
                                <span className="text-sm">View Document</span>
                              </a>
                            ) : 'N/A'}
                            compact
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaCarCrash className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <Typography>No incident reports found for this vehicle.</Typography>
                  </div>
                )}
              </>
            )}

            {/* Log Books Tab */}
            {activeTab === 'logbooks' && (
              <>
                {logBooks && logBooks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Person Carried</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Start Mileage</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">End Mileage</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Distance</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Time In</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Time Out</th>
                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Remarks</th>
                         
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Purpose</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Route</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {logBooks.map((log, index) => {
                          const distance = log.mileageBefore && log.mileageAfter 
                            ? Number(log.mileageAfter) - Number(log.mileageBefore)
                            : null;
                          return (
                            <tr key={log.id || index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm">{formatDateOnly(log.created)}</td>
                              <td className="px-4 py-3 text-sm">{log.officerCarried || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm font-mono">
                                {log.mileageBefore ? Number(log.mileageBefore).toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm font-mono">
                                {log.mileageAfter ? Number(log.mileageAfter).toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm font-mono">
                                {distance ? `${distance.toLocaleString()} km` : 'N/A'}
                              </td>
                                <td className="px-4 py-3 text-sm font-mono">
                                {log.timeIn ? log.timeIn : 'N/A'}
                              </td>  <td className="px-4 py-3 text-sm font-mono">
                                {log.timeOut ? log.timeOut : 'N/A'}
                              </td>  <td className="px-4 py-3 text-sm font-mono">
                                {log.remark ? log.remark : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm">{log.purpose || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">{`${log.from} - ${log.to} ` || 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaBook className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <Typography>No log book entries found for this vehicle.</Typography>
                  </div>
                )}
              </>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <>
                {activityLogs && activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {/* Timeline Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="small" className="text-gray-500 flex items-center gap-2">
                        <FaHistory className="w-4 h-4" />
                        Complete activity history for this vehicle
                      </Typography>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Activity items */}
                      <div className="space-y-4">
                        {activityLogs.map((activity, index) => {
                          const activityIcon = getActivityIcon(activity.activityType);
                          return (
                            <div key={activity.id || index} className="relative flex gap-4">
                              {/* Timeline dot */}
                              <div className="relative z-10 flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full ${activityIcon.bgColor} flex items-center justify-center`}>
                                  {React.cloneElement(activityIcon.icon, { className: `w-4 h-4 ${activityIcon.color}` })}
                                </div>
                              </div>
                              
                              {/* Activity content */}
                              <div className="flex-1 bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                  
                                  <Typography variant="caption" className="text-gray-400 flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {formatDate(activity.createdAt || activity.createdAt)}
                                  </Typography>
                                </div>
                                
                              
                                
                                {/* Details grid */}
                                {activity.action && Object.keys(activity?.action).length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                   {activity.action}
                                  </div>
                                )}
                                
                                {/* User info */}
                                {(activity.fullName) && (
                                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                                    {activity.fullName && (
                                      <span className="flex items-center gap-1">
                                        <FaUser className="w-3 h-3" />
                                        {activity.fullName}
                                      </span>
                                    )}
                                    
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaHistory className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <Typography>No activity logs found for this vehicle.</Typography>
                    <Typography variant="small" className="mt-2">
                      Activities will appear here when changes are made to the vehicle record.
                    </Typography>
                  </div>
                )}
              </>
            )}

            {/* Remarks Tab */}
            {activeTab === 'remarks' && remarks.length > 0 && (
              <div className="space-y-4">
                {remarks.map((remarkItem, index) => (
                  <div key={remarkItem.id || index} className="border-l-4 border-teal-500 bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="small" className="font-semibold text-teal-600">
                        Remark #{index + 1}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        {formatDate(remarkItem.createdAt)}
                      </Typography>
                    </div>
                    <Typography variant="body2" className="text-gray-700">
                      {remarkItem.remarkText}
                    </Typography>
                  </div>
                ))}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && pictures.length > 0 && (
              <div className="grid lg:grid-cols-2 gap-6">
                {pictures.map((picture) => (
                  <div key={picture.key} className="space-y-2">
                    <Typography variant="small" className="font-semibold text-gray-600">
                      {picture.label || `Picture ${picture.key}`}
                    </Typography>
                    <div 
                      className="border rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedImage(getFullSizeImageUrl(picture.url))}
                    >
                      <img
                        src={getGoogleDriveEmbedUrl(picture.url)}
                        alt={`Vehicle ${picture.key}`}
                        className="w-full h-64 object-contain hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available';
                          e.target.alt = 'Image not available';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3 flex-shrink-0">
          <Button
            variant="outlined"
            color="teal"
            onClick={() => setOpen(false)}
            className="border-teal-500 text-teal-500 flex items-center gap-2 hover:bg-teal-50"
          >
            <FaTimes className="w-4 h-4" />
            Close
          </Button>
        </div>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              <FaTimes />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto max-h-[85vh] object-contain"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Available';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for consistent info rows
const InfoRow = ({ icon, label, value, isMonospace = false, isMultiline = false, compact = false, className = '', badgeColor = '' }) => {
  if (!value) return null;
  
  return (
    <div className={`${compact ? 'space-y-0' : 'space-y-1'} ${className}`}>
      <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
        {React.cloneElement(icon, { className: "w-4 h-4 text-teal-500" })}
        {label}:
      </Typography>
      {isMultiline ? (
        <div className={`bg-gray-50 p-2 rounded ${compact ? 'text-xs' : ''}`}>
          <Typography variant="small" className={isMonospace ? 'font-mono' : ''}>
            {value}
          </Typography>
        </div>
      ) : badgeColor ? (
        <Chip value={value} size="sm" className={badgeColor} />
      ) : (
        <Typography variant="small" className={`${isMonospace ? 'font-mono' : ''} ${compact ? 'text-xs' : ''}`}>
          {value}
        </Typography>
      )}
    </div>
  );
};

export default ViewVehicle;