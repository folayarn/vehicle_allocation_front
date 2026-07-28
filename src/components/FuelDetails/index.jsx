// FuelRequestDetails.jsx
import React from 'react'
import { Card, Button, Chip, Typography, Input, Textarea } from "@material-tailwind/react";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaPlus, FaGasPump, FaCheckCircle, FaTimesCircle, FaClock, 
  FaPrint, FaFileExport, FaFilter, FaEye, FaPencilAlt, FaTrash,
  FaCar, FaUser, FaMapMarkerAlt, FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";
import moment from "moment";

// Import thunks
import { FetchServerTableThunk } from "../../store/thunks/ServerTableThunk";
import { 
  ApproveFuelRequestThunk, 
  DispenseFuelRequestThunk,
  CancelFuelRequestThunk,
} from "../../store/thunks/FuelRequestThunk";

// Import Modal
import ModalComponent from "../../components/Modal";

const FuelRequestDetails = ({ 
  selectedRequest = null, 
  onClose, 
  fetchFuelRequests,
  userId 
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDispenseModal, setOpenDispenseModal] = useState(false);
  
  // Approve/Cancel/Dispense form states
  const [approveData, setApproveData] = useState({
    userId: sessionStorage.getItem("e") || '',
    approvedQuantity: selectedRequest?.requestedQuantity || 0,
    remarks: ''
  });

  const [cancelData, setCancelData] = useState({
    userId: sessionStorage.getItem("e") || '',
    reason: ''
  });

  const [dispenseData, setDispenseData] = useState({
    userId: sessionStorage.getItem("e") || ''
  });

  // Reset form data when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      setApproveData({
        userId: sessionStorage.getItem("e") || '',
        approvedQuantity: selectedRequest.requestedQuantity || 0,
        remarks: ''
      });
      setCancelData({
        userId: sessionStorage.getItem("e") || '',
        reason: ''
      });
      setDispenseData({
        userId: sessionStorage.getItem("e") || '',
      });
    }
  }, [selectedRequest, userId]);

  // Approve Handler
  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    
    if (approveData.approvedQuantity <= 0) {
      alert('Approved quantity must be greater than 0');
      return;
    }
    if (approveData.approvedQuantity > selectedRequest.requestedQuantity) {
      alert(`Approved quantity cannot exceed ${selectedRequest.requestedQuantity} L`);
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(ApproveFuelRequestThunk({
        id: selectedRequest.id,
        data: approveData
      })).unwrap();
      
      setOpenApproveModal(false);
       fetchFuelRequests();
     
      onClose();
    } catch (error) {
      console.error('Error approving fuel request:', error);
      alert(error?.message || 'Error approving fuel request. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Cancel Handler
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    
    if (!cancelData.reason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(CancelFuelRequestThunk({
        id: selectedRequest.id,
        data: cancelData
      })).unwrap();
      
      setOpenCancelModal(false);
       fetchFuelRequests();
      onClose();
    } catch (error) {
      console.error('Error cancelling fuel request:', error);
      alert(error?.message || 'Error cancelling fuel request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dispense Handler
  const handleDispenseSubmit = async () => {
    
     if(confirm(`Are you sure you want to dispense fuel for request #${selectedRequest.requestNumber}?`)) {
    setLoading(true);
    try {
      await dispatch(DispenseFuelRequestThunk(
        {id: selectedRequest.id}
      )).unwrap();
      
      setOpenDispenseModal(false);
       fetchFuelRequests();
      onClose();
    } catch (error) {
      console.error('Error dispensing fuel:', error);
      alert(error?.message || 'Error dispensing fuel. Please try again.');
    } finally {
      setLoading(false);
    }
}
  };

 
const role = sessionStorage.getItem("role") || '';
  return (
    <>
      {/* Main Details View */}
      <div className="p-6">
        {/* Header with Request Number and Status */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              {selectedRequest.requestNumber || "N/A"}
            </Typography>
            <Typography variant="small" color="gray">
              Created: {selectedRequest.createdAt ? moment(selectedRequest.createdAt).format("DD-MM-YYYY HH:mm") : "N/A"}
            </Typography>
          </div>
          <Chip 
            value={selectedRequest.status || "Pending"} 
            color={
              selectedRequest.status === 'Approved' ? 'green' :
              selectedRequest.status === 'Rejected' ? 'red' :
              selectedRequest.status === 'Dispensed' ? 'blue' :
              selectedRequest.status === 'Cancelled' ? 'gray' : 'orange'
            }
            className="rounded-full px-4 py-1 text-sm font-semibold"
          />
        </div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Vehicle Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <FaCar className="text-blue-500" />
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Vehicle Information
                </Typography>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration:</span>
                  <span className="font-medium">{selectedRequest.vehicleAssessment?.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chassis:</span>
                  <span className="font-medium">{selectedRequest.vehicleAssessment?.chassisNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{selectedRequest.vehicleAssessment?.vehicleTypeModel || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Command:</span>
                  <span className="font-medium">{selectedRequest.vehicleAssessment?.command || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Requester Information */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <FaUser className="text-green-500" />
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Requester Information
                </Typography>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{selectedRequest.requesterName || "N/A"}</span>
                </div>
              
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span className="font-medium">{selectedRequest.createdAt ? moment(selectedRequest.createdAt).format("DD-MM-YYYY HH:mm") : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Fuel Details */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-3">
                <FaGasPump className="text-yellow-600" />
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Fuel Details
                </Typography>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <Chip 
                    value={selectedRequest.fuelType || "N/A"} 
                    color={
                      selectedRequest.fuelType === 'Petrol' ? 'blue' :
                      selectedRequest.fuelType === 'Diesel' ? 'green' :
                      selectedRequest.fuelType === 'CNG' ? 'orange' : 'purple'
                    }
                    size="sm"
                    className="rounded-full"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested Quantity:</span>
                  <span className="font-bold text-blue-600">{selectedRequest.requestedQuantity?.toFixed(1) || 0} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved Quantity:</span>
                  <span className="font-bold text-green-600">{selectedRequest.approvedQuantity?.toFixed(1) || 0} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Mileage:</span>
                  <span className="font-medium">{selectedRequest.currentMileage?.toLocaleString() || 0} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Date:</span>
                  <span className="font-medium">{selectedRequest.requiredDate ? moment(selectedRequest.requiredDate).format("DD-MM-YYYY") : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-purple-500" />
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Trip Details
                </Typography>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 block">Purpose:</span>
                  <span className="font-medium">{selectedRequest.purpose || "N/A"}</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information - Full Width */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Remarks */}
            {selectedRequest.remarks && (
              <div className="bg-gray-50 rounded-lg p-3">
                <Typography variant="small" color="gray" className="font-semibold mb-1">
                  Remarks:
                </Typography>
                <Typography variant="body2">{selectedRequest.remarks}</Typography>
              </div>
            )}

            {/* Approval Details */}
            {(selectedRequest.approvedBy || selectedRequest.dispensedBy) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <Typography variant="small" color="gray" className="font-semibold mb-1">
                  Approval Details:
                </Typography>
                {selectedRequest.approvedBy && (
                  <div className="text-sm">
                    <span className="text-gray-600">Approved By:</span> {selectedRequest.approvedBy}
                    <span className="text-gray-600 ml-2">on</span> {selectedRequest.approvedDate ? moment(selectedRequest.approvedDate).format("DD-MM-YYYY HH:mm") : "N/A"}
                  </div>
                )}
                {selectedRequest.dispensedBy && (
                  <div className="text-sm">
                    <span className="text-gray-600">Dispensed By:</span> {selectedRequest.dispensedBy}
                    <span className="text-gray-600 ml-2">on</span> {selectedRequest.dispensedDate ? moment(selectedRequest.dispensedDate).format("DD-MM-YYYY HH:mm") : "N/A"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap justify-end gap-2">
          {selectedRequest.status === 'Pending' && role === "allocator" && (
            <>
              <Button 
                color="green" 
                size="sm"
                onClick={() => setOpenApproveModal(true)}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <FaCheckCircle className="w-4 h-4" />
                Approve
              </Button>

              <Button 
                color="gray" 
                size="sm"
                variant="outlined"
                onClick={() => setOpenCancelModal(true)}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <FaTimesCircle className="w-4 h-4" />
                Cancel Request
              </Button>
            </>
          )}
          
          {selectedRequest.status === 'Approved' && role === "store" && (
            <Button 
              color="blue" 
              size="sm"
              onClick={handleDispenseSubmit}
              disabled={loading}
              className="flex items-center gap-1"
            >
                {loading ? (<FaSpinner className="w-4 h-4 animate-spin" />) : (
                  <FaGasPump className="w-4 h-4" />
                )}
                Dispense Fuel
            </Button>
          )}

          <Button 
            color="gray" 
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Approve Modal */}
      <ModalComponent 
        size={"md"} 
        open={openApproveModal} 
        setOpen={setOpenApproveModal} 
        title="Approve Fuel Request"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Approve Fuel Request
              </Typography>
              <Typography variant="small" color="gray">
                Request #{selectedRequest.requestNumber}
              </Typography>
            </div>
            <Chip 
              value={selectedRequest.status || "Pending"} 
              color="orange"
              className="rounded-full px-4 py-1 text-sm font-semibold"
            />
          </div>

          {/* Request Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FaCar className="text-blue-500" />
                <Typography variant="small" className="font-semibold">
                  Vehicle
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.vehicleTypeModel || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <FaGasPump className="text-yellow-600" />
                <Typography variant="small" className="font-semibold">
                  Fuel Details
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{selectedRequest.fuelType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-bold text-blue-600">{selectedRequest.requestedQuantity?.toFixed(1) || 0} L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Form */}
          <form onSubmit={handleApproveSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approved Quantity (Liters) *
                </label>
                <Input
                  type="number"
                  value={approveData.approvedQuantity}
                  onChange={(e) => setApproveData({ 
                    ...approveData, 
                    approvedQuantity: parseFloat(e.target.value) || 0 
                  })}
                  min={0.01}
                  max={selectedRequest.requestedQuantity}
                  step={0.01}
                  label="Enter approved quantity"
                  required
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <Typography variant="small" color="gray">
                    Max: {selectedRequest.requestedQuantity?.toFixed(1)} L
                  </Typography>
                  {approveData.approvedQuantity < selectedRequest.requestedQuantity && (
                    <Typography variant="small" color="orange" className="font-medium">
                      ⚠️ Partial approval
                    </Typography>
                  )}
                  {approveData.approvedQuantity === selectedRequest.requestedQuantity && (
                    <Typography variant="small" color="green" className="font-medium">
                      ✓ Full approval
                    </Typography>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <Textarea
                  value={approveData.remarks}
                  onChange={(e) => setApproveData({ 
                    ...approveData, 
                    remarks: e.target.value 
                  })}
                  label="Add remarks (optional)"
                  rows={2}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="submit" 
                  color="green"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <FaCheckCircle className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Approve Request'}
                </Button>

                

                <Button 
                  type="button"
                  color="gray"
                  variant="outlined"
                  onClick={() => setOpenApproveModal(false)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </ModalComponent>

      {/* Cancel Modal */}
      <ModalComponent 
        size={"md"} 
        open={openCancelModal} 
        setOpen={setOpenCancelModal} 
        title="Cancel Fuel Request"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                Cancel Fuel Request
              </Typography>
              <Typography variant="small" color="gray">
                Request #{selectedRequest.requestNumber}
              </Typography>
            </div>
            <Chip 
              value={selectedRequest.status || "Pending"} 
              color="orange"
              className="rounded-full px-4 py-1 text-sm font-semibold"
            />
          </div>

          {/* Warning Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 text-xl mt-0.5" />
              <div>
                <Typography variant="h6" color="red" className="font-semibold">
                  Warning: This action cannot be undone
                </Typography>
                <Typography variant="small" color="gray">
                  Cancelling this request will permanently remove it from the approval process.
                </Typography>
              </div>
            </div>
          </div>

          {/* Request Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FaCar className="text-blue-500" />
                <Typography variant="small" className="font-semibold">
                  Vehicle
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.vehicleTypeModel || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <FaGasPump className="text-yellow-600" />
                <Typography variant="small" className="font-semibold">
                  Fuel Details
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{selectedRequest.fuelType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-bold text-blue-600">{selectedRequest.requestedQuantity?.toFixed(1) || 0} L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Form */}
          <form onSubmit={handleCancelSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Cancellation *
                </label>
                <Textarea
                  value={cancelData.reason}
                  onChange={(e) => setCancelData({ 
                    ...cancelData, 
                    reason: e.target.value 
                  })}
                  label="Please provide a detailed reason for cancellation"
                  rows={3}
                  required
                  className="w-full"
                />
                <Typography variant="small" color="gray" className="mt-1">
                  This reason will be recorded and visible to the requester.
                </Typography>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="submit" 
                  color="red"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <FaTimesCircle className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Confirm Cancellation'}
                </Button>

                <Button 
                  type="button"
                  color="gray"
                  variant="outlined"
                  onClick={() => setOpenCancelModal(false)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </div>
      </ModalComponent>

      {/* Dispense Modal */}
      <ModalComponent 
        size={"md"} 
        open={openDispenseModal} 
        setOpen={setOpenDispenseModal} 
        title="Dispense Fuel"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold flex items-center gap-2">
                <FaGasPump className="text-blue-500" />
                Dispense Fuel
              </Typography>
              <Typography variant="small" color="gray">
                Request #{selectedRequest.requestNumber}
              </Typography>
            </div>
            <Chip 
              value={selectedRequest.status || "Pending"} 
              color="green"
              className="rounded-full px-4 py-1 text-sm font-semibold"
            />
          </div>

          {/* Request Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FaCar className="text-blue-500" />
                <Typography variant="small" className="font-semibold">
                  Vehicle
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{selectedRequest.vehicle?.vehicleTypeModel || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <FaGasPump className="text-yellow-600" />
                <Typography variant="small" className="font-semibold">
                  Fuel Details
                </Typography>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{selectedRequest.fuelType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved:</span>
                  <span className="font-bold text-green-600">{selectedRequest.approvedQuantity?.toFixed(1) || 0} L</span>
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </ModalComponent>
    </>
  );
};

export default FuelRequestDetails;