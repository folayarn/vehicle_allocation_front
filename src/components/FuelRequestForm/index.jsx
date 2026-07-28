import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Dialog, DialogHeader, DialogBody, DialogFooter, Alert, Textarea, Checkbox, Select, Option } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaBuilding, 
  FaHashtag, 
  FaMapMarkerAlt, 
  FaTimes,
  FaTrash,
  FaEdit,
  FaSave,
  FaGasPump,
  FaCar,
  FaCalendarAlt,
  FaFileAlt,
  FaUser,
  FaUsers,
  FaRoute,
  FaMapPin,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { MdLocationOn, MdCategory, MdDescription, MdLocalGasStation } from 'react-icons/md';
import { SelectField } from '../SelectionField';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateFuelRequestThunk, 
  UpdateFuelRequestThunk, 
  DeleteFuelRequestThunk 
} from '../../store/thunks/FuelRequestThunk';
import moment from 'moment';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';

const FuelRequestForm = ({ setOpen, initialRequest = null,isEditMode = false, vehicleData = null }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: requestList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedRequest, setSelectedRequest] = useState(initialRequest || null);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [userId, setUserId] = useState(sessionStorage.getItem('e') || null);
  const [currentMileage, setCurrentMileage] = useState(vehicleData?.currentMileage || 0);
  const [calculatedConsumption, setCalculatedConsumption] = useState(null);
  // Fetch available vehicles for dropdown
  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      setCurrentMileage(vehicleData.mileage || 0);
    }
      setUserId(sessionStorage.getItem('e'));
    
  }, [vehicleData]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
  requiredDate: Yup.date()
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.min(new Date(), 'Required date must be today or in the future')

      .required('Required date is required'),
      otherwise: (schema) => schema.nullable()
    }),
  requestedQuantity: Yup.number()
    .min(0.01, 'Quantity must be greater than 0')
    .max(10000, 'Quantity cannot exceed 10,000 liters')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Requested quantity is required'),
      otherwise: (schema) => schema.nullable()
    }),
  fuelType: Yup.string()
    .oneOf(['Petrol', 'Diesel', 'CNG', 'Electric'], 'Invalid fuel type')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Fuel type is required'),
      otherwise: (schema) => schema.nullable()
    }),
  currentMileage: Yup.number()
    .min(0, 'Mileage cannot be negative')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Current mileage is required'),
      otherwise: (schema) => schema.nullable()
    }),
  purpose: Yup.string()
    .max(500, 'Purpose cannot exceed 500 characters')
    .when('$isEditMode', {
      is: false,
      then: (schema) => schema.required('Purpose is required'),
      otherwise: (schema) => schema.nullable()
    }),
 
});
  const initialValues = {
    vehicleId: selectedRequest?.vehicleId || vehicleId || '',
    userId: sessionStorage.getItem('e'),
    
    requiredDate: selectedRequest?.requiredDate 
      ? moment(selectedRequest.requiredDate).format('YYYY-MM-DD') 
      : "",
    requestedQuantity: selectedRequest?.requestedQuantity || '',
    fuelType: selectedRequest?.fuelType || 'Petrol',
    currentMileage: selectedRequest?.currentMileage || currentMileage || '',
    purpose: selectedRequest?.purpose || '',
   
  };

  // Calculate estimated fuel consumption (helper)
  

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Format data for API
      const submitData = {
        vehicleId: values.vehicleId,
        userId: values.userId,
        
        requiredDate: new Date(values.requiredDate).toISOString(),
        requestedQuantity: values.requestedQuantity,
        fuelType: values.fuelType,
        currentMileage: values.currentMileage,
        purpose: values.purpose,
        
      };

      if (isEditMode && selectedRequest?.id) {
        await dispatch(UpdateFuelRequestThunk({ id: selectedRequest.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateFuelRequestThunk(submitData)).unwrap();
      }
      dispatch(FetchServerTableThunk({ type: 'vehicle', pageIndex: 0, pageSize: 20 }));

      resetForm();
      setShowForm(false);
      setSelectedRequest(null);
      setOpen(false);
      
    } catch (error) {
      console.error('Error saving fuel request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this fuel request?')) {
      try {
        await dispatch(DeleteFuelRequestThunk(requestId)).unwrap();
        dispatch(FetchServerTableThunk({ type: 'fuelRequest', pageIndex: 0, pageSize: 20 }));
      } catch (error) {
        console.error('Error deleting fuel request:', error);
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

  // Options for select fields
  const fuelTypeOptions = [
    { value: 'Petrol', label: 'Petrol (PMS)' },
    { value: 'Diesel', label: 'Diesel (AGO)' },
    { value: 'CNG', label: 'CNG' },
    { value: 'Electric', label: 'Electric' },
  ];

  const getFuelTypeColor = (type) => {
    switch(type) {
      case 'Petrol': return 'blue';
      case 'Diesel': return 'green';
      case 'CNG': return 'orange';
      case 'Electric': return 'purple';
      default: return 'gray';
    }
  };

  const getFuelTypeIcon = (type) => {
    switch(type) {
      case 'Petrol': return <MdLocalGasStation className="w-4 h-4" />;
      case 'Diesel': return <FaGasPump className="w-4 h-4" />;
      case 'CNG': return <FaGasPump className="w-4 h-4" />;
      case 'Electric': return <FaBolt className="w-4 h-4" />;
      default: return <MdLocalGasStation className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaGasPump className="w-6 h-6 text-blue-500" />
                {isEditMode ? "Edit Fuel Request" : "Create New Fuel Request"}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {isEditMode 
                  ? `Editing request #${selectedRequest?.requestNumber || ''}` 
                  : 'Fill in the details below to submit a new fuel request'}
              </Typography>
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

        <div className="p-6">
          {/* Display vehicle info if provided */}
          {vehicleData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCar className="w-5 h-5 text-blue-500" />
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {vehicleData.registrationNumber || vehicleData.chassisNumber}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {vehicleData.vehicleTypeModel || 'Vehicle'} • Current Mileage: {vehicleData.mileage || 0} km
                    </Typography>
                  </div>
                </div>
                <Chip 
                  value="Active" 
                  color="green" 
                  className="rounded-full" 
                />
              </div>
            </div>
          )}

          

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => {
              

              return (
                <Form className="space-y-6">
                  {/* Requester Information Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Requester Information
                    </Typography>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                      {/* Requester Name */}
                      
                      {/* Required Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Required Date *
                        </label>
                        <Field
                          name="requiredDate"
                          as={Input}
                          type="date"
                          size="lg"
                          className="w-full"
                        />
                        <ErrorMessage name="requiredDate" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Current Mileage */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Mileage (km) *
                        </label>
                        <Field
                          name="currentMileage"
                          as={Input}
                          type="number"
                          label="Current Odometer Reading"
                          size="lg"
                          className="w-full"
                        />
                        <ErrorMessage name="currentMileage" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Fuel Details Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                      <MdLocalGasStation className="w-4 h-4" />
                      Fuel Details
                    </Typography>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                      {/* Fuel Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuel Type *
                        </label>
                        <Field
                          name="fuelType"
                          component={SelectField}
                          options={fuelTypeOptions}
                          placeholder="Select Fuel Type"
                        />
                        <ErrorMessage name="fuelType" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Requested Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Requested Quantity (Liters) *
                        </label>
                        <Field
                          name="requestedQuantity"
                          as={Input}
                          type="number"
                          label="Quantity in Liters"
                          size="lg"
                          className="w-full"
                          step="0.01"
                        />
                        <ErrorMessage name="requestedQuantity" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                   
                  </div>

                  {/* Trip Details Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                      <FaRoute className="w-4 h-4" />
                      Trip Details
                    </Typography>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                      {/* Purpose */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purpose of Fuel Request *
                        </label>
                        <Field
                          name="purpose"
                          as="textarea"
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe the purpose of the fuel request"
                        />
                        <ErrorMessage name="purpose" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                     
                    </div>
                  </div>

                 

                 

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={isSubmitting || postLoading}
                    >
                      <div className="flex items-center gap-2">
                        <FaSave />
                        {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Request' : 'Submit Request')}
                      </div>
                    </Button>
                    
                   
                  </div>

                  
                </Form>
              );
            }}
          </Formik>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
          <Typography variant="small" color="gray">
            All fields marked with * are required
          </Typography>
          <Button
            variant="outlined"
            color="red"
            onClick={() => setOpen(false)}
            className="border-red-500 text-red-500 flex items-center gap-2 hover:bg-red-50"
          >
            <FaTimes className="w-4 h-4" />
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FuelRequestForm;