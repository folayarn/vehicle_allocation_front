import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Chip, Input, Textarea, Dialog, DialogHeader, DialogBody, DialogFooter, Alert } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaHistory, 
  FaUser, 
  FaHashtag, 
  FaUserTie, 
  FaBuilding, 
  FaCalendarAlt, 
  FaTimes,
  FaTrash,
  FaEdit,
  FaSave,
  FaCar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaFileUpload,
  FaFileAlt,
  FaDownload
} from 'react-icons/fa';
import { MdWork, MdLocationOn } from 'react-icons/md';
import { GiGearHammer } from 'react-icons/gi';
import { SelectField } from '../SelectionField';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateAllocationThunk, 
  UpdateAllocationThunk, 
  DeleteAllocationThunk 
} from '../../store/thunks/AllocationThunk';
import moment from 'moment';
import { FetchAllocationByVehicleThunk } from '../../store/thunks/AllocationThunk';

const Allocation = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: allocationList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchAllocationByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    officerName: Yup.string()
      .max(100, 'Officer name cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    officerSerNo: Yup.string()
      .max(50, 'Service number cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    rank: Yup.string()
      .max(50, 'Rank cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    type: Yup.string()
      .required('Allocation type is required')
      .oneOf(['Department', 'Staff', 'Office'], 'Invalid allocation type'),
    command: Yup.string()
      .max(100, 'Command cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .required('Command is required'),
    zone: Yup.string()
      .max(50, 'Zone cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .required('Zone is required'),
    department: Yup.string()
      .max(100, 'Department cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    office: Yup.string()
      .max(100, 'Office cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    yearOfAllocation: Yup.number()
      .typeError('Year must be a valid year')
      .min(1900, 'Year must be 1900 or later')
      .max(new Date().getFullYear() + 5, 'Year cannot be too far in the future')
      .required('Year of allocation is required'),
  });

  const initialValues = {
    officerName: selectedAllocation?.officerName || '',
    officerSerNo: selectedAllocation?.officerSerNo || '',
    rank: selectedAllocation?.rank || '',
    type: selectedAllocation?.type || '',
    command: selectedAllocation?.command || '',
    zone: selectedAllocation?.zone || '',
    department: selectedAllocation?.department || '',
    office: selectedAllocation?.office || '',
    yearOfAllocation: selectedAllocation?.yearOfAllocation || new Date().getFullYear(),
  };

  const validateFile = (file) => {
    if (!file) {
      if (!isEditMode) {
        setFileError('File is required');
        return false;
      }
      return true;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file type. Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX');
      return false;
    }

    if (file.size > maxSize) {
      setFileError('File size must be less than 10MB');
      return false;
    }

    setFileError('');
    return true;
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setSelectedFile(file);
    if (validateFile(file)) {
      setFieldValue('file', file);
    } else {
      setFieldValue('file', null);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('VehicleId', vehicleId);
      formData.append('ChassisNumber', vehicleData?.chassisNumber || '');
      formData.append('OfficerName', values.officerName || '');
      formData.append('OfficerSerNo', values.officerSerNo || '');
      formData.append('Type', values.type);
      formData.append('Rank', values.rank || '');
      formData.append('Command', values.command);
      formData.append('Zone', values.zone);
      formData.append('Department', values.department || '');
      formData.append('Office', values.office || '');
      formData.append('Unit', values.unit || '');
      formData.append('YearOfAllocation', values.yearOfAllocation);
      
      // Append file if selected
      if (selectedFile) {
        formData.append('FilePath', selectedFile);
      }

      if (isEditMode && selectedAllocation?.id) {
        await dispatch(UpdateAllocationThunk({ id: selectedAllocation.id, data: formData })).unwrap();
      } else {
        await dispatch(CreateAllocationThunk(formData)).unwrap();
      }

      resetForm();
      setSelectedFile(null);
      setShowForm(false);
      setIsEditMode(false);
      setSelectedAllocation(null);
      dispatch(FetchAllocationByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving allocation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (allocationId) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await dispatch(DeleteAllocationThunk(allocationId)).unwrap();
        dispatch(FetchAllocationByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting allocation:', error);
      }
    }
  };

  const handleEdit = (allocation) => {
    setSelectedAllocation(allocation);
    setIsEditMode(true);
    setShowForm(true);
    setSelectedFile(null);
    setFileError('');
  };

  const handleAddNew = () => {
    setSelectedAllocation(null);
    setIsEditMode(false);
    setShowForm(true);
    setSelectedFile(null);
    setFileError('');
  };

  const handleDownload = (filePath, allocationId) => {
    // You can implement download functionality
    window.open(`http://localhost:7119${filePath}`, '_blank');
  };

  const typeOptions = [
    { value: 'Staff', label: 'Allocation to Staff' },
    { value: 'Office', label: 'Allocation to Office' },
    { value: 'Department', label: 'Allocation to Department' },
    { value: 'Auction', label: 'Allocation Through Auction' },
  ];

  const rankOptions = [
    { value: 'CAIII', label: 'Customs Assistant III' },
    { value: 'CAII', label: 'Customs Assistant II' },
    { value: 'CAI', label: 'Customs Assistant I' },
    { value: 'AIC', label: 'Assistant Inspector of Customs' },
    { value: 'IC', label: 'Inspector of Customs' },
    { value: 'ASCII', label: 'Assistant Superintendent of Customs II' },
    { value: 'ASCI', label: 'Assistant Superintendent of Customs' },
    { value: 'DSC', label: 'Deputy Superintendent of Customs' },
    { value: 'SC', label: 'Superintendent of Customs' },
    { value: 'CSC', label: 'Chief Superintendent of Customs' },
    { value: 'AC', label: 'Assistant Comptroller' },
    { value: 'DC', label: 'Deputy Comptroller' },
    { value: 'CC', label: 'Comptroller' },
    { value: 'ACG', label: 'Assistant Comptroller General' },
    { value: 'DCG', label: 'Deputy Comptroller General' },
    { value: 'CGC', label: 'Comptroller General' },
  ];

  const commandOptions = [
    { value: "ADAMAWA/TARABA", label: "ADAMAWA/TARABA" },
    { value: "APAPA", label: "APAPA" },
    { value: "BAUCHI/GOMBE", label: "BAUCHI/GOMBE" },
    { value: "BORNO/YOBE", label: "BORNO/YOBE" },
    { value: "CROSS RIVER/AKWA IBOM", label: "CROSS RIVER/AKWA IBOM" },
    { value: "EDO / DELTA", label: "EDO / DELTA" },
    { value: "ENUGU / ANAMBRA / EBONYI", label: "ENUGU / ANAMBRA / EBONYI" },
    { value: "FCT", label: "FCT" },
    { value: "FOU A", label: "FOU A" },
    { value: "IMO/ABIA", label: "IMO/ABIA" },
    { value: "KADUNA", label: "KADUNA" },
    { value: "KANO / JIGAWA", label: "KANO / JIGAWA" },
    { value: "KATSINA", label: "KATSINA" },
    { value: "KWARA", label: "KWARA" },
    { value: "KEBBI", label: "KEBBI" },
    { value: "LAGOS FTZ", label: "LAGOS FTZ" },
    { value: "LILYPOND", label: "LILYPOND" },
    { value: "MURTALA MUHAMMAD AIRPORT CARGO", label: "MURTALA MUHAMMAD AIRPORT CARGO" },
    { value: "OGUN I", label: "OGUN I" },
    { value: "OPERATION WHIRLWIND", label: "OPERATION WHIRLWIND" },
    { value: "PLATEAU / BENUE / NASSARAWA", label: "PLATEAU / BENUE / NASSARAWA" },
    { value: "OYO / OSUN", label: "OYO / OSUN" },
    { value: "PTML", label: "PTML" },
    { value: "SEME", label: "SEME" },
    { value: "SOKOTO / ZAMAFARA", label: "SOKOTO / ZAMAFARA" },
    { value: "TINCA", label: "TINCA" },
    { value: "ZONE A HQ", label: "ZONE A HQ" },
    { value: "ONNE OIL AND GAS", label: "ONNE OIL AND GAS" },
  ];

  const zoneOptions = [
    { value: "HQ", label: "Headquarters" },
    { value: "A", label: "Zone A" },
    { value: "B", label: "Zone B" },
    { value: "C", label: "Zone C" },
    { value: "D", label: "Zone D" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2000; year <= currentYear + 5; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaHistory className="w-6 h-6" />
                Vehicle Allocations
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
          {/* Add New Allocation Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaHistory className="w-5 h-5" />
              Allocation History ({allocationList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-teal-500 flex items-center gap-2"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              New Allocation
            </Button>
          </div>

          {/* Allocation Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit /> : <FaPlus />}
                {isEditMode ? 'Edit Allocation' : 'New Allocation'}
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
                    <div className="lg:col-span-2">
                      <Field
                        name="type"
                        component={SelectField}
                        options={typeOptions}
                        placeholder="Select Type of Allocation"
                        label="Allocation Type"
                      />
                      <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                   
                    {values.type === 'Staff' && (
                      <>
                        <div>
                          <Field
                            name="officerName"
                            as={Input}
                            label="Officer Name"
                            size="lg"
                            onChange={(e) => {
                              setFieldValue('officerName', e.target.value.toUpperCase());
                            }}
                          />
                          <ErrorMessage name="officerName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <Field
                            name="officerSerNo"
                            as={Input}
                            label="Service Number"
                            size="lg"
                            onChange={(e) => {
                              setFieldValue('officerSerNo', e.target.value.toUpperCase());
                            }}
                          />
                          <ErrorMessage name="officerSerNo" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <Field
                            name="rank"
                            component={SelectField}
                            options={rankOptions}
                            placeholder="Select Rank"
                            label="Rank"
                          />
                          <ErrorMessage name="rank" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </>
                    )}

                    <div>
                      <Field
                        name="command"
                        component={SelectField}
                        options={commandOptions}
                        placeholder="Select Command"
                        label="Command"
                      />
                      <ErrorMessage name="command" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <Field
                        name="zone"
                        component={SelectField}
                        options={zoneOptions}
                        placeholder="Select Zone"
                        label="Zone"
                      />
                      <ErrorMessage name="zone" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {values.type === 'Department' && (
                      <div>
                        <Field
                          name="department"
                          as={Input}
                          label="Department"
                          size="lg"
                          onChange={(e) => {
                            setFieldValue('department', e.target.value.toUpperCase());
                          }}
                        />
                        <ErrorMessage name="department" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    )}

                    {values.type === 'Office' && (
                      <div>
                        <Field
                          name="office"
                          as={Input}
                          label="Office"
                          size="lg"
                          onChange={(e) => {
                            setFieldValue('office', e.target.value.toUpperCase());
                          }}
                        />
                        <ErrorMessage name="office" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    )}

                    <div>
                      <Field
                        name="yearOfAllocation"
                        component={SelectField}
                        options={yearOptions}
                        placeholder="Select Year"
                        label="Year of Allocation"
                      />
                      <ErrorMessage name="yearOfAllocation" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* File Upload Section */}
                    <div className="lg:col-span-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaFileUpload className="inline mr-2" />
                          Allocation Letter {!isEditMode && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        />
                        {selectedAllocation?.filePath && !selectedFile && (
                          <div className="mt-2 text-sm text-gray-600">
                            <FaFileAlt className="inline mr-1" />
                            Current file: {selectedAllocation.filePath.split('/').pop()}
                            
                          </div>
                        )}
                        {fileError && (
                          <div className="text-red-500 text-sm mt-1">{fileError}</div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Accepted files: PDF (Max 5MB)
                        </p>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="lg:col-span-2 flex gap-4 mt-4">
                      <Button type="submit" className="bg-teal-500" disabled={isSubmitting || postLoading}>
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                        </div>
                      </Button>
                      <Button variant="outlined" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogBody>
          </Dialog>

          {/* Allocations Table */}
          {allocationList && allocationList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
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
                        <FaInfoCircle className="w-3 h-3" />
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
                        Dept/Unit
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3" />
                        Year
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaFileAlt className="w-3 h-3" />
                        Document
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allocationList.map((allocation) => (
                    <tr key={allocation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{allocation.officerName || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-mono">{allocation.officerSerNo || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{allocation.rank || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <Chip
                          value={allocation.type || 'N/A'}
                          size="sm"
                          color={allocation.type === 'Staff' ? 'blue' : allocation.type === 'Department' ? 'green' : allocation.type === 'Office' ? 'orange' : 'purple'}
                          className="w-fit"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{allocation.command || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {allocation.department || allocation.unit || allocation.office || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{allocation.yearOfAllocation || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {allocation.filePath ? (
                          <button
                            onClick={() => handleDownload(allocation.filePath, allocation.id)}
                            className="text-teal-600 hover:text-teal-800"
                            title="Download document"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-400">No file</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(allocation)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(allocation.id)}
                            className="text-red-600 hover:text-red-800"
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
              <FaHistory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                No allocations found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "New Allocation" button to add an allocation for this vehicle
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

export default Allocation;