import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Dialog, DialogHeader, DialogBody, DialogFooter, Alert, Textarea, IconButton } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaTimes, 
  FaTrash, 
  FaEdit, 
  FaSave, 
  FaCar, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaRoad,
  FaFileAlt,
  FaUser,
  FaClipboardList,
  FaChartLine,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaCommentDots,
  FaInfoCircle
} from 'react-icons/fa';
import { MdLocationOn, MdSpeed, MdAssignment, MdVerifiedUser, MdCancel, MdCheckCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateLogBookThunk, 
  UpdateLogBookThunk, 
  DeleteLogBookThunk,
  FetchLogBooksByVehicleThunk,
  ApproveLogBookThunk,
  RejectLogBookThunk
} from '../../store/thunks/LogBookThunk';
import moment from 'moment';

const LogBookForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: logBookList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedLogForAction, setSelectedLogForAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [single, setSingle] = useState({});
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchLogBooksByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    from: Yup.string()
      .max(200, 'Starting location cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Starting location is required'),
    to: Yup.string()
      .max(200, 'Destination cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Destination is required'),
    mileageBefore: Yup.number()
      .min(0, 'Mileage must be a positive number')
      .required('Mileage before trip is required'),
    mileageAfter: Yup.number()
      .min(0, 'Mileage must be a positive number')
      .required('Mileage after trip is required')
      .test('is-greater', 'Mileage after must be greater than mileage before', function(value) {
        return value > this.parent.mileageBefore;
      }),
    officerCarried: Yup.string()
      .max(200, 'Officer name cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Officer carried is required'),
    purpose: Yup.string()
      .max(500, 'Purpose cannot exceed 500 characters')
      .required('Purpose of trip is required'),
    timeOut: Yup.string()
      .required('Time out is required'),
    timeIn: Yup.string()
      .required('Time in is required'),
    
    remarks: Yup.string()
      .max(500, 'Remarks cannot exceed 500 characters')
      .nullable(),
  });

  const initialValues = {
    from: selectedLog?.from || '',
    to: selectedLog?.to || '',
    mileageBefore: selectedLog?.mileageBefore || '',
    mileageAfter: selectedLog?.mileageAfter || '',
    officerCarried: selectedLog?.officerCarried || '',
    purpose: selectedLog?.purpose || '',
    timeOut: selectedLog?.timeOut || '',
    timeIn: selectedLog?.timeIn || '',
    remarks: selectedLog?.remarks || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const submitData = {
        ...values,
        vehicleId: vehicleId,
        userId: sessionStorage.getItem('e'),
        chassisNumber: vehicleData?.chassisNumber || '',
        status: 'Pending' // New logs start as pending
      };

      if (isEditMode && selectedLog?.id) {
        await dispatch(UpdateLogBookThunk({ id: selectedLog.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateLogBookThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedLog(null);
      dispatch(FetchLogBooksByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving log entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      try {
        await dispatch(DeleteLogBookThunk(logId)).unwrap();
        dispatch(FetchLogBooksByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting log entry:', error);
      }
    }
  };

  const handleEdit = (log) => {
    // if (log.status !== 'Pending') {
    //   alert('Only pending logs can be edited');
    //   return;
    // }
    setSelectedLog(log);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedLog(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleViewDetails = (log) => {
    setSingle(log);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (log) => {
    setSelectedLogForAction(log);
    setShowApprovalDialog(true);
  };

  const confirmApprove = async () => {
    setActionLoading(true);
    try {
      await dispatch(ApproveLogBookThunk({
        id: selectedLogForAction?.id,
        
      })).unwrap();
      setShowApprovalDialog(false);
      dispatch(FetchLogBooksByVehicleThunk(vehicleData?.id));
    
    } catch (error) {
      console.error('Error approving log:', error);
    
    } finally {
      setActionLoading(false);
      setSelectedLogForAction(null);
    }
  };

  const handleReject = (log) => {
    setSelectedLogForAction(log);
    setRejectionReason('');
    setShowRejectionDialog(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(true);
    try {
      await dispatch(RejectLogBookThunk({
        id: selectedLogForAction?.id,
        
          reason: rejectionReason
        }
      )).unwrap();
      setShowRejectionDialog(false);
      setRejectionReason('');
      dispatch(FetchLogBooksByVehicleThunk(vehicleData?.id));
      
    } catch (error) {
      console.error('Error rejecting log:', error);
    
    } finally {
      setActionLoading(false);
      setSelectedLogForAction(null);
    }
  };

  // Calculate total distance for each trip
  const calculateDistance = (mileageBefore, mileageAfter) => {
    if (mileageBefore && mileageAfter) {
      return (mileageAfter - mileageBefore).toFixed(2);
    }
    return 0;
  };

  // Calculate duration between time out and time in
  const calculateDuration = (timeOut, timeIn) => {
    if (timeOut && timeIn) {
      const start = moment(timeOut, 'HH:mm');
      const end = moment(timeIn, 'HH:mm');
      const duration = moment.duration(end.diff(start));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-500';
      case 'Approved': return 'bg-green-600';
      case 'Rejected': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FaSpinner className="animate-spin" />;
      case 'Approved': return <FaCheckCircle />;
      case 'Rejected': return <FaTimesCircle />;
      default: return null;
    }
  };

  const role = sessionStorage.getItem('role');
  const isChiefDriver = role === 'chief_driver_com';
  const isDriver = role === 'driver';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaClipboardList className="w-6 h-6" />
                Vehicle Log Book
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
          {/* Add New Log Entry Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaChartLine className="w-5 h-5" />
              Trip Logs ({logBookList?.length || 0})
            </Typography>
            {isDriver && (
              <Button
                onClick={handleAddNew}
                className="bg-teal-500 flex items-center gap-2"
                size="sm"
              >
                <FaPlus className="w-4 h-4" />
                Add Trip Log
              </Button>
            )}
          </div>

          {/* Error Alert */}
          {postError && (
            <Alert color="red" className="mb-4">
              {postError}
            </Alert>
          )}

          {/* Log Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="xl"
          
          className="max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit /> : <FaPlus />}
                {isEditMode ? 'Edit Trip Log' : 'Add New Trip Log'}
              </div>
            </DialogHeader>
            <DialogBody divider>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                
                enableReinitialize={true}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {/* From Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From *
                      </label>
                      <div className="relative">
                        <MdLocationOn className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="from"
                          as={Input}
                          label="Starting Location"
                          size="lg"
                          className="pl-10"
                          onChange={(e) => {
                            setFieldValue('from', e.target.value.toUpperCase());
                          }}
                        />
                      </div>
                      <ErrorMessage name="from" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* To Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To *
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="to"
                          as={Input}
                          label="Destination"
                          size="lg"
                          className="pl-10"
                          onChange={(e) => {
                            setFieldValue('to', e.target.value.toUpperCase());
                          }}
                        />
                      </div>
                      <ErrorMessage name="to" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Mileage Before */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mileage Before (km) *
                      </label>
                      <div className="relative">
                        <MdSpeed className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="mileageBefore"
                          as={Input}
                          label="Starting Mileage"
                          size="lg"
                          type="number"
                          className="pl-10"
                        />
                      </div>
                      <ErrorMessage name="mileageBefore" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Mileage After */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mileage After (km) *
                      </label>
                      <div className="relative">
                        <MdSpeed className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="mileageAfter"
                          as={Input}
                          label="Ending Mileage"
                          size="lg"
                          type="number"
                          className="pl-10"
                        />
                      </div>
                      <ErrorMessage name="mileageAfter" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Officer Carried */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Officer Carried *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="officerCarried"
                          as={Input}
                          label="Officer Name"
                          size="lg"
                          className="pl-10"
                          onChange={(e) => {
                            setFieldValue('officerCarried', e.target.value.toUpperCase());
                          }}
                        />
                      </div>
                      <ErrorMessage name="officerCarried" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                   
                    {/* Time Out */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Out *
                      </label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="timeOut"
                          as={Input}
                          type="time"
                          label="Departure Time"
                          size="lg"
                          className="pl-10"
                        />
                      </div>
                      <ErrorMessage name="timeOut" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Time In */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time In *
                      </label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="timeIn"
                          as={Input}
                          type="time"
                          label="Return Time"
                          size="lg"
                          className="pl-10"
                        />
                      </div>
                      <ErrorMessage name="timeIn" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Purpose */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose of Trip *
                      </label>
                      <div className="relative">
                        <MdAssignment className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="purpose"
                          as="textarea"
                          rows="3"
                          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Describe the purpose of the trip..."
                        />
                      </div>
                      <ErrorMessage name="purpose" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Remarks */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <Field
                        name="remarks"
                        as="textarea"
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Any additional remarks..."
                      />
                      <ErrorMessage name="remarks" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Form Actions */}
                    <div className="lg:col-span-2 flex gap-4 mt-4">
                      <Button 
                        type="submit" 
                        className="bg-teal-500"
                        disabled={isSubmitting || postLoading}
                      >
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Log' : 'Add Log')}
                        </div>
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogBody>
          </Dialog>

          {/* Approval Confirmation Dialog */}
          <Dialog open={showApprovalDialog} handler={setShowApprovalDialog} size="sm">
            <DialogHeader>Confirm Approval</DialogHeader>
            <DialogBody>
              <div className="text-center">
                <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Approve Trip Log?
                </Typography>
                <Typography variant="small" color="gray">
                  Are you sure you want to approve this trip log? This action cannot be undone.
                </Typography>
                {selectedLogForAction && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md text-left">
                    <Typography variant="small" className="font-medium">
                      Route: {selectedLogForAction.from} → {selectedLogForAction.to}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Officer: {selectedLogForAction.officerCarried}
                    </Typography>
                  </div>
                )}
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setShowApprovalDialog(false)} className="mr-2">
                Cancel
              </Button>
              <Button color="green" onClick={confirmApprove} disabled={actionLoading}>
                {actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                Approve
              </Button>
            </DialogFooter>
          </Dialog>

          {/* Rejection Dialog with Reason */}
          <Dialog open={showRejectionDialog} handler={setShowRejectionDialog} size="md">
            <DialogHeader>Reject Trip Log</DialogHeader>
            <DialogBody>
              <div className="text-center">
                <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Provide Rejection Reason
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  Please explain why this trip log is being rejected
                </Typography>
                {selectedLogForAction && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <Typography variant="small" className="font-medium">
                      Trip: {selectedLogForAction.from} → {selectedLogForAction.to}
                    </Typography>
                  </div>
                )}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter detailed reason for rejection..."
                  />
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outlined" onClick={() => {
                setShowRejectionDialog(false);
                setRejectionReason('');
              }} className="mr-2">
                Cancel
              </Button>
              <Button color="red" onClick={confirmReject} disabled={actionLoading || !rejectionReason.trim()}>
                {actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTimesCircle className="mr-2" />}
                Reject
              </Button>
            </DialogFooter>
          </Dialog>

          {/* View Details Dialog */}
          <Dialog open={showDetailsDialog} handler={setShowDetailsDialog} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-teal-500" />
                Trip Log Details
              </div>
            </DialogHeader>
            <DialogBody divider>
              {single && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">From</Typography>
                      <Typography variant="small" className="font-medium">{single.from}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">To</Typography>
                      <Typography variant="small" className="font-medium">{single.to}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Mileage Before</Typography>
                      <Typography variant="small" className="font-medium">{single.mileageBefore} km</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Mileage After</Typography>
                      <Typography variant="small" className="font-medium">{single.mileageAfter} km</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Distance</Typography>
                      <Typography variant="small" className="font-medium">{calculateDistance(single.mileageBefore, single.mileageAfter)} km</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Officer Carried</Typography>
                      <Typography variant="small" className="font-medium">{single.officerCarried}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Time Out</Typography>
                      <Typography variant="small" className="font-medium">{single.timeOut}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Time In</Typography>
                      <Typography variant="small" className="font-medium">{single.timeIn}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Duration</Typography>
                      <Typography variant="small" className="font-medium">{calculateDuration(single.timeOut, single.timeIn)}</Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Authority No.</Typography>
                      <Typography variant="small" className="font-medium">{single.authorityNo || 'N/A'}</Typography>
                    </div>
                    <div className="col-span-2">
                      <Typography variant="small" color="gray" className="text-xs">Purpose</Typography>
                      <Typography variant="small" className="font-medium">{single.purpose}</Typography>
                    </div>
                    {single.remarks && (
                      <div className="col-span-2">
                        <Typography variant="small" color="gray" className="text-xs">Remarks</Typography>
                        <Typography variant="small" className="font-medium">{single.remarks}</Typography>
                      </div>
                    )}
                    {/* {single.reasonForRjection && (
                      <div className="col-span-2">
                        <Typography variant="small" color="gray" className="text-xs">Rejection Reason</Typography>
                        <Typography variant="small" className="font-medium text-red-600">{single.reasonForRjection}</Typography>
                      </div>
                    )} */}
                    {/* <div>
                      <Typography variant="small" color="gray" className="text-xs">Status</Typography>
                      <Chip value={single.status} size="sm" color={single.status === 'Approved' ? 'green' : single.status === 'Rejected' ? 'red' : 'orange'} />
                    </div> */}
                    <div>
                      <Typography variant="small" color="gray" className="text-xs">Created At</Typography>
                      <Typography variant="small" className="font-medium">{moment(single.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
                    </div>
                    {/* {single.approvedBy && (
                      <div>
                        <Typography variant="small" color="gray" className="text-xs">Approved By</Typography>
                        <Typography variant="small" className="font-medium">{single.approvedBy}</Typography>
                      </div>
                    )}
                    {single.rejectedBy && (
                      <div>
                        <Typography variant="small" color="gray" className="text-xs">Rejected By</Typography>
                        <Typography variant="small" className="font-medium">{single.rejectedBy}</Typography>
                      </div>
                    )} */}
                  </div>
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </Dialog>

          {/* Logs Table */}
          {logBookList && logBookList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="w-3 h-3" />
                        Route
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdSpeed className="w-3 h-3" />
                        Distance (km)
                      </div>
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-3 h-3" />
                        Officer
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-3 h-3" />
                        Status
                      </div>
                    </th> */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-3 h-3" />
                        Duration
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3" />
                        Date
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logBookList.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">
                          {log.from || 'N/A'} → {log.to || 'N/A'}
                        </div>
                        {/* {log.authorityNo && (
                          <div className="text-xs text-gray-500 mt-1">
                            Auth: {log.authorityNo}
                          </div>
                        )} */}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono font-medium">
                        {calculateDistance(log.mileageBefore, log.mileageAfter)} km
                      </td>
                      {/* <td className="px-4 py-3 text-sm">
                        {log.officerCarried || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${getStatusColor(log.status)} text-white text-xs`}>
                          {getStatusIcon(log.status)}
                          <span>{log.status || 'N/A'}</span>
                        </div> */}
                        {/* {log.rejectionReason && (
                          <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <FaCommentDots className="w-2 h-2" />
                            {log.rejectionReason.length > 30 ? log.rejectionReason.substring(0, 30) + '...' : log.rejectionReason}
                          </div>
                        )} */}
                      {/* </td> */}
                      <td className="px-4 py-3 text-sm">
                        <Chip
                          value={calculateDuration(log.timeOut, log.timeIn)}
                          size="sm"
                          color="teal"
                          className="w-fit"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {moment(log.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            color="gray"
                            onClick={() => handleViewDetails(log)}
                            className="flex items-center gap-1"
                          >
                            <FaEye className="w-3 h-3" />
                            View
                          </Button>
                          
                          {isDriver && (log.status === 'Pending' || log.status === 'Rejected')  && (
                            <>
                              <Button
                                size="sm"
                                color="blue"
                                onClick={() => handleEdit(log)}
                                className="flex items-center gap-1"
                              >
                                <FaEdit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                color="red"
                                onClick={() => handleDelete(log.id)}
                                className="flex items-center gap-1"
                              >
                                <FaTrash className="w-3 h-3" />
                                Delete
                              </Button>
                            </>
                          )}
{/* 
                          {isChiefDriver && log.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                color="green"
                                onClick={() => handleApprove(log)}
                                className="flex items-center gap-1"
                              >
                                <FaCheckCircle className="w-3 h-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="red"
                                onClick={() => handleReject(log)}
                                className="flex items-center gap-1"
                              >
                                <FaTimesCircle className="w-3 h-3" />
                                Reject
                              </Button>
                            </>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                No trip logs found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "Add Trip Log" button to record a new trip
              </Typography>
            </div>
          )}
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

export default LogBookForm;