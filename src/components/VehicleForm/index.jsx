import React from 'react';
import { Card, Input, Button, Typography, Alert } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { SelectField } from '../SelectionField';
import { CreateVehicleThunk, UpdateVehicleThunk } from '../../store/thunks/VehicleThunk';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';
// import { 
//   CreateVehicleThunk, 
//   UpdateVehicleThunk 
// } from '../../store/thunks/VehicleThunk';

// Custom Year Select Component


const VehicleForm = ({ setOpen, vehicleData = {}, isEdit }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.PostSlice);

  

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
    pictureA: Yup.string().url('Invalid URL format').nullable(),
    pictureB: Yup.string().url('Invalid URL format').nullable(),
    pictureC: Yup.string().url('Invalid URL format').nullable(),
    pictureD: Yup.string().url('Invalid URL format').nullable(),
    pictureE: Yup.string().url('Invalid URL format').nullable(),
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
    pictureA: vehicleData.pictureA || '',
    pictureB: vehicleData.pictureB || '',
    pictureC: vehicleData.pictureC || '',
    pictureD: vehicleData.pictureD || '',
    pictureE: vehicleData.pictureE || '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Clean up the data - remove empty strings
      const submitData = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== '' && value !== null)
      );

     
      if (isEdit && vehicleData.id) {  // Check submitData.id instead
  await dispatch(UpdateVehicleThunk({ id: vehicleData.id, vehicleData: submitData })).unwrap();
} else {
  await dispatch(CreateVehicleThunk(submitData)).unwrap();
}

      resetForm();
      setOpen(false);
      dispatch(FetchServerTableThunk({ type: 'vehicle', pageIndex: 0, pageSize: 20 })); 
      
    } catch (error) {
      console.error('Error saving vehicle:', error);
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
            <div >
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

            {/* Picture Fields */}
            <div className="lg:col-span-3">
              <Typography variant="h6" className="mb-2" color="blue-gray">
                Vehicle Pictures (URLs)
              </Typography>
              <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
                <div>
                  <Field
                    name="pictureA"
                    as={Input}
                    label="Picture A URL"
                    id="pictureA"
                    size="lg"
                  />
                  <ErrorMessage name="pictureA" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    name="pictureB"
                    as={Input}
                    label="Picture B URL"
                    id="pictureB"
                    size="lg"
                  />
                  <ErrorMessage name="pictureB" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    name="pictureC"
                    as={Input}
                    label="Picture C URL"
                    id="pictureC"
                    size="lg"
                  />
                  <ErrorMessage name="pictureC" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    name="pictureD"
                    as={Input}
                    label="Picture D URL"
                    id="pictureD"
                    size="lg"
                  />
                  <ErrorMessage name="pictureD" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    name="pictureE"
                    as={Input}
                    label="Picture E URL"
                    id="pictureE"
                    size="lg"
                  />
                  <ErrorMessage name="pictureE" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="lg:col-span-3 flex gap-4 mt-4">
              <Button 
                type="submit" 
                className="bg-teal-500"
                size="lg"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Processing...' : (isEdit ? 'Update Vehicle' : 'Create Vehicle')}
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