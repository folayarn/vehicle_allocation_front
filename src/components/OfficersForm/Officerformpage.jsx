import React, { useContext, useEffect, useState } from 'react';
import { Card, Input, Button, Typography, Alert } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserThunk, FetchUserThunk, UpdateUserThunk } from '../../store/thunks/UserThunk';
import { SelectField } from '../SelectionField';
import { UserContext } from '../../context/UserContext';
import Select from 'react-select';
import { FetchServerTableThunk } from '../../store/thunks/ServerTableThunk';

export const MultiSelectField = ({ field, form, options, placeholder, isDisabled, label }) => {
  const handleChange = (selectedOptions) => {
    const valueString = selectedOptions 
      ? selectedOptions.map(option => option.value).join(',') 
      : '';
    
    form.setFieldValue(field.name, valueString);
  };

  const getValue = () => {
    if (options && field.value) {
      const selectedValues = field.value.split(',').filter(val => val !== '');
      return options.filter(option => selectedValues.includes(option.value));
    }
    return [];
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Select
        name={field.name}
        value={getValue()}
        onChange={handleChange}
        options={options}
        isMulti
        isDisabled={isDisabled}
        placeholder={placeholder}
        onBlur={field.onBlur}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          control: (base) => ({
            ...base,
            width: '100%',
          }),
        }}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

const UserForm = ({ setOpen, userData = {}, isEdit = false }) => {
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const { loading, isSuccess, error } = useSelector((state) => state.PostSlice || {});
  const role = sessionStorage.getItem('role');

  // User type options
  const userTypeOptions = [
    { value: "Fleet", label: "Fleet User" },
    { value: "Asset", label: "Asset User" },
    { value: "Accommodation", label: "Accommodation User" },
    { value: "Store", label: "Store User" },
  ];

  // Dynamic validation schema based on edit mode
  const getValidationSchema = () => {
    return Yup.object().shape({
      userType: Yup.string()
        .required('User Type is required')
        .oneOf(['Fleet', 'Asset', 'Accommodation', 'Store'], 'Invalid user type'),
      rank: Yup.string()
        .max(50, 'Rank cannot exceed 50 characters')
        .nullable(),
      fullname: Yup.string()
        .max(255, 'Fullname cannot exceed 255 characters')
        .required('Fullname is required'),
      phone: Yup.string()
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
        .required('Phone is required'),
      command: Yup.string().required('Command is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .when([], {
          is: () => !isEdit,
          then: (schema) => schema.required('Password is required'),
          otherwise: (schema) => schema.notRequired()
        }),
      svn: Yup.string()
        .matches(/^\d{5}$/, 'SVN must be exactly 5 digits')
        .nullable()
        .transform((value) => value || null),
      accessLevel: Yup.string().required('Access Level is required'),
      zone: Yup.string().nullable(),
    });
  };

  // Properly map initial values from userData for both create and edit modes
  const getInitialValues = () => {
    return {
      userType: userData?.userType || 'Fleet', // Default to Fleet for new users
      rank: userData?.rank || '',
      fullname: userData?.fullname || '',
      phone: userData?.phone || '',
      zone: userData?.zone || '',
      command: userData?.command || userData?.commandName || '', // Handle both field names
      email: userData?.email || '',
      password: '', // Always empty for security
      svn: userData?.svn || '',
      accessLevel: userData?.accessLevel || '',
      officerId: userData?.userId || null
    };
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const action = isEdit ? UpdateUserThunk : CreateUserThunk;
      
      // Prepare data for API
      const submitData = { ...values };
      
      // Transform values to uppercase where needed
      if (submitData.fullname) submitData.fullname = submitData.fullname.toUpperCase();
      if (submitData.rank) submitData.rank = submitData.rank.toUpperCase();
      if (submitData.command) submitData.command = submitData.command;
      
      // Don't send password if it's empty in edit mode
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      // Remove officerId if not needed for create mode
      if (!isEdit && submitData.officerId) {
        delete submitData.officerId;
      }

      const confirmMessage = isEdit 
        ? 'Are you sure you want to update this user?' 
        : `Are you sure you want to create this ${submitData.userType} user?`;
      
      if (window.confirm(confirmMessage)) {
        const result = await dispatch(action(submitData)).unwrap();
        
        if (result) {
          resetForm();
          setOpen(false);
          
          // Refresh the table data based on user type
          dispatch(FetchServerTableThunk({
            type: "officer",
            pageIndex: 0,
            pageSize: 20,
            filters: {},
            sort: []
          }));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const zoneOptions = [
    { value: "Zone A", label: "Zone A" },
    { value: "Zone B", label: "Zone B" },
    { value: "Zone C", label: "Zone C" },
    { value: "Zone D", label: "Zone D" },
    { value: "HQ", label: "Headquarters" },
  ];

  const commandOptions = [
    { value: "ADAMAWA/TARABA", label: "ADAMAWA/TARABA" },
    { value: "APAPA", label: "APAPA" },
        { value: "HQ", label: "HEADQUARTERS" },

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

  const accessLevelOptions = [

    { value: 'allocator', label: 'Fleet Manager' },
    { value: 'store', label: 'Store Manager' },
    { value: 'driver', label: 'NCS Driver' },
    { value: 'chief_driver_com', label: 'Chief Driver' },
    { value: 'chief_driver', label: 'Chief Driver HQ' },
    { value: 'transport', label: 'OC Transport & Logistic' },
    { value: 'mechanic', label: 'OC Mechanical' },
    { value: 'user', label: 'User Management' },
    { value: 'view', label: 'View Access' },
    { value: 'zone', label: 'Zonal Access' },
  ];

const assetLevelOptions = [
    
    { value: 'asset_view', label: 'View Access' },
    { value: 'asset_zone', label: 'Zonal Access' },
    {value: 'manager', label: 'Asset Manager Access'}
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

  return (
    <Card className="p-6 w-full mx-auto mt-6">
      <Typography variant="h5" className="mb-4">
        {isEdit ? 'Edit User' : 'Create New User'}
      </Typography>
      
      {/* Show error alert if exists */}
      {error && (
        <Alert color="red" className="mb-4">
          {typeof error === 'string' ? error : error.message || 'An error occurred'}
        </Alert>
      )}
      
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            {/* User Type Field - Disabled in edit mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type <span className="text-red-500">*</span>
              </label>
              <Field
                name="userType"
                component={SelectField}
                options={userTypeOptions}
                onChange={(option) => {
                  setFieldValue('userType', option?.value || '');
                }}
                placeholder="Select User Type"
                isDisabled={isEdit}
                id="userType"
              />
              <ErrorMessage name="userType" component="div" className="text-red-500 text-sm mt-1" />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">User type cannot be changed in edit mode</p>
              )}
            </div>

            {/* Access Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level <span className="text-red-500">*</span>
              </label>
              <Field
                name="accessLevel"
                component={SelectField}
                options={values.userType === 'Asset' ? assetLevelOptions : values.userType==="Fleet"? accessLevelOptions : []}
                onChange={(option) => {
                  setFieldValue('accessLevel', option?.value || '');
                }}
                placeholder="Select Access Level"
                id="accessLevel"
              />
              <ErrorMessage name="accessLevel" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Rank Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
              <Field 
                name="rank" 
                component={SelectField} 
                options={rankOptions} 
                placeholder="Select Rank" 
                id="rank"
                onChange={(option) => {
                  setFieldValue('rank', option?.value || '');
                }}
              />
              <ErrorMessage name="rank" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Fullname Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fullname <span className="text-red-500">*</span>
              </label>
              <Field
                name="fullname"
                as={Input}
                label="Fullname"
                id="fullname"
                aria-describedby="fullname-error"
                onChange={(e) => {
                  setFieldValue('fullname', e.target.value.toUpperCase());
                }}
              />
              <ErrorMessage name="fullname" component="div" id="fullname-error" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <Field 
                name="phone" 
                as={Input} 
                label="Phone" 
                id="phone"
                aria-describedby="phone-error"
              />
              <ErrorMessage name="phone" component="div" id="phone-error" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Command Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Command <span className="text-red-500">*</span>
              </label>
              <Field
                name="command"
                component={SelectField}
                options={commandOptions}
                placeholder="Select Command"
                isDisabled={role === 'cpc'}
                id="command"
                onChange={(option) => {
                  setFieldValue('command', option?.value || '');
                }}
              />
              <ErrorMessage name="command" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Zone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <Field 
                name="zone" 
                component={SelectField} 
                options={zoneOptions} 
                placeholder="Select Zone" 
                id="zone"
                onChange={(option) => {
                  setFieldValue('zone', option?.value || '');
                }}
              />
              <ErrorMessage name="zone" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Email Field - Disabled in edit mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                name="email"
                as={Input}
                label="Email"
                id="email"
                aria-describedby="email-error"
                disabled={isEdit}
                className={isEdit ? "bg-gray-100" : ""}
              />
              <ErrorMessage name="email" component="div" id="email-error" className="text-red-500 text-sm mt-1" />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed in edit mode</p>
              )}
            </div>

            {/* Password Field - Required only for create mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEdit ? "New Password (optional)" : "Password"}
                {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <Field 
                name="password" 
                type="password" 
                as={Input} 
                id="password"
                aria-describedby="password-error"
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
              />
              <ErrorMessage name="password" component="div" id="password-error" className="text-red-500 text-sm mt-1" />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">Only enter if you want to change the password</p>
              )}
            </div>

            {/* SVN Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SVN (5 digits)</label>
              <Field 
                name="svn" 
                as={Input} 
                label="SVN" 
                id="svn"
                maxLength={5}
                aria-describedby="svn-error"
              />
              <ErrorMessage name="svn" component="div" id="svn-error" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-3 flex gap-3 mt-4">
              <Button 
                type="submit" 
                className="bg-teal-500"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Processing...' : (isEdit ? 'Update User' : 'Create User')}
              </Button>
              
              <Button 
                type="button" 
                variant="outlined"
                className="border-gray-300"
                onClick={() => setOpen(false)}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
            </div>

            {/* Display current user type info in edit mode */}
            {isEdit && values.userType && (
              <div className="lg:col-span-3 mt-2">
                <p className="text-sm text-blue-600">
                  <strong>Note:</strong> Editing a {values.userType} user
                </p>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default UserForm;