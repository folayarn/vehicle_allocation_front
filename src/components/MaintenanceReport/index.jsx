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
  FaOilCan,
  
  FaTachometerAlt,
  FaThermometerHalf,
  FaFilter,
  
  FaCog,
  FaTools,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory
} from 'react-icons/fa';
import { MdBuild, MdSpeed,  MdWarning, MdSchedule } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateMaintenanceThunk, 
  UpdateMaintenanceThunk, 
  DeleteMaintenanceThunk,
  FetchMaintenancesByVehicleThunk
} from '../../store/thunks/MaintenanceThunk';
import moment from 'moment';

const MaintenanceReportForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: maintenanceList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [nextMaintenancePrediction, setNextMaintenancePrediction] = useState(null);

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchMaintenancesByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  // Calculate next maintenance prediction based on last maintenance mileage
  useEffect(() => {
    if (maintenanceList && maintenanceList.length > 0 && vehicleData?.currentMileage) {
      const lastMaintenance = maintenanceList[0]; // Assuming sorted by date desc
      if (lastMaintenance?.lastMaintenanceMileage) {
        const mileageSinceLast = vehicleData.currentMileage - lastMaintenance.lastMaintenanceMileage;
        const remainingMileage = 5000 - mileageSinceLast; // Assuming 5000km maintenance interval
        setNextMaintenancePrediction({
          mileageSince: mileageSinceLast,
          remaining: remainingMileage > 0 ? remainingMileage : 0,
          overdue: remainingMileage < 0
        });
      }
    }
  }, [maintenanceList, vehicleData?.currentMileage]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(200, 'Title cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Maintenance title is required'),
    body: Yup.string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .nullable(),
    lastMaintenanceMileage: Yup.number()
      .min(0, 'Mileage must be a positive number')
      .required('Maintenance mileage is required')
      .test('is-valid-mileage', 'Maintenance mileage cannot be less than previous maintenance', function(value) {
        if (maintenanceList && maintenanceList.length > 0 && !isEditMode) {
          const lastMileage = Math.max(...maintenanceList.map(m => m.lastMaintenanceMileage));
          return value >= lastMileage;
        }
        return true;
      })
      .test('not-exceed-current', 'Maintenance mileage cannot exceed current vehicle mileage', function(value) {
        if (vehicleData?.currentMileage) {
          return value <= vehicleData.currentMileage;
        }
        return true;
      }),
  });

  const initialValues = {
    title: selectedMaintenance?.title || '',
    body: selectedMaintenance?.body || '',
    lastMaintenanceMileage: selectedMaintenance?.lastMaintenanceMileage || vehicleData?.currentMileage || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const submitData = {
        ...values,
        vehicleId: vehicleId,
      userId:sessionStorage.getItem("e"),
        chassisNumber: vehicleData?.chassisNumber || '',
      };

      if (isEditMode && selectedMaintenance?.id) {
        await dispatch(UpdateMaintenanceThunk({ id: selectedMaintenance.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateMaintenanceThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedMaintenance(null);
      dispatch(FetchMaintenancesByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving maintenance report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (maintenanceId) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await dispatch(DeleteMaintenanceThunk(maintenanceId)).unwrap();
        dispatch(FetchMaintenancesByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting maintenance record:', error);
      }
    }
  };

  const handleEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedMaintenance(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  // Get maintenance type icon based on title
  const getMaintenanceIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('oil') || titleLower.includes('lube')) return <FaOilCan className="text-blue-500" />;
    if (titleLower.includes('brake')) return <FaBrake className="text-red-500" />;
    if (titleLower.includes('engine')) return <FaCog className="text-orange-500" />;
    if (titleLower.includes('battery')) return <FaBattery className="text-green-500" />;
    if (titleLower.includes('filter')) return <FaFilter className="text-purple-500" />;
    if (titleLower.includes('cooling') || titleLower.includes('radiator')) return <FaThermometerHalf className="text-cyan-500" />;
    if (titleLower.includes('tire') || titleLower.includes('tyre')) return <FaTachometerAlt className="text-yellow-500" />;
    return <FaWrench className="text-teal-500" />;
  };

  // Get maintenance type color
  const getMaintenanceColor = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('oil') || titleLower.includes('lube')) return 'blue';
    if (titleLower.includes('brake')) return 'red';
    if (titleLower.includes('engine')) return 'orange';
    if (titleLower.includes('battery')) return 'green';
    if (titleLower.includes('filter')) return 'purple';
    if (titleLower.includes('cooling')) return 'cyan';
    if (titleLower.includes('tire')) return 'yellow';
    return 'teal';
  };

  // Calculate mileage difference since last maintenance
  const calculateMileageDifference = (currentMileage, maintenanceMileage) => {
    if (currentMileage && maintenanceMileage) {
      return (currentMileage - maintenanceMileage).toFixed(2);
    }
    return 0;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Maintenance options suggestions
  const maintenanceOptions = [
    { value: 'OIL CHANGE', label: 'Oil Change Service' },
    { value: 'BRAKE PAD REPLACEMENT', label: 'Brake Pad Replacement' },
    { value: 'ENGINE TUNE-UP', label: 'Engine Tune-Up' },
    { value: 'BATTERY REPLACEMENT', label: 'Battery Replacement' },
    { value: 'FILTER REPLACEMENT', label: 'Filter Replacement (Air/Fuel/Oil)' },
    { value: 'COOLING SYSTEM SERVICE', label: 'Cooling System Service' },
    { value: 'TIRE ROTATION', label: 'Tire Rotation/Balancing' },
    { value: 'TRANSMISSION SERVICE', label: 'Transmission Service' },
    { value: 'BELT REPLACEMENT', label: 'Belt Replacement (Timing/Serpentine)' },
    { value: 'SPARK PLUG REPLACEMENT', label: 'Spark Plug Replacement' },
    { value: 'EXHAUST SYSTEM REPAIR', label: 'Exhaust System Repair' },
    { value: 'SUSPENSION REPAIR', label: 'Suspension Repair' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                Maintenance Records
              </Typography>
              <Typography variant="small" color="gray" className="flex items-center gap-2">
                <FaCar className="w-4 h-4" />
                Vehicle: {vehicleData?.chassisNumber || 'N/A'} | {vehicleData?.vehicleTypeModel || 'N/A'}
                {vehicleData?.currentMileage && (
                  <Chip value={`Current: ${vehicleData.currentMileage.toLocaleString()} km`} size="sm" color="teal" variant="ghost" />
                )}
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
          {/* Maintenance Prediction Alert */}
          {nextMaintenancePrediction && (
            <Alert 
              color={nextMaintenancePrediction.overdue ? "red" : "teal"} 
              className="mb-6"
              icon={nextMaintenancePrediction.overdue ? <FaExclamationTriangle /> : <MdSchedule />}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <Typography variant="small" className="font-medium">
                    {nextMaintenancePrediction.overdue ? 
                      `Maintenance OVERDUE by ${Math.abs(nextMaintenancePrediction.remaining)} km!` : 
                      `Next maintenance due in ${nextMaintenancePrediction.remaining} km`
                    }
                  </Typography>
                  <Typography variant="small">
                    {nextMaintenancePrediction.mileageSince} km since last maintenance
                  </Typography>
                </div>
                <Button 
                  size="sm" 
                  color={nextMaintenancePrediction.overdue ? "red" : "teal"}
                  onClick={handleAddNew}
                >
                  Record Maintenance Now
                </Button>
              </div>
            </Alert>
          )}

          {/* Add New Maintenance Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaHistory className="w-5 h-5" />
              Maintenance History ({maintenanceList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              Add Maintenance Record
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

          {/* Maintenance Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit className="text-blue-500" /> : <FaTools className="text-blue-500" />}
                {isEditMode ? 'Edit Maintenance Record' : 'New Maintenance Record'}
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
                    {/* Maintenance Title with Suggestions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Type/Title *
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
                          <option value="">Select maintenance type or enter custom</option>
                          {maintenanceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <Field
                        name="title"
                        as={Input}
                        label="Or enter custom maintenance title"
                        size="lg"
                        className="mt-2"
                        onChange={(e) => {
                          setFieldValue('title', e.target.value.toUpperCase());
                        }}
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Maintenance Mileage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Mileage (km) *
                      </label>
                      <div className="relative">
                        <MdSpeed className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="lastMaintenanceMileage"
                          as={Input}
                          label="Vehicle mileage at maintenance"
                          size="lg"
                          type="number"
                          className="pl-10"
                          step="0.01"
                        />
                      </div>
                      {vehicleData?.currentMileage && (
                        <div className="text-xs text-gray-500 mt-1">
                          Current vehicle mileage: {vehicleData.currentMileage.toLocaleString()} km
                          {values.lastMaintenanceMileage && values.lastMaintenanceMileage > vehicleData.currentMileage && (
                            <span className="text-red-500 ml-2">⚠️ Exceeds current mileage!</span>
                          )}
                        </div>
                      )}
                      <ErrorMessage name="lastMaintenanceMileage" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Description/Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Details
                      </label>
                      <div className="relative">
                        <MdBuild className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="body"
                          as="textarea"
                          rows="5"
                          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe the maintenance performed, parts replaced, service provider, cost, etc..."
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Characters: {values.body?.length || 0}/2000
                      </div>
                      <ErrorMessage name="body" component="div" className="text-red-500 text-sm mt-1" />
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
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Record' : 'Save Record')}
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

          {/* Maintenance Records Cards View */}
          {maintenanceList && maintenanceList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceList.map((maintenance, index) => (
                <Card key={maintenance.id} className="p-4 hover:shadow-lg transition-shadow">
                  {/* Header with Icon and Title */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getMaintenanceIcon(maintenance.title)}
                      <Typography variant="h6" color="blue-gray">
                        {maintenance.title}
                      </Typography>
                    </div>
                    <Chip
                      value={`#${index + 1}`}
                      size="sm"
                      color={getMaintenanceColor(maintenance.title)}
                      variant="ghost"
                    />
                  </div>

                  {/* Mileage Information */}
                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-md">
                    <div className="text-center">
                      <Typography variant="small" color="gray" className="text-xs">
                        Maintenance at
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {maintenance.lastMaintenanceMileage?.toLocaleString()} km
                      </Typography>
                    </div>
                    {vehicleData?.currentMileage && (
                      <div className="text-center">
                        <Typography variant="small" color="gray" className="text-xs">
                          Distance Since
                        </Typography>
                        <Typography variant="h6" color={calculateMileageDifference(vehicleData.currentMileage, maintenance.lastMaintenanceMileage) > 5000 ? "red" : "green"}>
                          {calculateMileageDifference(vehicleData.currentMileage, maintenance.lastMaintenanceMileage)} km
                        </Typography>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {maintenance.body && (
                    <div className="mb-3">
                      <Typography variant="small" color="gray" className="whitespace-pre-wrap">
                        {truncateText(maintenance.body, 120)}
                      </Typography>
                    </div>
                  )}

                  {/* Footer with Meta and Actions */}
                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          <span>{maintenance.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{moment(maintenance.createdAt).format('DD/MM/YYYY')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(maintenance)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Maintenance Record"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(maintenance.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Maintenance Record"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Typography variant="h6" color="gray">
                No maintenance records found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "Add Maintenance Record" button to record maintenance for this vehicle
              </Typography>
            </div>
          )}

          {/* Maintenance Summary Statistics */}
          {maintenanceList && maintenanceList.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
                <FaChartLine className="w-4 h-4" />
                Maintenance Summary
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Total Records
                  </Typography>
                  <Typography variant="h5" color="blue-gray">
                    {maintenanceList.length}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Avg. Interval
                  </Typography>
                  <Typography variant="h5" color="blue-gray">
                    {maintenanceList.length > 1 ? 
                      `${(Math.max(...maintenanceList.map(m => m.lastMaintenanceMileage)) - 
                         Math.min(...maintenanceList.map(m => m.lastMaintenanceMileage))) / (maintenanceList.length - 1)} km` : 
                      'N/A'}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Last Maintenance
                  </Typography>
                  <Typography variant="h5" color="blue-gray">
                    {moment(maintenanceList[0]?.createdAt).format('DD/MM/YYYY')}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="small" color="gray">
                    Most Common Type
                  </Typography>
                  <Typography variant="h5" color="blue-gray" className="text-sm">
                    {(() => {
                      const types = maintenanceList.map(m => m.title);
                      const mostCommon = types.sort((a,b) => 
                        types.filter(v => v === a).length - types.filter(v => v === b).length
                      ).pop();
                      return mostCommon?.length > 15 ? mostCommon.substring(0, 15) + '...' : mostCommon || 'N/A';
                    })()}
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

export default MaintenanceReportForm;