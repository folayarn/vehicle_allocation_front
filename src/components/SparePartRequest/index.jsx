import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Dialog, DialogHeader, DialogBody, DialogFooter, Alert, Textarea, Spinner, Select, Option } from '@material-tailwind/react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
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
  FaBoxes,
  FaDollarSign,
  FaTruck,
  FaWarehouse,
  FaHourglassHalf,
  FaCheck,
  FaTimes as FaTimesIcon
} from 'react-icons/fa';
import { MdBuild, MdSpeed, MdWarning, MdSchedule, MdPending, MdDone, MdCancel, MdAttachMoney, MdCategory } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateSparePartRequestThunk, 
  UpdateSparePartRequestThunk, 
  DeleteSparePartRequestThunk,
  FetchSparePartRequestByVehicleThunk
} from '../../store/thunks/SparePartRequestThunk';
import moment from 'moment';

const SparePartRequestForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: sparePartRequestsList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [viewingItems, setViewingItems] = useState(null);
  const [showItemsDialog, setShowItemsDialog] = useState(false);

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchSparePartRequestByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    priority: Yup.string().required('Priority is required'),
    requestType: Yup.string().required('Request type is required'),
    requiredByDate: Yup.date().nullable(),
    isUrgent: Yup.boolean(),
    items: Yup.array().of(
      Yup.object().shape({
        brand: Yup.string().required('Brand is required'),
        category: Yup.string().required('Category is required'),
        quantityRequested: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
       
        specification: Yup.string().required('Specification is required'),
      })
    ).min(1, 'At least one item is required')
  });

  const initialValues = {
    priority: selectedRequest?.priority || 'Medium',
    requestType: selectedRequest?.requestType || 'Maintenance',
    requiredByDate: selectedRequest?.requiredByDate || null,
    isUrgent: selectedRequest?.isUrgent || false,
    items: selectedRequest?.items || [
      {
        id:'',
        brand: '',
        category: '',
        quantityRequested: 1,
        unitOfMeasure: 'Pcs',
        specification: '',
        isCritical: false
      }
    ]
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const submitData = {
        ...values,
        vehicleId: vehicleId,
        userId: sessionStorage.getItem("e"),
      };

      if (isEditMode && selectedRequest?.id) {
        await dispatch(UpdateSparePartRequestThunk({ id: selectedRequest.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateSparePartRequestThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedRequest(null);
      dispatch(FetchSparePartRequestByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving spare part request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this spare part request?')) {
      try {
        await dispatch(DeleteSparePartRequestThunk(requestId)).unwrap();
        dispatch(FetchSparePartRequestByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting spare part request:', error);
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

  const handleViewItems = (request) => {
    setViewingItems(request);
    setShowItemsDialog(true);
  };

  // Get priority config
  const getPriorityConfig = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'urgent':
        return { color: 'red', icon: <FaExclamationTriangle />, label: 'Urgent' };
      case 'high':
        return { color: 'orange', icon: <FaFlag />, label: 'High' };
      case 'medium':
        return { color: 'yellow', icon: <FaClock />, label: 'Medium' };
      case 'low':
        return { color: 'green', icon: <MdSchedule />, label: 'Low' };
      default:
        return { color: 'gray', icon: <FaClock />, label: priority || 'Medium' };
    }
  };
  // Get status config
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      
      case 'submitted':
        return { color: 'blue', icon: <FaClock />, label: 'Submitted' };
      case 'approved':
        return { color: 'green', icon: <FaCheckCircle />, label: 'Approved' };
      case 'rejected':
        return { color: 'red', icon: <MdCancel />, label: 'Rejected' };
      case 'inprogress':
        return { color: 'orange', icon: <FaTools />, label: 'In Progress' };
      case 'completed':
        return { color: 'teal', icon: <MdDone />, label: 'Completed' };
      case 'cancelled':
        return { color: 'red', icon: <FaTimesIcon />, label: 'Cancelled' };
      default:
        return { color: 'gray', icon: <MdPending />, label: status || 'Unknown' };
    }
  };

  const calculateTotalCost = (items) => {
    return items?.reduce((total, item) => total + (item.quantityRequested * item.unitPrice), 0) || 0;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Category options
  const categoryOptions = [
    'Engine', 'Brake', 'Electrical', 'Body', 'Suspension', 
    'Transmission', 'Cooling', 'Exhaust', 'Fuel System', 'Interior', 'Other'
  ];

  // Unit of measure options
  const unitOptions = ['Pcs', 'Box', 'Set', 'Liter', 'Kg', 'Meter', 'Pair'];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaBoxes className="w-6 h-6 text-blue-500" />
                Spare Part Requests
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
          {/* Add New Request Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaHistory className="w-5 h-5" />
              Requests ({sparePartRequestsList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              New Spare Part Request
            </Button>
          </div>

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

          {/* Request Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit className="text-blue-500" /> : <FaBoxes className="text-blue-500" />}
                {isEditMode ? 'Edit Spare Part Request' : 'New Spare Part Request'}
              </div>
            </DialogHeader>
            <DialogBody divider className="max-h-[80vh] overflow-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    {/* Request Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority *
                        </label>
                        <Field
                          name="priority"
                          as="select"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </Field>
                        <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Request Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Type *
                        </label>
                        <Field
                          name="requestType"
                          as="select"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Maintenance">Maintenance</option>
                          <option value="Repair">Repair</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Preventive">Preventive</option>
                        </Field>
                        <ErrorMessage name="requestType" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Required By Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Required By Date
                        </label>
                        <Field
                          name="requiredByDate"
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="requiredByDate" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Is Urgent */}
                      <div className="flex items-center mt-6">
                        <Field
                          name="isUrgent"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                          Mark as Urgent Request
                        </label>
                      </div>
                    </div>

                   
                    {/* Items Section */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                          <FaBoxes className="w-4 h-4" />
                          Required Parts/Items
                        </Typography>
                        <Button
                          type="button"
                          size="sm"
                          variant="outlined"
                          onClick={() => {
                            const newItems = [...values.items, {
                             
                              brand: '',
                              category: '',
                              quantityRequested: 1,
                  
                              unitOfMeasure: 'Pcs',
                              specification: '',
                              isCritical: false
                            }];
                            setFieldValue('items', newItems);
                          }}
                        >
                          <FaPlus className="w-3 h-3 mr-1" />
                          Add Item
                        </Button>
                      </div>

                      <FieldArray name="items">
                        {({ push, remove }) => (
                          <div className="space-y-4">
                            {values.items.map((item, index) => (
                              <Card key={index} className="p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                  <Typography variant="small" className="font-medium">
                                    Item #{index + 1}
                                  </Typography>
                                  {values.items.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="text"
                                      color="red"
                                      size="sm"
                                      onClick={() => remove(index)}
                                    >
                                      <FaTrash />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                

                                  {/* Brand */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Brand *
                                    </label>
                                    <Field
                                      name={`items.${index}.brand`}
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Manufacturer brand"
                                    />
                                    <ErrorMessage name={`items.${index}.brand`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>

                                  {/* Category */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Category *
                                    </label>
                                    <Field
                                      name={`items.${index}.category`}
                                      as="select"
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">Select category</option>
                                      {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage name={`items.${index}.category`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>

                                  {/* Quantity */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Quantity *
                                    </label>
                                    <Field
                                      name={`items.${index}.quantityRequested`}
                                      type="number"
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      min="1"
                                    />
                                    <ErrorMessage name={`items.${index}.quantityRequested`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>

                                  {/* Unit Price */}
                                  
                                  {/* Unit of Measure */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Unit of Measure
                                    </label>
                                    <Field
                                      name={`items.${index}.unitOfMeasure`}
                                      as="select"
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {unitOptions.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                      ))}
                                    </Field>
                                  </div>

                                 


                                  {/* Specification */}
                                  <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Technical Specifications *
                                    </label>
                                    <Field
                                      name={`items.${index}.specification`}
                                      as="textarea"
                                      rows="2"
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Technical specs, dimensions, material, etc."
                                    />
                                    <ErrorMessage name={`items.${index}.specification`} component="div" className="text-red-500 text-xs mt-1" />
                                  </div>

                                  {/* Checkboxes */}
                                  <div className="flex gap-4">
                                   
                                    <label className="flex items-center">
                                      <Field
                                        type="checkbox"
                                        name={`items.${index}.isCritical`}
                                        className="w-3 h-3 text-red-600"
                                      />
                                      <span className="ml-1 text-xs text-gray-700">Critical for Operation</span>
                                    </label>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </FieldArray>

                     
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={isSubmitting || postLoading}
                      >
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Request' : 'Submit Request')}
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

          {/* View Items Dialog */}
          <Dialog open={showItemsDialog} handler={setShowItemsDialog} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <FaBoxes className="text-blue-500" />
                Parts List - {viewingItems?.requestNumber}
              </div>
            </DialogHeader>
            <DialogBody divider>
              <div className="space-y-3">
                {viewingItems?.items?.map((item, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Brand:</strong> {item.brand}</div>
                      <div><strong>Category:</strong> {item.category}</div>
                      <div><strong>Quantity:</strong> {item.quantityRequested}</div>
                      </div>
                  </Card>
                ))}
               
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setShowItemsDialog(false)}>Close</Button>
            </DialogFooter>
          </Dialog>

          {/* Spare Part Requests Cards View */}
          {sparePartRequestsList && sparePartRequestsList.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sparePartRequestsList.map((request) => {
                const priorityConfig = getPriorityConfig(request.priority);
                const statusConfig = getStatusConfig(request.status);
                const totalCost = calculateTotalCost(request.items);
                return (
                  <Card key={request.id} className="p-4 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Typography variant="h6" color="blue-gray">
                          {request.requestNumber}
                        </Typography>
                        <div className="flex gap-2 mt-1">
                          <Chip
                            value={priorityConfig.label}
                            size="sm"
                            color={priorityConfig.color}
                            icon={priorityConfig.icon}
                            variant="ghost"
                          />
                          <Chip
                            value={statusConfig.label}
                            size="sm"
                            color={statusConfig.color}
                            icon={statusConfig.icon}
                            variant="ghost"
                          />
                        </div>
                      </div>
                      {request.isUrgent && (
                        <Chip
                          value="URGENT"
                          size="sm"
                          color="red"
                          icon={<FaExclamationTriangle />}
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span>{request.requestType}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">Items:</span>
                        <span>{request.items?.length || 0} part(s)</span>
                      </div>
                     
                      {request.requiredByDate && (
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">Required By:</span>
                          <span>{moment(request.requiredByDate).format('DD/MM/YYYY')}</span>
                        </div>
                      )}
                     
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                         
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>{moment(request.created).format('DD/MM/YYYY')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewItems(request)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Items"
                          >
                            <FaBoxes />
                          </button>
                          {request.status?.toLowerCase() === 'submitted' && (
                            <>
                              <button
                                onClick={() => handleEdit(request)}
                                className="text-green-600 hover:text-green-800 transition-colors"
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
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Typography variant="h6" color="gray">
                No spare part requests found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "New Spare Part Request" button to create a request for parts
              </Typography>
            </div>
          )}

          {/* Summary Statistics */}
          {sparePartRequestsList && sparePartRequestsList.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
                Request Summary
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <Typography variant="small" color="gray">Total Requests</Typography>
                  <Typography variant="h5" color="blue-gray">{sparePartRequestsList.length}</Typography>
                </div>
              
                <div className="text-center">
                  <Typography variant="small" color="gray">Approved</Typography>
                  <Typography variant="h5" color="green">
                    {sparePartRequestsList.filter(r => r.status === 'Approved').length}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">In Progress</Typography>
                  <Typography variant="h5" color="orange">
                    {sparePartRequestsList.filter(r => r.status === 'submitted').length}
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

export default SparePartRequestForm;