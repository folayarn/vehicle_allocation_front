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
  FaFilePdf
} from 'react-icons/fa';
import { MdWork, MdLocationOn } from 'react-icons/md';
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
    createdAt,
    timestamp
  } = vehicleData;




  // Helper function to get Google Drive embed URL
  const getGoogleDriveEmbedUrl = (url) => {

    console.log(url)
    if (!url) return null;
    
    // Handle different Google Drive URL formats
    let fileId = null;
    
    // Format 1: https://drive.google.com/open?id=FILE_ID
    let match = url.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
    
    // Format 2: https://drive.google.com/file/d/FILE_ID/view
    if (!fileId) {
      match = url.match(/\/file\/d\/([^/]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    
    // Format 3: Direct download link
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

  // Get full-size image URL for modal
  const getFullSizeImageUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  // Get condition color and icon
  const getConditionInfo = (condition) => {
    if (!condition) return { color: 'gray', icon: <FaTruck className="w-5 h-5" />, text: 'N/A', bgColor: 'bg-gray-100' };
    
    const conditionUpper = condition.toUpperCase();
    const conditionMap = {
      'UNSERVICEABLE': { color: 'RED', icon: <FaTimes className="w-5 h-5" />, text: 'Excellent', bgColor: 'bg-green-50 text-green-700' },
     
      'SERVICEABLE': { color: 'green', icon: <FaCheckCircle className="w-5 h-5" />, text: 'Serviceable', bgColor: 'bg-green-50 text-green-700' }
    };
    
    return conditionMap[conditionUpper] || { color: 'gray', icon: <FaTruck className="w-5 h-5" />, text: condition, bgColor: 'bg-gray-100 text-gray-700' };
  };

  const conditionInfo = getConditionInfo(condition);

  // Format date helper
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

  // Pictures array for mapping
  const pictures = [
    { key: 'A', url: pictureA, label: 'Front View' },
    { key: 'B', url: pictureB, label: 'Rear View' },
    { key: 'C', url: pictureC, label: 'Side View' },
    { key: 'D', url: pictureD, label: 'Interior View' },
    { key: 'E', url: pictureE, label: 'Additional View' },
  ].filter(pic => pic.url);

  // Get allocation type color
  const getAllocationTypeColor = (type) => {
    if (!type) return 'gray';
    const typeUpper = type.toUpperCase();
    if (typeUpper === 'PERMANENT') return 'blue';
    if (typeUpper === 'TEMPORARY') return 'orange';
    if (typeUpper === 'OFFICE') return 'teal';
    return 'green';
  };

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
              <div className="flex items-center gap-3">
                <Chip 
                  icon={conditionInfo.icon}
                  value={conditionInfo.text}
                  className={`${conditionInfo.bgColor} font-medium`}
                />
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

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="sticky top-0 z-5 bg-white">
              <Tab value="details" className="flex items-center gap-2">
                Vehicle Details
              </Tab>
              {drivers.length > 0 && (
                <Tab value="drivers" className="flex items-center gap-2">
                  Drivers ({drivers.length})
                </Tab>
              )}
              {allocations.length > 0 && (
                <Tab value="allocations" className="flex items-center gap-2">
                  Allocations ({allocations.length})
                </Tab>
              )}
              {remarks.length > 0 && (
                <Tab value="remarks" className="flex items-center gap-2">
                  Remarks ({remarks.length})
                </Tab>
              )}
              {pictures.length > 0 && (
                <Tab value="photos" className="flex items-center gap-2">
                  Photos ({pictures.length})
                </Tab>
              )}
            </TabsHeader>

            <TabsBody>
              {/* Vehicle Details Tab */}
              <TabPanel value="details" className="p-4">
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
              </TabPanel>

              {/* Drivers Tab */}
              {drivers.length > 0 && (
                <TabPanel value="drivers" className="p-4">
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
                </TabPanel>
              )}

              {/* Allocation History Tab */}
              {allocations.length > 0 && (
                <TabPanel value="allocations" className="p-4">
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
                </TabPanel>
              )}

              {/* Remarks Tab */}
              {remarks.length > 0 && (
                <TabPanel value="remarks" className="p-4">
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
                        {/* {remarkItem.userId && (
                          <Typography variant="caption" className="text-gray-400 mt-2 block">
                            User ID: {remarkItem.userId}
                          </Typography>
                        )} */}
                      </div>
                    ))}
                  </div>
                </TabPanel>
              )}

              {/* Photos Tab */}
              {pictures.length > 0 && (
                <TabPanel value="photos" className="p-4">
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
                </TabPanel>
              )}
            </TabsBody>
          </Tabs>
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
const InfoRow = ({ icon, label, value, isMonospace = false, isMultiline = false, compact = false, className = '' }) => {
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
      ) : (
        <Typography variant="small" className={`${isMonospace ? 'font-mono' : ''} ${compact ? 'text-xs' : ''}`}>
          {value}
        </Typography>
      )}
    </div>
  );
};

export default ViewVehicle;