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
  FaLandmark,
  FaBolt,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileAlt,
  FaGavel,
  FaShieldAlt,
  FaHome,
  FaChurch,
  FaMosque,
  FaStore,
  FaWarehouse
} from 'react-icons/fa';
import { MdLocationOn, MdCategory, MdDescription } from 'react-icons/md';
import { SelectField } from '../SelectionField';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CreateAssetThunk, 
  UpdateAssetThunk, 
  DeleteAssetThunk,
  
} from '../../store/thunks/AssetThunk';
import moment from 'moment';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';

const AssetForm = ({ setOpen, initialAsset = null, commandData = null }) => {
  const dispatch = useDispatch();
  const { loading: postLoading, error: postError } = useSelector((state) => state.PostSlice);
  const { data: assetList, loading, error } = useSelector((state) => state.FetchSlice);
  const [selectedAsset, setSelectedAsset] = useState(initialAsset || null);
  const [isEditMode, setIsEditMode] = useState(!!initialAsset);
  const [showForm, setShowForm] = useState(false);
  const [commandId, setCommandId] = useState(commandData?.id || null);

  useEffect(() => {
    if (commandData?.id) {
      setCommandId(commandData.id);
      dispatch(FetchAssetsByCommandThunk(commandData.id));
    }
  }, [commandData?.id, dispatch]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    assetName: Yup.string()
      .max(200, 'Asset name cannot exceed 200 characters')
      .required('Asset name is required'),
    assetType: Yup.string()
      .oneOf(['land', 'electrical', 'project'], 'Invalid asset type')
      .required('Asset type is required'),
    serialNumber: Yup.string()
      .max(100, 'Serial number cannot exceed 100 characters')
      .nullable(),
    zone: Yup.string()
      .max(50, 'Zone cannot exceed 50 characters')
      .nullable(),
    command: Yup.string()
      .max(100, 'Command cannot exceed 100 characters')
      .nullable(),
    location: Yup.string()
      .max(500, 'Location cannot exceed 500 characters')
      .nullable(),
    brandName: Yup.string()
      .max(100, 'Brand name cannot exceed 100 characters')
      .nullable(),
    capacity: Yup.string()
      .max(100, 'Capacity cannot exceed 100 characters')
      .nullable(),
    condition: Yup.string()
      .oneOf(['good', 'fair', 'poor', 'under_renovation', 'unknown'], 'Invalid condition')
      .required('Condition is required'),
    assetStatus: Yup.string()
      .oneOf(['serviceable', 'dilapidated', 'ongoing', 'needs_renovation', 'active', 'fair', 'abandoned'], 'Invalid status')
      .required('Asset status is required'),
    category: Yup.string()
      .max(100, 'Category cannot exceed 100 characters')
      .nullable(),
    buildingType: Yup.string()
      .max(100, 'Building type cannot exceed 100 characters')
      .nullable(),
    noOfBuilding: Yup.number()
      .min(0, 'Number of buildings cannot be negative')
      .integer('Must be a whole number')
      .nullable(),
    constructionCost: Yup.number()
      .min(0, 'Construction cost cannot be negative')
      .nullable(),
    renovationCost: Yup.number()
      .min(0, 'Renovation cost cannot be negative')
      .nullable(),
    acquisitionCost: Yup.number()
      .min(0, 'Acquisition cost cannot be negative')
      .nullable(),
    acquisitionDate: Yup.date()
      .nullable(),
    constructionDate: Yup.date()
      .nullable(),
    renovationDate: Yup.date()
      .nullable(),
    insurancePolicyNo: Yup.string()
      .max(100, 'Insurance policy number cannot exceed 100 characters')
      .nullable(),
    availableDocument: Yup.boolean(),
    litigationStatus: Yup.string()
      .max(200, 'Litigation status cannot exceed 200 characters')
      .nullable(),
    description: Yup.string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .nullable(),
    remark: Yup.string()
      .max(500, 'Remark cannot exceed 500 characters')
      .nullable(),
  });

  const initialValues = {
    assetName: selectedAsset?.assetName || '',
    assetType: selectedAsset?.assetType || 'project',
    serialNumber: selectedAsset?.serialNumber || '',
    zone: selectedAsset?.zone || '',
    command: selectedAsset?.command || commandData?.name || '',
    location: selectedAsset?.location || '',
    brandName: selectedAsset?.brandName || '',
    capacity: selectedAsset?.capacity || '',
    condition: selectedAsset?.condition || 'good',
    assetStatus: selectedAsset?.assetStatus || 'serviceable',
    category: selectedAsset?.category || '',
    buildingType: selectedAsset?.buildingType || '',
    noOfBuilding: selectedAsset?.noOfBuilding || '',
    constructionCost: selectedAsset?.constructionCost || '',
    renovationCost: selectedAsset?.renovationCost || '',
    acquisitionCost: selectedAsset?.acquisitionCost || '',
    acquisitionDate: selectedAsset?.acquisitionDate || '',
    constructionDate: selectedAsset?.constructionDate || '',
    renovationDate: selectedAsset?.renovationDate || '',
    insurancePolicyNo: selectedAsset?.insurancePolicyNo || '',
    availableDocument: selectedAsset?.availableDocument || false,
    litigationStatus: selectedAsset?.litigationStatus || '',
    description: selectedAsset?.description || '',
    remark: selectedAsset?.remark || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Format dates properly for API - send null for empty strings
      const submitData = {
        assetName: values.assetName,
        assetType: values.assetType,
        serialNumber: values.serialNumber || null,
        zone: values.zone || null,
        command: values.command || null,
        location: values.location || null,
        brandName: values.brandName || null,
        capacity: values.capacity || null,
        condition: values.condition,
        assetStatus: values.assetStatus,
        category: values.category || null,
        buildingType: values.buildingType || null,
        noOfBuilding: values.noOfBuilding || null,
        constructionCost: values.constructionCost || null,
        renovationCost: values.renovationCost || null,
        acquisitionCost: values.acquisitionCost || null,
        // Handle dates - send null if empty string, otherwise send the date
        acquisitionDate: values.acquisitionDate ? new Date(values.acquisitionDate).toISOString() : null,
        constructionDate: values.constructionDate ? new Date(values.constructionDate).toISOString() : null,
        renovationDate: values.renovationDate ? new Date(values.renovationDate).toISOString() : null,
        insurancePolicyNo: values.insurancePolicyNo || null,
        availableDocument: values.availableDocument,
        litigationStatus: values.litigationStatus || null,
        description: values.description || null,
        remark: values.remark || null,
      };


      if (isEditMode && selectedAsset?.id) {
        await dispatch(UpdateAssetThunk({ id: selectedAsset.id, data: submitData })).unwrap();
      } else {
        await dispatch(CreateAssetThunk(submitData)).unwrap();
      }

      resetForm();
      setShowForm(false);
      setIsEditMode(false);
      setSelectedAsset(null);
    dispatch(FetchServerTableThunk({ type: 'asset', pageIndex: 0, pageSize: 20 }));
      
    setOpen(false);
      
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await dispatch(DeleteAssetThunk(assetId)).unwrap();
        dispatch(FetchAssetsByCommandThunk(commandId));
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedAsset(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  // Options for select fields
  const assetTypeOptions = [
    { value: 'project', label: 'Project' },
    { value: 'land', label: 'Land' },
    { value: 'electrical', label: 'Electrical Asset' },
  ];

  const conditionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'under_renovation', label: 'Under Renovation' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const assetStatusOptions = [
    { value: 'serviceable', label: 'Serviceable' },
    { value: 'dilapidated', label: 'Dilapidated' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'needs_renovation', label: 'Needs Renovation' },
    { value: 'active', label: 'Active' },
    { value: 'fair', label: 'Fair' },
    { value: 'abandoned', label: 'Abandoned' },
  ];

  const categoryOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Administrative', label: 'Administrative' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Recreational', label: 'Recreational' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Educational', label: 'Educational' },
    { value: 'Industrial', label: 'Industrial' },
  ];

  const buildingTypeOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Administrative', label: 'Administrative' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Recreational', label: 'Recreational' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Educational', label: 'Educational' },
  ];

  const getAssetTypeIcon = (type) => {
    switch(type) {
      case 'land': return <FaLandmark className="w-4 h-4" />;
      case 'electrical': return <FaBolt className="w-4 h-4" />;
      case 'project': return <FaProjectDiagram className="w-4 h-4" />;
      default: return <FaBuilding className="w-4 h-4" />;
    }
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'good': return 'green';
      case 'fair': return 'orange';
      case 'poor': return 'red';
      case 'under_renovation': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2 flex items-center gap-2">
                <FaBuilding className="w-6 h-6" />
              {isEditMode?"Edit Record":"Create New Record"}  
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
          
          {/* Asset Form Modal */}
         
              
           
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="border-b border-gray-200 pb-4">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                        <FaFileAlt className="w-4 h-4" />
                        Basic Information
                      </Typography>
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        {/* Asset Name */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset Name *
                          </label>
                          <Field
                            name="assetName"
                            as={Input}
                            label="Asset Name"
                            size="lg"
                          />
                          <ErrorMessage name="assetName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Asset Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset Type *
                          </label>
                          <Field
                            name="assetType"
                            component={SelectField}
                            options={assetTypeOptions}
                            placeholder="Select Asset Type"
                          />
                          <ErrorMessage name="assetType" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Serial Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Serial Number
                          </label>
                          <Field
                            name="serialNumber"
                            as={Input}
                            label="Serial Number"
                            size="lg"
                          />
                          <ErrorMessage name="serialNumber" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Zone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zone
                          </label>
                          <Field
                            name="zone"
                            as={Input}
                            label="Zone (e.g., Zone A, Zone B)"
                            size="lg"
                          />
                          <ErrorMessage name="zone" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Command */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Command
                          </label>
                          <Field
                            name="command"
                            as={Input}
                            label="Command Name"
                            size="lg"
                            disabled={!!commandData?.name}
                          />
                          <ErrorMessage name="command" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Location */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <Field
                            name="location"
                            as={Input}
                            label="Physical Location Address"
                            size="lg"
                          />
                          <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <Field
                            name="description"
                            as="textarea"
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Detailed description of the asset"
                          />
                          <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Remark */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remark
                          </label>
                          <Field
                            name="remark"
                            as="textarea"
                            rows="2"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Additional remarks or notes"
                          />
                          <ErrorMessage name="remark" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Status & Condition Section */}
                    <div className="border-b border-gray-200 pb-4">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                        <FaShieldAlt className="w-4 h-4" />
                        Status & Condition
                      </Typography>
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        {/* Condition */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condition *
                          </label>
                          <Field
                            name="condition"
                            component={SelectField}
                            options={conditionOptions}
                            placeholder="Select Condition"
                          />
                          <ErrorMessage name="condition" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Asset Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asset Status *
                          </label>
                          <Field
                            name="assetStatus"
                            component={SelectField}
                            options={assetStatusOptions}
                            placeholder="Select Status"
                          />
                          <ErrorMessage name="assetStatus" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Available Document */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available Document
                          </label>
                          <Field
                            name="availableDocument"
                            type="checkbox"
                            as={Checkbox}
                            label="Document Available"
                            className="mt-2"
                          />
                        </div>

                        {/* Litigation Status */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Litigation Status
                          </label>
                          <Field
                            name="litigationStatus"
                            as={Input}
                            label="Litigation Details"
                            size="lg"
                          />
                          <ErrorMessage name="litigationStatus" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Asset-Specific Fields */}
                    {values.assetType === 'land' && (
                      <div className="border-b border-gray-200 pb-4">
                        <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                          <FaLandmark className="w-4 h-4" />
                          Land Information
                        </Typography>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Land Area / Capacity
                            </label>
                            <Field
                              name="capacity"
                              as={Input}
                              label="e.g., 10 Hectares, 5000 sqm"
                              size="lg"
                            />
                            <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Acquisition Date
                            </label>
                            <Field
                              name="acquisitionDate"
                              as={Input}
                              type="date"
                              size="lg"
                            />
                            <ErrorMessage name="acquisitionDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Acquisition Cost (₦)
                            </label>
                            <Field
                              name="acquisitionCost"
                              as={Input}
                              type="number"
                              label="Acquisition Cost"
                              size="lg"
                            />
                            <ErrorMessage name="acquisitionCost" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {values.assetType === 'electrical' && (
                      <div className="border-b border-gray-200 pb-4">
                        <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                          <FaBolt className="w-4 h-4" />
                          Electrical Asset Information
                        </Typography>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Brand Name
                            </label>
                            <Field
                              name="brandName"
                              as={Input}
                              label="Brand/Manufacturer"
                              size="lg"
                            />
                            <ErrorMessage name="brandName" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Capacity/Rating
                            </label>
                            <Field
                              name="capacity"
                              as={Input}
                              label="e.g., 250 kVA, 500 kW"
                              size="lg"
                            />
                            <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Insurance Policy No.
                            </label>
                            <Field
                              name="insurancePolicyNo"
                              as={Input}
                              label="Insurance Policy Number"
                              size="lg"
                            />
                            <ErrorMessage name="insurancePolicyNo" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {values.assetType === 'project' && (
                      <div className="border-b border-gray-200 pb-4">
                        <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                          <FaProjectDiagram className="w-4 h-4" />
                          Project Information
                        </Typography>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Construction Cost (₦)
                            </label>
                            <Field
                              name="constructionCost"
                              as={Input}
                              type="number"
                              label="Construction Cost"
                              size="lg"
                            />
                            <ErrorMessage name="constructionCost" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Construction Date
                            </label>
                            <Field
                              name="constructionDate"
                              as={Input}
                              type="date"
                              size="lg"
                            />
                            <ErrorMessage name="constructionDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Renovation Cost (₦)
                            </label>
                            <Field
                              name="renovationCost"
                              as={Input}
                              type="number"
                              label="Renovation Cost"
                              size="lg"
                            />
                            <ErrorMessage name="renovationCost" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Renovation Date
                            </label>
                            <Field
                              name="renovationDate"
                              as={Input}
                              type="date"
                              size="lg"
                            />
                            <ErrorMessage name="renovationDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Building Information (for all types) */}
                    <div className="border-b border-gray-200 pb-4">
                      <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                        <FaHome className="w-4 h-4" />
                        Building Information
                      </Typography>
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <Field
                            name="category"
                            component={SelectField}
                            options={categoryOptions}
                            placeholder="Select Category"
                          />
                          <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Building Type
                          </label>
                          <Field
                            name="buildingType"
                            component={SelectField}
                            options={buildingTypeOptions}
                            placeholder="Select Building Type"
                          />
                          <ErrorMessage name="buildingType" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Buildings
                          </label>
                          <Field
                            name="noOfBuilding"
                            as={Input}
                            type="number"
                            label="Count"
                            size="lg"
                          />
                          <ErrorMessage name="noOfBuilding" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="bg-teal-500"
                        disabled={isSubmitting || postLoading}
                      >
                        <div className="flex items-center gap-2">
                          <FaSave />
                          {isSubmitting || postLoading ? 'Saving...' : (isEditMode ? 'Update Asset' : 'Add Asset')}
                        </div>
                      </Button>
                     
                    </div>
                  </Form>
                )}
              </Formik>
           </div>


        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setOpen(false)}
            className="border-red-500 text-red-500 flex items-center gap-2"
          >
            <FaTimes className="w-4 h-4" />
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AssetForm;