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
  FaFileAlt,
  FaExclamationTriangle,
  FaCamera,
  FaPaperclip,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaFlag,
  FaClipboardList,
  FaFileUpload,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaTrashAlt
} from 'react-icons/fa';
import { MdReportProblem, MdDescription, MdAttachFile, MdWarning } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateIncidentReportThunk, 
  UpdateIncidentReportThunk, 
  DeleteIncidentReportThunk,
  FetchIncidentReportsByVehicleThunk,
  
} from '../../store/thunks/IncidentReportThunk';
import moment from 'moment';

const IncidentReportForm = ({ setOpen, vehicleData }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: incidentList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (vehicleData?.id) {
      setVehicleId(vehicleData.id);
      dispatch(FetchIncidentReportsByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(200, 'Title cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .required('Incident title is required'),
    body: Yup.string()
      .max(2000, 'Description cannot exceed 2000 characters')
      .required('Incident description is required'),
  });

  const initialValues = {
    title: selectedIncident?.title || '',
    body: selectedIncident?.body || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('Title', values.title);
      formData.append('Body', values.body);
      formData.append('VehicleId', vehicleId);
      formData.append('UserId', sessionStorage.getItem("e"));
      formData.append('ChassisNumber', vehicleData?.chassisNumber || '');
      console.log(selectedFile)
      
        formData.append('FilePath', selectedFile);
      

      if (isEditMode && selectedIncident?.id) {
        await dispatch(UpdateIncidentReportThunk({ id: selectedIncident.id, data: formData })).unwrap();
      } else {
        await dispatch(CreateIncidentReportThunk(formData)).unwrap();
      }

      resetForm();
      setSelectedFile(null);
      setFilePreview(null);
      setShowForm(false);
      setIsEditMode(false);
      setSelectedIncident(null);
      dispatch(FetchIncidentReportsByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving incident report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident report?')) {
      try {
        await dispatch(DeleteIncidentReportThunk(incidentId)).unwrap();
        dispatch(FetchIncidentReportsByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting incident report:', error);
      }
    }
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setIsEditMode(true);
    setShowForm(true);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleAddNew = () => {
    setSelectedIncident(null);
    setIsEditMode(false);
    setShowForm(true);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFieldValue('fileName', file.name);
      
      // Preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDownloadFile = async (incidentId, fileName) => {
    console.log(fileName)
   window.open(`http://localhost:7119${fileName}`, '_blank');
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaPaperclip />;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      default:
        return <FaPaperclip className="text-gray-500" />;
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Get severity color based on title keywords
  const getSeverityColor = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('accident') || titleLower.includes('crash')) return 'red';
    if (titleLower.includes('fire') || titleLower.includes('explosion')) return 'orange';
    if (titleLower.includes('theft') || titleLower.includes('stolen')) return 'deep-purple';
    if (titleLower.includes('damage') || titleLower.includes('dent')) return 'yellow';
    if (titleLower.includes('breakdown') || titleLower.includes('mechanical')) return 'amber';
    return 'teal';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <MdReportProblem className="w-6 h-6 text-red-500" />
                Incident Reports
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
          {/* Add New Incident Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaFlag className="w-5 h-5" />
              Incident Reports ({incidentList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-red-500 flex items-center gap-2 hover:bg-red-600"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              Report Incident
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

          {/* Incident Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit className="text-blue-500" /> : <MdWarning className="text-red-500" />}
                {isEditMode ? 'Edit Incident Report' : 'New Incident Report'}
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
                  <Form className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Incident Title *
                      </label>
                      <div className="relative">
                        <FaExclamationTriangle className="absolute left-3 top-3 text-red-400" />
                        <Field
                          name="title"
                          as={Input}
                          label="e.g., Accident, Theft, Damage, Breakdown"
                          size="lg"
                          className="pl-10"
                          onChange={(e) => {
                            setFieldValue('title', e.target.value.toUpperCase());
                          }}
                        />
                      </div>
                      <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Description/Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Incident Description *
                      </label>
                      <div className="relative">
                        <MdDescription className="absolute left-3 top-3 text-gray-400" />
                        <Field
                          name="body"
                          as="textarea"
                          rows="6"
                          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Provide detailed description of the incident including date, time, location, circumstances, damages, injuries, etc..."
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Characters: {values.body.length}/2000
                      </div>
                      <ErrorMessage name="body" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* File Attachment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attach File (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-400 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          accept=".pdf"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <FaFileUpload className="text-4xl text-gray-400 mb-2" />
                          <Typography variant="small" color="gray" className="text-center">
                            Click to upload or drag and drop
                          </Typography>
                          <Typography variant="small" color="gray" className="text-xs mt-1">
                            PDF (Max 4MB)
                          </Typography>
                        </label>
                      </div>
                      
                      {selectedFile && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFileIcon(selectedFile.name)}
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFilePreview(null);
                              setFieldValue('fileName', '');
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}

                      {filePreview && (
                        <div className="mt-3">
                          <img src={filePreview} alt="Preview" className="max-h-48 rounded-md" />
                        </div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isSubmitting || postLoading}
                      >
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Report' : 'Submit Report')}
                        </div>
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setShowForm(false);
                          setSelectedFile(null);
                          setFilePreview(null);
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

          {/* Incidents Grid/Cards View */}
          {incidentList && incidentList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidentList.map((incident) => (
                <Card key={incident.id} className="p-4 hover:shadow-lg transition-shadow border-l-4" 
                      style={{ borderLeftColor: getSeverityColor(incident.title) === 'red' ? '#ef4444' :
                                getSeverityColor(incident.title) === 'orange' ? '#f97316' :
                                getSeverityColor(incident.title) === 'deep-purple' ? '#7c3aed' :
                                getSeverityColor(incident.title) === 'yellow' ? '#eab308' : '#14b8a6' }}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className={`text-${
                        getSeverityColor(incident.title) === 'red' ? 'red' :
                        getSeverityColor(incident.title) === 'orange' ? 'orange' :
                        getSeverityColor(incident.title) === 'deep-purple' ? 'purple' :
                        getSeverityColor(incident.title) === 'yellow' ? 'yellow' : 'teal'
                      }-500`} />
                      <Typography variant="h6" color="blue-gray">
                        {incident.title}
                      </Typography>
                    </div>
                    <Chip
                      value={moment(incident.createdAt).format('DD/MM/YYYY')}
                      size="sm"
                      color="teal"
                      variant="ghost"
                    />
                  </div>

                  {/* Body */}
                  <div className="mb-3">
                    <Typography variant="small" color="gray" className="whitespace-pre-wrap">
                      {truncateText(incident.body, 150)}
                    </Typography>
                  </div>

                  {/* Footer with meta info and actions */}
                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          <span>Reported by: {incident.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{moment(incident.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {incident.filePath && (
                          <button
                            onClick={() => handleDownloadFile(incident.id, incident.filePath)}
                            disabled={downloading}
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm flex items-center gap-1"
                            title="Download Attachment"
                          >
                            {downloading ? <Spinner className="h-3 w-3" /> : <FaDownload className="w-3 h-3" />}
                            <span className="text-xs">Attachment</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(incident)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Incident"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(incident.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Incident"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {/* File indicator */}
                    {incident.filePath && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        {getFileIcon(incident.fileName)}
                        <span>{incident.fileName || 'Attached File'}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MdReportProblem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                No incident reports found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "Report Incident" button to report an incident for this vehicle
              </Typography>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
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

export default IncidentReportForm;