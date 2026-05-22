import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Chip, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea } from '@material-tailwind/react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  FaTimes,
  FaBoxes,
  FaCar,
  FaCalendarAlt,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaInfoCircle,
  FaFileInvoice,
  FaHashtag,
  FaTag,
  FaDollarSign,
  FaTruck,
  FaWrench,
  FaUserCheck,
  FaUserTimes,
  FaComment,
  FaHistory,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaBan,
  FaIdBadge,
  FaMapMarkerAlt,
  FaBuilding,
  FaThumbsUp,
  FaThumbsDown,
  FaSave
} from 'react-icons/fa';
import { MdPending, MdCancel, MdAttachMoney, MdCategory, MdDescription, MdBuild, MdWork } from 'react-icons/md';
import { GiGearHammer } from 'react-icons/gi';
import moment from 'moment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ApproveSparePartRequestThunk, FetchSingleSparePartRequestThunk, RejectSparePartRequestThunk } from '../../store/thunks/SparePartRequestThunk';
import { data } from 'autoprefixer';

const ViewRequest = ({ requestData, setOpen, userRole, onActionComplete }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const singleData = useSelector((state) => state.FetchSlice?.singleData);
  const [selectedRequest, setSelectedRequest] = useState();

  const isAllocator = userRole?.toLowerCase() === 'allocator';
  const isPending = selectedRequest?.status?.toLowerCase() === 'submitted';
useEffect(()=>{
  setSelectedRequest(singleData)
},[])
  // Get priority config
  const getPriorityConfig = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
        return { color: 'red', icon: <FaExclamationTriangle className="w-4 h-4" />, label: 'Urgent', bgColor: 'bg-red-50 text-red-700' };
      case 'high':
        return { color: 'orange', icon: <FaFlag className="w-4 h-4" />, label: 'High', bgColor: 'bg-orange-50 text-orange-700' };
      case 'medium':
        return { color: 'yellow', icon: <FaClock className="w-4 h-4" />, label: 'Medium', bgColor: 'bg-yellow-50 text-yellow-700' };
      case 'low':
        return { color: 'green', icon: <FaClock className="w-4 h-4" />, label: 'Low', bgColor: 'bg-green-50 text-green-700' };
      default:
        return { color: 'gray', icon: <FaClock className="w-4 h-4" />, label: priority || 'Medium', bgColor: 'bg-gray-50 text-gray-700' };
    }
  };

  // Get status config
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'draft':
        return { color: 'gray', icon: <MdPending className="w-4 h-4" />, label: 'Draft', bgColor: 'bg-gray-50 text-gray-700' };
      case 'submitted':
        return { color: 'blue', icon: <FaClock className="w-4 h-4" />, label: 'Pending Approval', bgColor: 'bg-blue-50 text-blue-700' };
      case 'approved':
        return { color: 'green', icon: <FaCheckCircle className="w-4 h-4" />, label: 'Approved', bgColor: 'bg-green-50 text-green-700' };
      case 'rejected':
        return { color: 'red', icon: <FaBan className="w-4 h-4" />, label: 'Rejected', bgColor: 'bg-red-50 text-red-700' };
      case 'inprogress':
        return { color: 'orange', icon: <FaWrench className="w-4 h-4" />, label: 'In Progress', bgColor: 'bg-orange-50 text-orange-700' };
      case 'completed':
        return { color: 'teal', icon: <FaCheckCircle className="w-4 h-4" />, label: 'Completed', bgColor: 'bg-teal-50 text-teal-700' };
      case 'cancelled':
        return { color: 'red', icon: <FaUserTimes className="w-4 h-4" />, label: 'Cancelled', bgColor: 'bg-red-50 text-red-700' };
      default:
        return { color: 'gray', icon: <MdPending className="w-4 h-4" />, label: status || 'Unknown', bgColor: 'bg-gray-50 text-gray-700' };
    }
  };

  // Get item status config
  const getItemStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { color: 'orange', icon: <MdPending />, label: 'Pending', bgColor: 'bg-orange-50 text-orange-700' };
      case 'approved':
        return { color: 'green', icon: <FaCheckCircle />, label: 'Approved', bgColor: 'bg-green-50 text-green-700' };
      case 'ordered':
        return { color: 'blue', icon: <FaTruck />, label: 'Ordered', bgColor: 'bg-blue-50 text-blue-700' };
      case 'received':
        return { color: 'teal', icon: <FaCheck />, label: 'Received', bgColor: 'bg-teal-50 text-teal-700' };
      case 'installed':
        return { color: 'purple', icon: <FaWrench />, label: 'Installed', bgColor: 'bg-purple-50 text-purple-700' };
      case 'rejected':
        return { color: 'red', icon: <FaBan />, label: 'Rejected', bgColor: 'bg-red-50 text-red-700' };
      default:
        return { color: 'gray', icon: <MdPending />, label: status || 'Pending', bgColor: 'bg-gray-50 text-gray-700' };
    }
  };

  const calculateTotalCost = (items) => {
    return items?.reduce((total, item) => total + (item.quantityRequested * (item.unitPrice || 0)), 0) || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD MMM YYYY, hh:mm A');
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD MMM YYYY');
  };
const dispatch = useDispatch()
  // Handle Rejection
  const handleReject = async (values) => {
    setLoading(true);
    try {
      const rejectData = {
        id: selectedRequest.id,
        rejectedByUserId: sessionStorage.getItem("e") || "system",
        rejectionReason: values.rejectionReason
      };
      
      dispatch(RejectSparePartRequestThunk({id:rejectData.id,data:rejectData})).unwrap()
      dispatch(FetchSingleSparePartRequestThunk(rejectData.id))
      if (onActionComplete) onActionComplete();
      setShowRejectDialog(false);
      // Refresh the request data
      const updatedRequest = { ...selectedRequest, status: 'Rejected', rejectionReason: values.rejectionReason };
      setSelectedRequest(updatedRequest);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Approval
  const handleApprove = async (values) => {
    setLoading(true);
    try {
      const approveData = {
        id: selectedRequest.id,
        approvedByUserId: sessionStorage.getItem("e") || "system",
        approvalRemarks: values.approvalRemarks,
        vehicleId: selectedRequest.vehicleId,
        userId: selectedRequest.userId,
        items: values.items.map(item => ({
          id: item.id,
          quantityApproved: item.quantityApproved,
          partNumber: item.partNumber,
          unitPrice: item.unitPrice,
          supplierName: item.supplierName,
          supplierPartNumber: item.supplierPartNumber,
          isStockItem: item.isStockItem
        }))
      };
      
dispatch(ApproveSparePartRequestThunk({id:approveData.id,data:approveData})).unwrap()      
      dispatch(FetchSingleSparePartRequestThunk(approveData.id))
     
if (onActionComplete) onActionComplete();
      setShowApproveDialog(false);
      // Refresh the request data
      const updatedRequest = { ...selectedRequest, status: 'Approved', approvalRemarks: values.approvalRemarks };
      setSelectedRequest(updatedRequest);
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityConfig = getPriorityConfig(selectedRequest?.priority);
  const statusConfig = getStatusConfig(selectedRequest?.status);

  // Approval validation schema
  const approvalValidationSchema = Yup.object().shape({
    approvalRemarks: Yup.string().max(500, 'Remarks cannot exceed 500 characters'),
    items: Yup.array().of(
      Yup.object().shape({
        partNumber: Yup.string().required('Part number is required'),
        supplierName: Yup.string().required('Supplier name is required'),
        unitPrice: Yup.number().min(0, 'Unit price must be positive').required('Unit price is required'),
        quantityApproved: Yup.number()
          .min(1, 'Approved quantity must be at least 1')
          .max(Yup.ref('quantityRequested'), 'Approved quantity cannot exceed requested quantity')
          .required('Approved quantity is required')
      })
    )
  });

  // Define tabs
  const tabs = [
    { value: 'details', label: 'Request Details', icon: <FaFileInvoice className="w-4 h-4" /> },
    { value: 'items', label: 'Parts/Items', icon: <FaBoxes className="w-4 h-4" />, count: selectedRequest?.items?.length },
    { value: 'vehicle', label: 'Vehicle Info', icon: <FaCar className="w-4 h-4" /> },
  ];

  const role = sessionStorage.getItem('role')

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Typography variant="h3" color="blue-gray" className="flex items-center gap-2">
                  <FaBoxes className="text-teal-600" />
                  {selectedRequest?.requestNumber || 'Spare Part Request'}
                </Typography>
                <Chip 
                  icon={priorityConfig.icon}
                  value={priorityConfig.label}
                  className={priorityConfig.bgColor}
                />
                <Chip 
                  icon={statusConfig.icon}
                  value={statusConfig.label}
                  className={statusConfig.bgColor}
                />
                {selectedRequest?.isUrgent && (
                  <Chip 
                    icon={<FaExclamationTriangle className="w-3 h-3" />}
                    value="URGENT"
                    color="red"
                  />
                )}
              </div>
              
              {/* Vehicle info in header */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <FaCar className="w-3 h-3" />
                  {selectedRequest?.vehicleAssessment?.registrationNumber || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <FaHashtag className="w-3 h-3" />
                  {selectedRequest?.vehicleAssessment?.chassisNumber || 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isPending && (
                <>
                {role != "store" && (
                  <>
                  <Button
                    onClick={() => setShowApproveDialog(true)}
                    className="bg-green-500 flex items-center gap-2 hover:bg-green-600"
                    size="sm"
                  >
                    <FaThumbsUp className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    className="bg-red-500 flex items-center gap-2 hover:bg-red-600"
                    size="sm"
                  >
                    <FaThumbsDown className="w-4 h-4" />
                    Reject
                  </Button>
                  </>
                )}
                  
                </>
              )}
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
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="sticky top-0 z-5 bg-white border-b border-gray-200 overflow-x-auto hide-scrollbar">
            <div className="flex min-w-max px-6">
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
                  {tab.count !== undefined && tab.count > 0 && (
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
            {/* Request Details Tab */}
            {activeTab === 'details' && selectedRequest && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <FaFileInvoice className="text-teal-600" />
                    Request Information
                  </Typography>
                  
                  <div className="space-y-3">
                    <InfoRow 
                      icon={<FaHashtag />}
                      label="Request Number"
                      value={selectedRequest.requestNumber}
                      isMonospace
                    />
                    <InfoRow 
                      icon={<FaTag />}
                      label="Request Type"
                      value={selectedRequest.requestType}
                    />
                    <InfoRow 
                      icon={<FaCalendarAlt />}
                      label="Required By Date"
                      value={formatDateOnly(selectedRequest.requiredByDate)}
                    />
                    <InfoRow 
                      icon={<FaUser />}
                      label="Requested By"
                      value={selectedRequest.userId}
                      isMonospace
                    />
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                    <FaInfoCircle className="text-teal-600" />
                    Status Information
                  </Typography>
                  
                  <div className="space-y-3">
                    <InfoRow 
                      icon={statusConfig.icon}
                      label="Current Status"
                      value={statusConfig.label}
                      badgeColor={statusConfig.bgColor}
                    />
                    <InfoRow 
                      icon={<FaCalendarAlt />}
                      label="Created Date"
                      value={formatDate(selectedRequest.created)}
                    />
                    <InfoRow 
                      icon={<FaClock />}
                      label="Last Updated"
                      value={formatDate(selectedRequest.updated)}
                    />
                    {selectedRequest.approvedByUserId && (
                      <InfoRow 
                        icon={<FaUserCheck />}
                        label="Approved By"
                        value={selectedRequest.approvedByUserId}
                        isMonospace
                      />
                    )}
                    {selectedRequest.approvedDate && (
                      <InfoRow 
                        icon={<FaCalendarAlt />}
                        label="Approved Date"
                        value={formatDate(selectedRequest.approvedDate)}
                      />
                    )}
                  </div>
                </div>

                {/* Remarks */}
                {selectedRequest.approvalRemarks && (
                  <div className="lg:col-span-2">
                    <InfoRow 
                      icon={<FaComment />}
                      label="Approval Remarks"
                      value={selectedRequest.approvalRemarks}
                      isMultiline
                    />
                  </div>
                )}

                {selectedRequest.rejectionReason && (
                  <div className="lg:col-span-2">
                    <InfoRow 
                      icon={<FaBan />}
                      label="Rejection Reason"
                      value={selectedRequest.rejectionReason}
                      isMultiline
                      badgeColor="bg-red-50 text-red-700"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && selectedRequest?.items && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
                    <FaBoxes className="text-teal-600" />
                    Parts & Items ({selectedRequest.items.length})
                  </Typography>
                  <div className="text-right">
                    <Typography variant="small" className="text-gray-500">
                      Total Estimated Cost
                    </Typography>
                    <Typography variant="h5" color="blue-gray">
                      ₦{calculateTotalCost(selectedRequest.items).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedRequest.items.map((item, index) => {
                    const itemStatusConfig = getItemStatusConfig(item.itemStatus);
                    return (
                      <div key={item.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                          <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                            <FaBoxes className="text-teal-600" />
                            Item #{index + 1}
                          </Typography>
                          <Chip 
                            value={itemStatusConfig.label}
                            size="sm"
                            className={itemStatusConfig.bgColor}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <InfoRow 
                            icon={<MdCategory />}
                            label="Category"
                            value={item.category}
                            compact
                          />
                          <InfoRow 
                            icon={<GiGearHammer />}
                            label="Brand"
                            value={item.brand}
                            compact
                          />
                          <InfoRow 
                            icon={<FaHashtag />}
                            label="Quantity Requested"
                            value={`${item.quantityRequested} ${item.unitOfMeasure}`}
                            compact
                          />
                          {item.quantityApproved > 0 && (
                            <InfoRow 
                              icon={<FaCheckCircle />}
                              label="Quantity Approved"
                              value={`${item.quantityApproved} ${item.unitOfMeasure}`}
                              compact
                            />
                          )}
                          {item.unitPrice && (
                            <InfoRow 
                              icon={<MdAttachMoney />}
                              label="Unit Price"
                              value={`₦${item.unitPrice.toLocaleString()}`}
                              compact
                            />
                          )}
                          {item.partNumber && (
                            <InfoRow 
                              icon={<FaTag />}
                              label="Part Number"
                              value={item.partNumber}
                              isMonospace
                              compact
                            />
                          )}
                          {item.supplierName && (
                            <InfoRow 
                              icon={<FaTruck />}
                              label="Supplier"
                              value={item.supplierName}
                              compact
                            />
                          )}
                          {item.supplierPartNumber && (
                            <InfoRow 
                              icon={<FaHashtag />}
                              label="Supplier Part #"
                              value={item.supplierPartNumber}
                              isMonospace
                              compact
                            />
                          )}
                          <InfoRow 
                            icon={<MdDescription />}
                            label="Specifications"
                            value={item.specification}
                            isMultiline
                            compact
                            className="md:col-span-2"
                          />
                          {item.isCritical && (
                            <div className="md:col-span-2">
                              <Chip 
                                icon={<FaExclamationTriangle className="w-3 h-3" />}
                                value="Critical for Operation"
                                color="red"
                                size="sm"
                              />
                            </div>
                          )}
                          {item.isStockItem && (
                            <div className="md:col-span-2">
                              <Chip 
                                icon={<FaCheck className="w-3 h-3" />}
                                value="Stock Item Available"
                                color="green"
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vehicle Info Tab */}
            {activeTab === 'vehicle' && selectedRequest?.vehicleAssessment && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Vehicle Basic Info */}
                  <div className="space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                      <FaCar className="text-teal-600" />
                      Vehicle Information
                    </Typography>
                    
                    <div className="space-y-3">
                      <InfoRow 
                        icon={<FaHashtag />}
                        label="Registration Number"
                        value={selectedRequest.vehicleAssessment.registrationNumber}
                        isMonospace
                      />
                      <InfoRow 
                        icon={<FaIdBadge />}
                        label="Chassis Number"
                        value={selectedRequest.vehicleAssessment.chassisNumber}
                        isMonospace
                      />
                      <InfoRow 
                        icon={<GiGearHammer />}
                        label="Vehicle Type/Model"
                        value={selectedRequest.vehicleAssessment.vehicleTypeModel}
                      />
                      <InfoRow 
                        icon={<FaWrench />}
                        label="Condition"
                        value={selectedRequest.vehicleAssessment.condition}
                        badgeColor={
                          selectedRequest.vehicleAssessment.condition === 'SERVICEABLE' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }
                      />
                    </div>
                  </div>

                  {/* Location & Assignment */}
                  <div className="space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-teal-600" />
                      Location & Assignment
                    </Typography>
                    
                    <div className="space-y-3">
                      <InfoRow 
                        icon={<FaMapMarkerAlt />}
                        label="Current Location"
                        value={selectedRequest.vehicleAssessment.vehicleLocation}
                      />
                      <InfoRow 
                        icon={<FaBuilding />}
                        label="Command"
                        value={selectedRequest.vehicleAssessment.command}
                      />
                      <InfoRow 
                        icon={<MdWork />}
                        label="Zone"
                        value={selectedRequest.vehicleAssessment.zone}
                      />
                    </div>
                  </div>

                  {/* Maintenance Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <Typography variant="h5" color="blue-gray" className="border-b pb-2 flex items-center gap-2">
                      <MdBuild className="text-teal-600" />
                      Maintenance Information
                    </Typography>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <InfoRow 
                        icon={<FaClock />}
                        label="Maintenance Status"
                        value={selectedRequest.vehicleAssessment.maintenanceStatus}
                        badgeColor={
                          selectedRequest.vehicleAssessment.maintenanceStatus === 'OK' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-orange-50 text-orange-700'
                        }
                      />
                      <InfoRow 
                        icon={<FaTruck />}
                        label="Maintenance Due In"
                        value={selectedRequest.vehicleAssessment.maintenanceDueInKm 
                          ? `${selectedRequest.vehicleAssessment.maintenanceDueInKm.toLocaleString()} km` 
                          : 'N/A'}
                      />
                    </div>
                    
                    {selectedRequest.vehicleAssessment.recommendedAction && (
                      <InfoRow 
                        icon={<FaComment />}
                        label="Recommended Action"
                        value={selectedRequest.vehicleAssessment.recommendedAction}
                        isMultiline
                      />
                    )}
                  </div>

                  {/* Remarks */}
                  {selectedRequest.vehicleAssessment.remark && (
                    <div className="lg:col-span-2">
                      <InfoRow 
                        icon={<FaComment />}
                        label="Vehicle Remarks"
                        value={selectedRequest.vehicleAssessment.remark}
                        isMultiline
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Tab */}
            {activeTab === 'tracking' && selectedRequest && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4">
                    <div className="relative flex gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <FaPlusCircle className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 bg-white border rounded-lg p-4">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <Typography variant="small" className="font-semibold text-green-600">
                            Request Created
                          </Typography>
                          <Typography variant="caption" className="text-gray-400">
                            {formatDate(selectedRequest.created)}
                          </Typography>
                        </div>
                        <Typography variant="small" className="text-gray-600">
                          Spare part request was created and submitted for approval.
                        </Typography>
                      </div>
                    </div>

                    {selectedRequest.updated && selectedRequest.updated !== selectedRequest.created && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaEdit className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 bg-white border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <Typography variant="small" className="font-semibold text-blue-600">
                              Request Updated
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                              {formatDate(selectedRequest.updated)}
                            </Typography>
                          </div>
                          <Typography variant="small" className="text-gray-600">
                            Request details were updated.
                          </Typography>
                        </div>
                      </div>
                    )}

                    {selectedRequest.approvedByUserId && selectedRequest.approvedDate && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FaCheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 bg-white border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <Typography variant="small" className="font-semibold text-green-600">
                              Request Approved
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                              {formatDate(selectedRequest.approvedDate)}
                            </Typography>
                          </div>
                          <Typography variant="small" className="text-gray-600">
                            Request was approved.
                          </Typography>
                          {selectedRequest.approvalRemarks && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <Typography variant="caption" className="text-gray-500">
                                Remarks: {selectedRequest.approvalRemarks}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedRequest.rejectionReason && (
                      <div className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <FaBan className="w-4 h-4 text-red-600" />
                          </div>
                        </div>
                        <div className="flex-1 bg-white border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <Typography variant="small" className="font-semibold text-red-600">
                              Request Rejected
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                              {formatDate(selectedRequest.approvedDate)}
                            </Typography>
                          </div>
                          <div className="mt-2 p-2 bg-red-50 rounded">
                            <Typography variant="caption" className="text-red-600">
                              Reason: {selectedRequest.rejectionReason}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} handler={setShowApproveDialog} size="xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FaThumbsUp className="text-green-500" />
            Approve Spare Part Request - {selectedRequest?.requestNumber}
          </div>
        </DialogHeader>
        <DialogBody divider>
          <Formik
            initialValues={{
              approvalRemarks: '',
              items: selectedRequest?.items?.map(item => ({
                id: item.id,
                partNumber: item.partNumber || '',
                supplierName: item.supplierName || '',
                supplierPartNumber: item.supplierPartNumber || '',
                unitPrice: item.unitPrice || '',
                quantityApproved: item.quantityRequested,
                quantityRequested: item.quantityRequested,
                isStockItem: item.isStockItem || false
              })) || []
            }}
            validationSchema={approvalValidationSchema}
            onSubmit={handleApprove}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Items Section */}
                  <div>
                    <Typography variant="h6" className="mb-3">Item Details</Typography>
                    <FieldArray name="items">
                      {() => (
                        <div className="space-y-4">
                          {values.items.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                              <Typography variant="small" className="font-semibold mb-3">
                                Item #{index + 1}
                              </Typography>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Part Number *
                                  </label>
                                  <Field
                                    name={`items.${index}.partNumber`}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter part number"
                                  />
                                  <ErrorMessage name={`items.${index}.partNumber`} component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Name *
                                  </label>
                                  <Field
                                    name={`items.${index}.supplierName`}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter supplier name"
                                  />
                                  <ErrorMessage name={`items.${index}.supplierName`} component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Part Number
                                  </label>
                                  <Field
                                    name={`items.${index}.supplierPartNumber`}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter supplier part number"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit Price *
                                  </label>
                                  <Field
                                    name={`items.${index}.unitPrice`}
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter unit price"
                                  />
                                  <ErrorMessage name={`items.${index}.unitPrice`} component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity Approved *
                                  </label>
                                  <Field
                                    name={`items.${index}.quantityApproved`}
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    min="1"
                                    max={item.quantityRequested}
                                  />
                                  <div className="text-xs text-gray-500 mt-1">
                                    Requested: {item.quantityRequested}
                                  </div>
                                  <ErrorMessage name={`items.${index}.quantityApproved`} component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="flex items-center mt-6">
                                  <Field
                                    type="checkbox"
                                    name={`items.${index}.isStockItem`}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <label className="ml-2 text-sm text-gray-700">
                                    Stock Item Available
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Approval Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approval Remarks
                    </label>
                    <Field
                      name="approvalRemarks"
                      as="textarea"
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Add any remarks or special instructions..."
                    />
                    <ErrorMessage name="approvalRemarks" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" color="green" disabled={isSubmitting || loading}>
                    <div className="flex items-center gap-2">
                      <FaSave />
                      {isSubmitting || loading ? 'Processing...' : 'Confirm Approval'}
                    </div>
                  </Button>
                  <Button variant="outlined" onClick={() => setShowApproveDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogBody>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} handler={setShowRejectDialog} size="md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FaThumbsDown className="text-red-500" />
            Reject Spare Part Request - {selectedRequest?.requestNumber}
          </div>
        </DialogHeader>
        <DialogBody divider>
          <Formik
            initialValues={{ rejectionReason: '' }}
            validationSchema={Yup.object({
              rejectionReason: Yup.string().required('Rejection reason is required').min(10, 'Please provide a detailed reason (minimum 10 characters)')
            })}
            onSubmit={handleReject}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason *
                  </label>
                  <Field
                    name="rejectionReason"
                    as="textarea"
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Please provide a detailed reason for rejecting this request..."
                  />
                  <ErrorMessage name="rejectionReason" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" color="red" disabled={isSubmitting || loading}>
                    <div className="flex items-center gap-2">
                      <FaBan />
                      {isSubmitting || loading ? 'Processing...' : 'Confirm Rejection'}
                    </div>
                  </Button>
                  <Button variant="outlined" onClick={() => setShowRejectDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogBody>
      </Dialog>
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

export default ViewRequest;