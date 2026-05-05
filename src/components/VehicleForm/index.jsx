import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, Spinner } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { SelectField } from '../SelectionField';
import { CreateVehicleThunk, UpdateVehicleThunk } from '../../store/thunks/VehicleThunk';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';

const VehicleForm = ({ setOpen, vehicleData = {}, isEdit }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.PostSlice);
  const [imagePreview, setImagePreview] = useState({
    pictureA: vehicleData.pictureA || '',
    pictureB: vehicleData.pictureB || '',
    pictureC: vehicleData.pictureC || '',
    pictureD: vehicleData.pictureD || '',
    pictureE: vehicleData.pictureE || '',
  });

  const validationSchema = Yup.object().shape({
    registrationNumber: Yup.string()
      .max(50, 'Registration number cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    chassisNumber: Yup.string()
      .max(100, 'Chassis number cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    vehicleTypeModel: Yup.string()
      .max(100, 'Vehicle type/model cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    engineNumber: Yup.string()
      .max(100, 'Engine number cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    vehicleLocation: Yup.string()
      .max(200, 'Vehicle location cannot exceed 200 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    command: Yup.string()
      .max(100, 'Command cannot exceed 100 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    zone: Yup.string()
      .max(50, 'Zone cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable(),
    condition: Yup.string()
      .required('Condition is required')
      .oneOf(['SERVICEABLE', 'UNSERVICEABLE'], 'Invalid condition'),
    remark: Yup.string()
      .max(500, 'Remark cannot exceed 500 characters')
      .nullable(),
    comments: Yup.string()
      .max(1000, 'Comments cannot exceed 1000 characters')
      .nullable(),
    pictureAFile: Yup.mixed().nullable(),
    pictureBFile: Yup.mixed().nullable(),
    pictureCFile: Yup.mixed().nullable(),
    pictureDFile: Yup.mixed().nullable(),
    pictureEFile: Yup.mixed().nullable(),
  });

  const initialValues = {
    registrationNumber: vehicleData.registrationNumber || '',
    chassisNumber: vehicleData.chassisNumber || '',
    vehicleTypeModel: vehicleData.vehicleTypeModel || '',
    engineNumber: vehicleData.engineNumber || '',
    vehicleLocation: vehicleData.vehicleLocation || '',
    command: vehicleData.command || '',
    zone: vehicleData.zone || '',
    condition: vehicleData.condition || '',
    remark: vehicleData.remark || '',
    comments: vehicleData.comments || '',
    pictureAFile: null,
    pictureBFile: null,
    pictureCFile: null,
    pictureDFile: null,
    pictureEFile: null,
  };

  const handleFileChange = (event, setFieldValue, fieldName, previewField) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum size is 5MB.');
        return;
      }
      
      setFieldValue(fieldName, file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [previewField]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      const textFields = [
        'registrationNumber', 'chassisNumber', 'vehicleTypeModel', 
        'engineNumber', 'vehicleLocation', 'command', 'zone', 
        'condition', 'remark', 'comments'
      ];
      
      textFields.forEach(field => {
        if (values[field] && values[field].trim() !== '') {
          formData.append(field, values[field]);
        }
      });
      
      // Append image files
      const imageFields = ['pictureAFile', 'pictureBFile', 'pictureCFile', 'pictureDFile', 'pictureEFile'];
      imageFields.forEach(field => {
        if (values[field]) {

          formData.append(field, values[field]);
        }
      });
      
      console.log(formData.values()); // Example of accessing form data
      if (isEdit && vehicleData.id) {
        await dispatch(UpdateVehicleThunk({ 
          id: vehicleData.id, 
          vehicleData: formData 
        })).unwrap();
      } else {
        await dispatch(CreateVehicleThunk(formData)).unwrap();
      }
      
      resetForm();
      setOpen(false);
      dispatch(FetchServerTableThunk({ type: 'vehicle', pageIndex: 0, pageSize: 20 }));
      
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert(error.message || 'Error saving vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: 'SERVICEABLE', label: 'SERVICEABLE' },
    { value: 'UNSERVICEABLE', label: 'UNSERVICEABLE' }
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
    { value: "PLATEAU / BENUE / NASSARAWA", label: "PLATEAU / BENUE / NASSARAWA" },
    { value: "OYO / OSUN", label: "OYO / OSUN" },
    { value: "PTML", label: "PTML" },
    { value: "SEME", label: "SEME" },
    { value: "SOKOTO / ZAMAFARA", label: "SOKOTO / ZAMAFARA" },
    { value: "TINCA", label: "TINCA" },
    { value: "ZONE A HQ", label: "ZONE A HQ" },
    { value: "ONNE OIL AND GAS", label: "ONNE OIL AND GAS" },
    { value: "OGUN II", label: "OGUN II" },
    { value: "KIRIKIRI LIGHTER TERMINAL", label: "KIRIKIRI LIGHTER TERMINAL" },
    { value: "PHI", label: "PHI" },
    { value: "PHIII(ONNE)", label: "PHIII(ONNE)" }
  ];

  const zoneOptions = [
    { value: "A", label: "Zone A" },
    { value: "B", label: "Zone B" },
    { value: "C", label: "Zone C" },
    { value: "D", label: "Zone D" },
    { value: "HQ", label: "Headquarters" },
  ];

  return (
    <Card className="p-6 w-full mx-auto mt-6 max-h-[90vh] overflow-y-auto">
      <Typography variant="h4" className="mb-6" color="blue-gray">
        {isEdit ? 'Edit Vehicle Information' : 'Add New Vehicle Information'}
      </Typography>
      
      {error && (
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
      )}
        
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            {/* Registration Number */}
            <div>
              <Field
                name="registrationNumber"
                as={Input}
                label="Registration Number"
                id="registrationNumber"
                size="lg"
                onChange={(e) => {
                  setFieldValue('registrationNumber', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="registrationNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Chassis Number */}
            <div>
              <Field
                name="chassisNumber"
                as={Input}
                label="Chassis Number"
                id="chassisNumber"
                size="lg"
                onChange={(e) => {
                  setFieldValue('chassisNumber', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="chassisNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Vehicle Type/Model */}
            <div>
              <Field
                name="vehicleTypeModel"
                as={Input}
                label="Vehicle Type/Model"
                id="vehicleTypeModel"
                size="lg"
                onChange={(e) => {
                  setFieldValue('vehicleTypeModel', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="vehicleTypeModel" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Engine Number */}
            <div>
              <Field
                name="engineNumber"
                as={Input}
                label="Engine Number"
                id="engineNumber"
                size="lg"
                onChange={(e) => {
                  setFieldValue('engineNumber', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="engineNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Vehicle Location */}
            <div>
              <Field
                name="vehicleLocation"
                as={Input}
                label="Vehicle Location"
                id="vehicleLocation"
                size="lg"
                onChange={(e) => {
                  setFieldValue('vehicleLocation', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="vehicleLocation" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Command Field */}
            <div>
              <Field
                name="command"
                component={SelectField}
                options={commandOptions}
                placeholder="Select Command"
                label="Command"
                id="command"
              />
              <ErrorMessage name="command" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Zone Field */}
            <div>
              <Field
                name="zone"
                component={SelectField}
                options={zoneOptions}
                placeholder="Select Zone"
                label="Zone"
                id="zone"
              />
              <ErrorMessage name="zone" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Condition Field */}
            <div>
              <Field
                name="condition"
                component={SelectField}
                options={conditionOptions}
                placeholder="Select Condition"
                label="Condition"
                id="condition"
                required
              />
              <ErrorMessage name="condition" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Remark */}
            <div>
              <Field
                name="remark"
                as={Input}
                label="Remark"
                id="remark"
                size="lg"
              />
              <ErrorMessage name="remark" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Comments */}
            <div className="lg:col-span-3">
              <Typography variant="h6" className="mb-2" color="blue-gray">
                Additional Comments
              </Typography>
              <Field
                name="comments"
                as="textarea"
                label="Comments"
                id="comments"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
              />
              <ErrorMessage name="comments" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Picture Upload Fields */}
            <div className="lg:col-span-3">
              <Typography variant="h6" className="mb-2" color="blue-gray">
                Vehicle Pictures
              </Typography>
              <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
                {/* Picture A */}

                <div>
                  <Typography variant="small" className="mb-1">Front Image</Typography>
                  <input
                    type="file"
                    
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, setFieldValue, 'pictureAFile', 'pictureA')}
                    className="mb-2"
                  />
                  {imagePreview.pictureA && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.pictureA} 
                        alt="Preview A" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('pictureAFile', null);
                          setImagePreview(prev => ({ ...prev, pictureA: null }));
                        }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="pictureAFile" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Picture B */}
                <div>
                  <Typography variant="small" className="mb-1">Rear Image</Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, setFieldValue, 'pictureBFile', 'pictureB')}
                    className="mb-2"
                  />
                  {imagePreview.pictureB && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.pictureB} 
                        alt="Preview B" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('pictureBFile', null);
                          setImagePreview(prev => ({ ...prev, pictureB: null }));
                        }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="pictureBFile" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Picture C */}
                <div>
                  <Typography variant="small" className="mb-1">Side 1 Image</Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, setFieldValue, 'pictureCFile', 'pictureC')}
                    className="mb-2"
                  />
                  {imagePreview.pictureC && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.pictureC} 
                        alt="Preview C" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('pictureCFile', null);
                          setImagePreview(prev => ({ ...prev, pictureC: null }));
                        }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="pictureCFile" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Picture D */}
                <div>
                  <Typography variant="small" className="mb-1">Interior Image</Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, setFieldValue, 'pictureDFile', 'pictureD')}
                    className="mb-2"
                  />
                  {imagePreview.pictureD && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.pictureD} 
                        alt="Preview D" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('pictureDFile', null);
                          setImagePreview(prev => ({ ...prev, pictureD: null }));
                        }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="pictureDFile" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Picture E */}
                <div>
                  <Typography variant="small" className="mb-1">Side 2 Image</Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, setFieldValue, 'pictureEFile', 'pictureE')}
                    className="mb-2"
                  />
                  {imagePreview.pictureE && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.pictureE} 
                        alt="Preview E" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('pictureEFile', null);
                          setImagePreview(prev => ({ ...prev, pictureE: null }));
                        }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="pictureEFile" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            {/* Existing Images Preview (for edit mode) */}
            {isEdit && (vehicleData.pictureA || vehicleData.pictureB || vehicleData.pictureC || vehicleData.pictureD || vehicleData.pictureE) && (
              <div className="lg:col-span-3">
                <Typography variant="h6" className="mb-2" color="blue-gray">
                  Existing Images
                </Typography>
                <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
                  {vehicleData.pictureA && (
                    <div>
                      <img 
                        src={`http://localhost:5000/${vehicleData.pictureA}`} 
                        alt="Existing A" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Typography variant="small" className="text-center mt-1">Picture A</Typography>
                    </div>
                  )}
                  {vehicleData.pictureB && (
                    <div>
                      <img 
                        src={`http://localhost:5000/${vehicleData.pictureB}`} 
                        alt="Existing B" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Typography variant="small" className="text-center mt-1">Picture B</Typography>
                    </div>
                  )}
                  {vehicleData.pictureC && (
                    <div>
                      <img 
                        src={`http://localhost:5000/${vehicleData.pictureC}`} 
                        alt="Existing C" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Typography variant="small" className="text-center mt-1">Picture C</Typography>
                    </div>
                  )}
                  {vehicleData.pictureD && (
                    <div>
                      <img 
                        src={`http://localhost:5000/${vehicleData.pictureD}`} 
                        alt="Existing D" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Typography variant="small" className="text-center mt-1">Picture D</Typography>
                    </div>
                  )}
                  {vehicleData.pictureE && (
                    <div>
                      <img 
                        src={`http://localhost:5000/${vehicleData.pictureE}`} 
                        alt="Existing E" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Typography variant="small" className="text-center mt-1">Picture E</Typography>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="lg:col-span-3 flex gap-4 mt-4">
              <Button 
                type="submit" 
                className="bg-teal-500"
                size="lg"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Processing...
                  </div>
                ) : (isEdit ? 'Update Vehicle' : 'Create Vehicle')}
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                className="border-teal-500 text-teal-500"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default VehicleForm;