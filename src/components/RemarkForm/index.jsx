import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Textarea, Dialog, DialogHeader, DialogBody, DialogFooter, Alert } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaPlus, 
  FaComment, 
  FaTimes,
  FaTrash,
  FaEdit,
  FaSave,
  FaCar,
  FaUser,
  FaRegStickyNote
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateRemarkThunk, 
  UpdateRemarkThunk, 
  DeleteRemarkThunk,
  FetchRemarksByVehicleThunk
} from '../../store/thunks/RemarkThunk';
import moment from 'moment';

const RemarkForm = ({ setOpen, vehicleData, userId }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: remarkList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicleData?.id || null);

  
  console.log(remarkList)
  useEffect(() => {
    if (vehicleData?.id) {
    
      setVehicleId(vehicleData.id);
      dispatch(FetchRemarksByVehicleThunk(vehicleData.id));
    }
  }, [vehicleData?.id, dispatch]);

  const validationSchema = Yup.object().shape({
    remarkText: Yup.string()
      .required('Remark text is required')
      .min(3, 'Remark must be at least 3 characters')
      .max(500, 'Remark cannot exceed 500 characters'),
  });

  const initialValues = {
    remarkText: selectedRemark?.remarkText || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const remarkData = {
        remarkText: values.remarkText,
        vehicleId: vehicleId,
        userId: sessionStorage.getItem("e"),
      };

      if (isEditMode && selectedRemark?.id) {
        await dispatch(UpdateRemarkThunk({ id: selectedRemark.id, data: remarkData })).unwrap();
      } else {
        await dispatch(CreateRemarkThunk(remarkData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedRemark(null);
      dispatch(FetchRemarksByVehicleThunk(vehicleId));
    } catch (error) {
      console.error('Error saving remark:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (remarkId) => {
    if (window.confirm('Are you sure you want to delete this remark?')) {
      try {
        await dispatch(DeleteRemarkThunk(remarkId)).unwrap();
        dispatch(FetchRemarksByVehicleThunk(vehicleData?.id));
      } catch (error) {
        console.error('Error deleting remark:', error);
      }
    }
  };

  const handleEdit = (remark) => {
    setSelectedRemark(remark);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedRemark(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaComment className="w-6 h-6" />
                Vehicle Remarks
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
          {/* Add New Remark Button */}
          <div className="mb-6 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <FaRegStickyNote className="w-5 h-5" />
              Remark History ({remarkList?.length || 0})
            </Typography>
            <Button
              onClick={handleAddNew}
              className="bg-teal-500 flex items-center gap-2"
              size="sm"
            >
              <FaPlus className="w-4 h-4" />
              Add Remark
            </Button>
          </div>

          {/* Remark Form Modal */}
          <Dialog open={showForm} handler={setShowForm} size="md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {isEditMode ? <FaEdit /> : <FaPlus />}
                {isEditMode ? 'Edit Remark' : 'Add New Remark'}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remark <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="remarkText"
                        as={Textarea}
                        label="Enter remark here..."
                        size="lg"
                        rows={4}
                        className="w-full"
                        onChange={(e) => {
                          setFieldValue('remarkText', e.target.value);
                        }}
                      />
                      <ErrorMessage name="remarkText" component="div" className="text-red-500 text-sm mt-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        Max 500 characters. Current: {values.remarkText?.length || 0}
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 mt-6">
                      <Button type="submit" className="bg-teal-500" disabled={isSubmitting || postLoading}>
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Save')}
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

          {/* Remarks List */}
          {remarkList && remarkList.length > 0 ? (
            <div className="space-y-4">
              {remarkList.map((remark) => (
                <div key={remark.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaUser className="w-3 h-3" />
                      <span>
                        {remark.user?.name || 'System'} • {moment(remark.createdAt).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(remark)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit remark"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(remark.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete remark"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {remark.remarkText}
                  </div>
                  {remark.updatedAt !== remark.createdAt && (
                    <div className="mt-2 text-xs text-gray-400">
                      Last updated: {moment(remark.updatedAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaComment className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                No remarks found
              </Typography>
              <Typography variant="small" color="gray" className="mt-2">
                Click the "Add Remark" button to add a remark for this vehicle
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

export default RemarkForm;