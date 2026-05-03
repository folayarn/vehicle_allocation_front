import React from 'react';
import { Card, Typography, Button, Chip, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react';
import { 
  FaFileAlt, 
  FaImages, 
  FaHistory, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaIdCard,
  FaWrench,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTruck,
  FaTimes,
  FaUser,
  FaHashtag,
  FaUserTie,
  FaBuilding,
  FaBusinessTime
} from 'react-icons/fa';
import { MdWork, MdLocationOn } from 'react-icons/md';
import { GiGearHammer } from 'react-icons/gi';

const ViewVehicle = ({ vehicleData, setOpen }) => {
  const {
    id,
    registrationNumber,
    chassisNumber,
    yearOfAllocation,
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
    createdAt,
    timestamp
  } = vehicleData;

  // Helper function to get Google Drive embed URL
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  // Get condition color and icon
  const getConditionInfo = (condition) => {
    switch (condition?.toUpperCase()) {
      case 'EXCELLENT':
        return { color: 'green', icon: <FaCheckCircle className="w-5 h-5" />, text: 'Excellent' };
      case 'GOOD':
        return { color: 'blue', icon: <FaCheckCircle className="w-5 h-5" />, text: 'Good' };
      case 'FAIR':
        return { color: 'yellow', icon: <FaExclamationTriangle className="w-5 h-5" />, text: 'Fair' };
      case 'POOR':
        return { color: 'orange', icon: <FaExclamationTriangle className="w-5 h-5" />, text: 'Poor' };
      case 'DAMAGED':
        return { color: 'red', icon: <FaExclamationTriangle className="w-5 h-5" />, text: 'Damaged' };
      case 'SERVICEABLE':
        return { color: 'green', icon: <FaCheckCircle className="w-5 h-5" />, text: 'Serviceable' };
      default:
        return { color: 'gray', icon: <FaTruck className="w-5 h-5" />, text: condition || 'N/A' };
    }
  };

  const conditionInfo = getConditionInfo(condition);

  // Pictures array for mapping
  const pictures = [
    { key: 'A', url: pictureA },
    { key: 'B', url: pictureB },
    { key: 'C', url: pictureC },
    { key: 'D', url: pictureD },
    { key: 'E', url: pictureE },
  ].filter(pic => pic.url);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Vehicle Allocation Information
              </Typography>
             
            </div>
            <Button
              variant="text"
              color="red"
              onClick={() => setOpen(false)}
              className="text-2xl p-2"
            >
              <FaTimes />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value="details">
            <TabsHeader>
              <Tab value="details" className="flex items-center gap-2">
                <FaFileAlt className="w-5 h-5" />
                Vehicle Details
              </Tab>
              {pictures.length > 0 && (
                <Tab value="photos" className="flex items-center gap-2">
                  <FaImages className="w-5 h-5" />
                  Photos ({pictures.length})
                </Tab>
              )}
              {allocations.length > 0 && (
                <Tab value="allocations" className="flex items-center gap-2">
                  <FaHistory className="w-5 h-5" />
                  Allocation History ({allocations.length})
                </Tab>
              )}
            </TabsHeader>

            <TabsBody>
              {/* Vehicle Details Tab */}
              <TabPanel value="details">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2">
                      Basic Information
                    </Typography>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaTruck className="w-4 h-4" />
                          Registration Number:
                        </Typography>
                        <Typography variant="small" className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {registrationNumber || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaHashtag className="w-4 h-4" />
                          Chassis Number:
                        </Typography>
                        <Typography variant="small" className="font-mono">
                          {chassisNumber || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <GiGearHammer className="w-4 h-4" />
                          Engine Number:
                        </Typography>
                        <Typography variant="small" className="font-mono">
                          {engineNumber || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaWrench className="w-4 h-4" />
                          Vehicle Type/Model:
                        </Typography>
                        <Typography variant="small">
                          {vehicleTypeModel || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4" />
                          Year of Allocation:
                        </Typography>
                        <Typography variant="small" className="flex items-center gap-1">
                          {yearOfAllocation || 'N/A'}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Location & Assignment */}
                  <div className="space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2">
                      Location & Assignment
                    </Typography>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <MdLocationOn className="w-4 h-4" />
                          Current Location:
                        </Typography>
                        <Typography variant="small" className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          {vehicleLocation || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaBuilding className="w-4 h-4" />
                          Command:
                        </Typography>
                        <Typography variant="small">
                          {command || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <MdWork className="w-4 h-4" />
                          Zone:
                        </Typography>
                        <Typography variant="small">
                          {zone || 'N/A'}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-start">
                        <Typography variant="small" className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaWrench className="w-4 h-4" />
                          Condition:
                        </Typography>
                        <Chip
                          icon={conditionInfo.icon}
                          value={conditionInfo.text}
                          color={conditionInfo.color}
                          className="w-fit"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remarks & Comments */}
                  <div className="lg:col-span-2 space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2">
                      Additional Information
                    </Typography>
                    
                    {remark && (
                      <div>
                        <Typography variant="small" className="font-semibold text-gray-600 mb-1">
                          Remark:
                        </Typography>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <Typography variant="small">
                            {remark}
                          </Typography>
                        </div>
                      </div>
                    )}

                    {comments && (
                      <div>
                        <Typography variant="small" className="font-semibold text-gray-600 mb-1">
                          Comments:
                        </Typography>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <Typography variant="small">
                            {comments}
                          </Typography>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      
                      <div>
                        <Typography variant="small" className="font-semibold text-gray-600 mb-1 flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4" />
                          Created At:
                        </Typography>
                        <Typography variant="small" className="font-mono">
                          {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Photos Tab */}
              {pictures.length > 0 && (
                <TabPanel value="photos">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {pictures.map((picture) => (
                      <div key={picture.key} className="space-y-2">
                        <Typography variant="small" className="font-semibold text-gray-600">
                          Picture {picture.key}
                        </Typography>
                        <div className="border rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={getGoogleDriveEmbedUrl(picture.url)}
                            alt={`Vehicle ${picture.key}`}
                            className="w-full h-64 object-contain"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                            }}
                          />
                        </div>
                        <Typography variant="small" className="text-gray-500 truncate">
                          {picture.url}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </TabPanel>
              )}

              {/* Allocation History Tab */}
              {allocations.length > 0 && (
                <TabPanel value="allocations">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaUser className="w-3 h-3" />
                              Officer Name
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaHashtag className="w-3 h-3" />
                              Service No.
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaUserTie className="w-3 h-3" />
                              Rank
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaBusinessTime className="w-3 h-3" />
                              Type
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaBuilding className="w-3 h-3" />
                              Command
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <MdWork className="w-3 h-3" />
                              Department/Unit
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="w-3 h-3" />
                              Year
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allocations.map((allocation, index) => (
                          <tr key={allocation.id || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm">{allocation.officerName || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm font-mono">{allocation.officerSerNo || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">{allocation.rank || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">
                              <Chip 
                                value={allocation.type || 'N/A'} 
                                size="sm" 
                                color={allocation.type === 'Permanent' ? 'blue' : 'green'}
                                className="w-fit"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm">{allocation.command || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">
                              {allocation.department || allocation.unit || allocation.office || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm">{allocation.yearOfAllocation || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
              )}
            </TabsBody>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
          <Button
            variant="outlined"
            color="teal"
            onClick={() => setOpen(false)}
            className="border-teal-500 text-teal-500 flex items-center gap-2"
          >
            <FaTimes className="w-4 h-4" />
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ViewVehicle;