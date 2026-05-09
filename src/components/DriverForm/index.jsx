import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Dialog, DialogHeader, DialogBody, DialogFooter, Alert } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaUser, 
  FaHashtag, 
  FaUserTie, 
  FaTimes,
  FaTrash,
  FaEdit,
  FaSave,
  FaCar,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  
  FaCalendarAlt
} from 'react-icons/fa';
import { MdLocationOn, MdBadge } from 'react-icons/md';
import { SelectField } from '../SelectionField';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateDriverThunk, 
  UpdateDriverThunk, 
  DeleteDriverThunk,
  FetchDriversByVehicleThunk
} from '../../store/thunks/DriverThunk';
import moment from 'moment';

const DriverForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: driverList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchDriversByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    serNo: Yup.string()
      .max(50, 'Service number cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .required('Service number is required'),
    name: Yup.string()
      .max(100, 'Name cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .required('Driver name is required'),
    address: Yup.string()
      .max(200, 'Address cannot exceed 200 characters')
      .nullable(),
    licenseNumber: Yup.string()
      .max(50, 'License number cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .required('License number is required'),
    phoneNumber: Yup.string()
      .max(20, 'Phone number cannot exceed 20 characters')
      .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
      .nullable(),
    rank: Yup.string()
      .max(50, 'Rank cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
  });

  const initialValues = {
    serNo: selectedDriver?.serNo || '',
    name: selectedDriver?.name || '',
    address: selectedDriver?.address || '',
    licenseNumber: selectedDriver?.licenseNumber || '',
    phoneNumber: selectedDriver?.phoneNumber || '',
    rank: selectedDriver?.rank || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const submitData = {
        ...values,
        vehicleId: vehicleId,
        UserId:sessionStorage.getItem("e"),
        chassisNumber: vehicleData?.chassisNumber || '',
      };

      if (isEditMode && selectedDriver?.id) {
        await dispatch(UpdateDriverThunk({ id: selectedDriver.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateDriverThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedDriver(null);
      dispatch(FetchDriversByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving driver:', error);
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await dispatch(DeleteDriverThunk(driverId)).unwrap();
        dispatch(FetchDriversByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedDriver(null);
    setIsEditMode(false);
    setShowForm(true);
  };

   const rankOptions = [
    { value: 'caIII', label: 'Customs Assistant III' },
    { value: 'caII', label: 'Customs Assistant II' },
    { value: 'caI', label: 'Customs Assistant I' },
    { value: 'aic', label: 'Assistant Inspector of Customs' },
    { value: 'ic', label: 'Inspector of Customs' },
    { value: 'ASCII', label: 'Assistant Superintendent of Customs II' },
    { value: 'ASCI', label: 'Assistant Superintendent of Customs' },
    { value: 'DSC', label: 'Deputy Superintendent of Customs' },
    
    
  ];
  

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaUser className="w-6 h-6" />
                Vehicle Drivers
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
          {/* Add New Driver Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaUser className="w-5 h-5" />
              Drivers List ({driverList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-teal-500 flex items-center gap-2"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              Add Driver
            </Button>
          </div>

          {/* Error Alert */}
          {postError && (
            <Alert color="red" className="mb-4">
              {postError}
            </Alert>
          )}

          {/* Driver Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit /> : <FaPlus />}
                {isEditMode ? 'Edit Driver Information' : 'Add New Driver'}
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
                    {/* Service Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Number *
                      </label>
                      <Field
                        name="serNo"
                        as={Input}
                        label="Service Number"
                        size="lg"
                        onChange={(e) => {
                          setFieldValue('serNo', e.target.value.toUpperCase());
                        }}
                      />
                      <ErrorMessage name="serNo" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Driver Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Name *
                      </label>
                      <Field
                        name="name"
                        as={Input}
                        label="Full Name"
                        size="lg"
                        onChange={(e) => {
                          setFieldValue('name', e.target.value.toUpperCase());
                        }}
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number *
                      </label>
                      <Field
                        name="licenseNumber"
                        as={Input}
                        label="Driver's License Number"
                        size="lg"
                        onChange={(e) => {
                          setFieldValue('licenseNumber', e.target.value.toUpperCase());
                        }}
                      />
                      <ErrorMessage name="licenseNumber" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Rank */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rank
                      </label>
                      <Field
                        name="rank"
                        component={SelectField}
                        options={rankOptions}
                        placeholder="Select Rank"
                        label="Rank"
                      />
                      <ErrorMessage name="rank" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Field
                        name="phoneNumber"
                        as={Input}
                        label="Phone Number"
                        size="lg"
                        type="tel"
                      />
                      <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Field
                        name="address"
                        as="textarea"
                        label="Address"
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => {
                          setFieldValue('address', e.target.value.toUpperCase());
                        }}
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
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
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Driver' : 'Add Driver')}
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

          {/* Drivers Table */}
          {driverList && driverList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdBadge className="w-3 h-3" />
                        Service No.
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-3 h-3" />
                        Name
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        License No.
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
                        <FaPhone className="w-3 h-3" />
                        Phone
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3" />
                        Added On
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {driverList.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-medium">
                        {driver.serNo || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {driver.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {driver.licenseNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Chip
                          value={driver.rank || 'N/A'}
                          size="sm"
                          color="teal"
                          className="w-fit"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {driver.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {moment(driver.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(driver)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit Driver"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(driver.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Driver"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                No drivers found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "Add Driver" button to assign a driver to this vehicle
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

export default DriverForm;