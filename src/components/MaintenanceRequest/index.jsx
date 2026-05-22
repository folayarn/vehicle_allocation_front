import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Dialog, DialogHeader, DialogBody, DialogFooter, Alert, Textarea, Spinner } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaTimes, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaCar, 
  FaCalendarAlt,
  FaUser,
  FaClipboardList,
  FaWrench,
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaClock,
  FaFlag,
  FaEnvelope,
  FaCheckDouble,
  FaUserCheck
} from 'react-icons/fa';
import {  MdSpeed, MdWarning, MdSchedule, MdPending, MdDone, MdCancel } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateMaintenanceRequestThunk, 
  UpdateMaintenanceRequestThunk, 
  DeleteMaintenanceRequestThunk,
  FetchMaintenanceRequestByVehicleThunk,
  AcknowledgeMaintenanceRequestThunk
} from '../../store/thunks/MaintenanceRequestThunk';
import moment from 'moment';
import { FaBuildingLock } from 'react-icons/fa6';

const MaintenanceRequestForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: maintenanceRequestsList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false);
  const [selectedRequestForAcknowledge, setSelectedRequestForAcknowledge] = useState(null);
  const [acknowledgeRemarks, setAcknowledgeRemarks] = useState('');
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Get user role from session storage
  const userRole = sessionStorage.getItem("role");
  const isAllocator = userRole?.toLowerCase() === 'allocator';

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchMaintenanceRequestByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  useEffect(() => {
    if (maintenanceRequestsList) {
      const pending = maintenanceRequestsList.filter(req => req.status === 'Pending').length;
      setPendingCount(pending);
    }
  }, [maintenanceRequestsList]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(200, 'Title cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Request title is required'),
    body: Yup.string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .required('Request description is required'),
  });

  const initialValues = {
    title: selectedRequest?.title || '',
    body: selectedRequest?.body || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const submitData = {
        ...values,
        vehicleId: vehicleId,
        userId: sessionStorage.getItem("e"),
        status: 'Pending',
      };

      if (isEditMode && selectedRequest?.id) {
        await dispatch(UpdateMaintenanceRequestThunk({ id: selectedRequest.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateMaintenanceRequestThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedRequest(null);
      dispatch(FetchMaintenanceRequestByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving maintenance request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      try {
        await dispatch(DeleteMaintenanceRequestThunk(requestId)).unwrap();
        dispatch(FetchMaintenanceRequestByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting maintenance request:', error);
      }
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedRequest(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleAcknowledgeClick = (request) => {
    setSelectedRequestForAcknowledge(request);
    setAcknowledgeRemarks('');
    setShowAcknowledgeDialog(true);
  };

  const handleAcknowledgeSubmit = async () => {
    try {
      await dispatch(AcknowledgeMaintenanceRequestThunk({
        id: selectedRequestForAcknowledge.id,
        remark:acknowledgeRemarks
        
      })).unwrap();
      
      setShowAcknowledgeDialog(false);
      setSelectedRequestForAcknowledge(null);
      setAcknowledgeRemarks('');
      dispatch(FetchMaintenanceRequestByVehicleThunk(vehicleId));
      
     
    } catch (error) {
      console.error('Error acknowledging request:', error);
    }
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { icon: <MdPending className="text-yellow-500" />, color: 'yellow', label: 'Pending' };
      case 'acknowledged':
        return { icon: <FaUserCheck className="text-purple-500" />, color: 'purple', label: 'Acknowledged' };
      case 'in progress':
        return { icon: <FaClock className="text-blue-500" />, color: 'blue', label: 'In Progress' };
      case 'approved':
        return { icon: <FaCheckCircle className="text-green-500" />, color: 'green', label: 'Approved' };
      case 'rejected':
        return { icon: <MdCancel className="text-red-500" />, color: 'red', label: 'Rejected' };
      case 'completed':
        return { icon: <MdDone className="text-teal-500" />, color: 'teal', label: 'Completed' };
      default:
        return { icon: <MdPending className="text-gray-500" />, color: 'gray', label: status || 'Unknown' };
    }
  };

  // Get request type icon based on title
  const getRequestIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('oil') || titleLower.includes('lube')) return <FaWrench className="text-blue-500" />;
    if (titleLower.includes('brake')) return <FaBuildingLock className="text-red-500" />;
    if (titleLower.includes('engine')) return <FaTools className="text-orange-500" />;
    if (titleLower.includes('electrical')) return <FaClipboardList className="text-yellow-500" />;
    if (titleLower.includes('body') || titleLower.includes('paint')) return <MdSpeed className="text-purple-500" />;
    return <FaBuildingLock className="text-teal-500" />;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Request options suggestions
  const requestOptions = [
    { value: 'OIL CHANGE REQUEST', label: 'Oil Change Request' },
    { value: 'BRAKE PAD REPLACEMENT REQUEST', label: 'Brake Pad Replacement Request' },
    { value: 'ENGINE TUNE-UP REQUEST', label: 'Engine Tune-Up Request' },
    { value: 'BATTERY REPLACEMENT REQUEST', label: 'Battery Replacement Request' },
    { value: 'FILTER REPLACEMENT REQUEST', label: 'Filter Replacement Request' },
    { value: 'COOLING SYSTEM SERVICE REQUEST', label: 'Cooling System Service Request' },
    { value: 'TIRE ROTATION REQUEST', label: 'Tire Rotation Request' },
    { value: 'TRANSMISSION SERVICE REQUEST', label: 'Transmission Service Request' },
    { value: 'BELT REPLACEMENT REQUEST', label: 'Belt Replacement Request' },
    { value: 'SPARK PLUG REPLACEMENT REQUEST', label: 'Spark Plug Replacement Request' },
    { value: 'EXHAUST SYSTEM REPAIR REQUEST', label: 'Exhaust System Repair Request' },
    { value: 'SUSPENSION REPAIR REQUEST', label: 'Suspension Repair Request' },
    { value: 'ELECTRICAL DIAGNOSTICS REQUEST', label: 'Electrical Diagnostics Request' },
    { value: 'AC SERVICE REQUEST', label: 'Air Conditioning Service Request' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaClipboardList className="w-6 h-6 text-blue-500" />
                Maintenance Requests
                {isAllocator && (
                  <Chip value="Allocator View" size="sm" color="purple" variant="ghost" />
                )}
              </Typography>
              <Typography variant="small" color="gray" className="flex items-center gap-2">
                <FaCar className="w-4 h-4" />
                Vehicle: {vehicleData?.chassisNumber || 'N/A'} | {vehicleData?.vehicleTypeModel || 'N/A'}
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
          {/* Pending Requests Alert - Only for non-allocator */}
          {!isAllocator && pendingCount > 0 && (
            <Alert 
              color="yellow" 
              className="mb-6"
              icon={<MdWarning />}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <Typography variant="small" className="font-medium">
                    You have {pendingCount} pending maintenance request{pendingCount > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="small">
                    Awaiting approval from maintenance team
                  </Typography>
                </div>
                <Button 
                  size="sm" 
                  color="yellow"
                  onClick={handleAddNew}
                >
                  Create New Request
                </Button>
              </div>
            </Alert>
          )}

          {/* Pending Requests Alert for Allocator */}
          {isAllocator && pendingCount > 0 && (
            <Alert 
              color="blue" 
              className="mb-6"
              icon={<FaUserCheck />}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <Typography variant="small" className="font-medium">
                    {pendingCount} pending maintenance request{pendingCount > 1 ? 's' : ''} awaiting acknowledgement
                  </Typography>
                  <Typography variant="small">
                    Please review and acknowledge the requests to start processing
                  </Typography>
                </div>
              </div>
            </Alert>
          )}

          {/* Add New Request Button - Hide for allocator */}
          {!isAllocator && (
            <div className="mb-6 flex justify-between items-center">
              <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
                <FaHistory className="w-5 h-5" />
                Request History ({maintenanceRequestsList?.length || 0})
              </Typography>
              <Button
                onClick={handleAddNew}
                className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600"
                size="sm"
              >
                <FaPlus className="w-4 h-4" />
                New Maintenance Request
              </Button>
            </div>
          )}

          {/* For allocator, show different header */}
          {isAllocator && (
            <div className="mb-6">
              <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
                <FaCheckDouble className="w-5 h-5" />
                Requests Awaiting Acknowledgement ({maintenanceRequestsList?.filter(r => r.status === 'Pending').length || 0})
              </Typography>
            </div>
          )}

          {/* Error Alert */}
          {postError && (
            <Alert color="red" className="mb-4">
              {postError}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {/* Request Form Modal - Only for non-allocator */}
          {!isAllocator && (
            <Dialog open={showForm} handler={setShowForm} size="lg">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {isEditMode ? <FaEdit className="text-blue-500" /> : <FaClipboardList className="text-blue-500" />}
                  {isEditMode ? 'Edit Maintenance Request' : 'New Maintenance Request'}
                </div>
              </DialogHeader>
              <DialogBody divider>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                    <Form className="space-y-4">
                      {/* Request Title with Suggestions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Type/Title *
                        </label>
                        <div className="relative">
                          <FaWrench className="absolute left-3 top-3 text-blue-400" />
                          <Field
                            name="title"
                            as="select"
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              setFieldValue('title', e.target.value);
                            }}
                          >
                            <option value="">Select request type or enter custom</option>
                            {requestOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <Field
                          name="title"
                          as={Input}
                          label="Or enter custom request title"
                          size="lg"
                          className="mt-2"
                          onChange={(e) => {
                            setFieldValue('title', e.target.value.toUpperCase());
                          }}
                        />
                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Description/Body */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Details *
                        </label>
                        <div className="relative">
                          <FaBuildingLock className="absolute left-3 top-3 text-gray-400" />
                          <Field
                            name="body"
                            as="textarea"
                            rows="8"
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please describe the maintenance issue in detail. Include:
- Symptoms or problems observed
- When the issue started
- Any error messages or warning lights
- Steps to reproduce the issue (if applicable)
- Any temporary fixes attempted"
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Characters: {values.body?.length || 0}/2000
                        </div>
                        <ErrorMessage name="body" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Info Alert */}
                      <Alert color="blue" className="mt-4">
                        <div className="flex items-start gap-2">
                          <FaEnvelope className="mt-0.5" />
                          <div>
                            <Typography variant="small" className="font-medium">
                              Request Process
                            </Typography>
                            <Typography variant="small">
                              Your request will be reviewed by the maintenance team. You'll receive updates 
                              when the status changes. Urgent requests will be prioritized.
                            </Typography>
                          </div>
                        </div>
                      </Alert>

                      {/* Form Actions */}
                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={isSubmitting || postLoading}
                        >
                          <div className="flex items-center gap-2">
                            <FaSave />
                            {isSubmitting || postLoading ? 'Submitting...' : (isEditMode ? 'Update Request' : 'Submit Request')}
                          </div>
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={() => {
                            setShowForm(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </DialogBody>
            </Dialog>
          )}

          {/* Acknowledge Dialog for Allocator */}
          <Dialog open={showAcknowledgeDialog} handler={setShowAcknowledgeDialog} size="md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <FaUserCheck className="text-purple-500" />
                Acknowledge Maintenance Request
              </div>
            </DialogHeader>
            <DialogBody divider>
              <div className="space-y-4">
                <div>
                  <Typography variant="small" className="font-medium mb-2">
                    Request Details
                  </Typography>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p><strong>Title:</strong> {selectedRequestForAcknowledge?.title}</p>
                    <p className="mt-2"><strong>Description:</strong></p>
                    <p className="text-sm text-gray-600">{selectedRequestForAcknowledge?.body}</p>
                    <p className="mt-2"><strong>Submitted By:</strong> {selectedRequestForAcknowledge?.user?.name || 'N/A'}</p>
                    <p><strong>Submitted On:</strong> {moment(selectedRequestForAcknowledge?.created).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acknowledgement Remarks (Optional)
                  </label>
                  <Textarea
                    value={acknowledgeRemarks}
                    onChange={(e) => setAcknowledgeRemarks(e.target.value)}
                    rows="3"
                    placeholder="Add any remarks about the request, estimated timeline, or next steps..."
                  />
                </div>

                <Alert color="purple" className="mt-2">
                  <Typography variant="small">
                    By acknowledging this request, you confirm that you have reviewed it and will assign it to the appropriate maintenance team.
                  </Typography>
                </Alert>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button 
                variant="outlined" 
                onClick={() => setShowAcknowledgeDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAcknowledgeSubmit}
                className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
              >
                <FaCheckDouble />
                Acknowledge Request
              </Button>
            </DialogFooter>
          </Dialog>

          {/* Maintenance Requests Cards View */}
          {maintenanceRequestsList && maintenanceRequestsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceRequestsList.map((request, index) => {
                const statusConfig = getStatusConfig(request.status);
                return (
                  <Card key={request.id} className="p-4 hover:shadow-lg transition-shadow">
                    {/* Header with Icon and Status */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getRequestIcon(request.title)}
                        <Typography variant="h6" color="blue-gray">
                          {request.title}
                        </Typography>
                      </div>
                      <Chip
                        value={statusConfig.label}
                        size="sm"
                        color={statusConfig.color}
                        icon={statusConfig.icon}
                        variant="ghost"
                      />
                    </div>

                    {/* Request Details */}
                    <div className="mb-3">
                      <Typography variant="small" color="gray" className="whitespace-pre-wrap">
                        {truncateText(request.body, 150)}
                      </Typography>
                    </div>

                    {/* Footer with Meta and Actions */}
                    <div className="border-t pt-3 mt-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaUser className="w-3 h-3" />
                            <span>{request.user?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>{moment(request.created).format('DD/MM/YYYY')}</span>
                          </div>
                        </div>
                        
                        {/* Actions based on role and status */}
                        <div className="flex gap-2">
                          {/* For allocator: Show acknowledge button for pending requests */}
                          {isAllocator && request.status?.toLowerCase() === 'pending' && (
                            <button
                              onClick={() => handleAcknowledgeClick(request)}
                              className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
                              title="Acknowledge Request"
                            >
                              <FaUserCheck />
                              <span className="text-xs">Acknowledge</span>
                            </button>
                          )}
                          
                          {/* For regular users: Show edit/delete for pending requests */}
                          {!isAllocator && request.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleEdit(request)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit Request"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Delete Request"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Show acknowledged info if applicable */}
                      {request.acknowledgedBy && (
                        <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                          <FaUserCheck className="w-3 h-3" />
                          Acknowledged by {request.acknowledgedByName || 'Allocator'} on {moment(request.acknowledgedAt).format('DD/MM/YYYY HH:mm')}
                          {request.acknowledgementRemarks && (
                            <span className="text-gray-500 ml-2">Note: {request.acknowledgementRemarks}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Typography variant="h6" color="gray">
                No maintenance requests found
              </Typography>
              {!isAllocator && (
                <Typography variant="small" color="gray" className="mt-2">
                  Click the "New Maintenance Request" button to submit a maintenance request for this vehicle
                </Typography>
              )}
              {isAllocator && (
                <Typography variant="small" color="gray" className="mt-2">
                  There are no pending maintenance requests to acknowledge
                </Typography>
              )}
            </div>
          )}

          {/* Request Summary Statistics */}
          {maintenanceRequestsList && maintenanceRequestsList.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
                Request Summary
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Total Requests
                  </Typography>
                  <Typography variant="h5" color="blue-gray">
                    {maintenanceRequestsList.length}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Pending
                  </Typography>
                  <Typography variant="h5" color="yellow">
                    {maintenanceRequestsList.filter(r => r.status === 'Pending').length}
                  </Typography>
                </div>
                {isAllocator && (
                  <div className="text-center">
                    <Typography variant="small" color="gray">
                      Acknowledged
                    </Typography>
                    <Typography variant="h5" color="purple">
                      {maintenanceRequestsList.filter(r => r.status === 'Acknowledged').length}
                    </Typography>
                  </div>
                )}
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Approved/Completed
                  </Typography>
                  <Typography variant="h5" color="green">
                    {maintenanceRequestsList.filter(r => r.status === 'Approved' || r.status === 'Completed').length}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Rejected
                  </Typography>
                  <Typography variant="h5" color="red">
                    {maintenanceRequestsList.filter(r => r.status === 'Rejected').length}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
          <Button
            variant="outlined"
            color="blue"
            onClick={() => setOpen(false)}
            className="border-blue-500 text-blue-500 flex items-center gap-2 hover:bg-blue-50"
          >
            <FaTimes className="w-4 h-4" />
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MaintenanceRequestForm;