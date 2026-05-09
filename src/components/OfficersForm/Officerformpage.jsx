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
  const { loading, isSuccess, error } = useSelector((state) => state.PostSlice);
  const role = sessionStorage.getItem('role');

  // Dynamic validation schema based on edit mode
  const getValidationSchema = () => {
    return Yup.object().shape({
      rank: Yup.string()
        .max(50, 'Rank cannot exceed 50 characters')
        .transform((value) => value?.toUpperCase())
        .nullable(),
      fullname: Yup.string()
        .max(255, 'Fullname cannot exceed 255 characters')
        .required('Fullname is required')
        .transform((value) => value?.toUpperCase()),
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
          // Password is required only when creating new user
          is: () => !isEdit,
          then: (schema) => schema.required('Password is required'),
          otherwise: (schema) => schema.notRequired()
        }),
      svn: Yup.string()
        .matches(/^\d{5}$/, 'SVN must be exactly 5 digits')
        .nullable(),
      accessLevel: Yup.string().required('Access Level is required'),
      zone: Yup.string().nullable(),
    });
  };

  // Properly map initial values from userData for both create and edit modes
  const getInitialValues = () => {
    return {
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
      
      // Don't send password if it's empty in edit mode
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      // Remove id from create mode
      if (!isEdit && submitData.id) {
        delete submitData.id;
      }

      const confirmMessage = isEdit ? 'Update this user?' : 'Create this user?';
      
      if (confirm(confirmMessage)) {
        const result = await dispatch(action(submitData)).unwrap();
        
        if (result) {
          resetForm();
          setOpen(false);
          
          // Refresh the table data
          dispatch(FetchServerTableThunk({
            type: 'officer',
            pageIndex: 0,
            pageSize: 20,
            filters: {},
            sort: []
          }));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error toast here
      alert(error?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const zoneOptions = [
    { value: "A", label: "Zone A" },
    { value: "B", label: "Zone B" },
    { value: "C", label: "Zone C" },
    { value: "D", label: "Zone D" },
    { value: "HQ", label: "Headquarters" },
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

  const accessLevelOptions = [
    { value: 'allocator', label: 'Vehicle Allocator' },
    { value: 'driver', label: 'Driver' },
    { value: 'chief_driver_com', label: 'Chief Driver ' },
    { value: 'chief_driver', label: 'Chief Driver HQ' },
    { value: 'transport', label: 'OC Transport & Logistic' },
    { value: 'mechanic', label: 'OC Mechanic' },
    { value: 'user', label: 'User Management' },
    { value: 'manager', label: 'Fleet Manager HQ' },
    { value: 'view', label: 'View Access' },
    { value: 'zone', label: 'Zonal Access' },
  ];

  const rankOptions = [
    { value: 'caIII', label: 'Customs Assistant III' },
    { value: 'caII', label: 'Customs Assistant II' },
    { value: 'caI', label: 'Customs Assistant I' },
    { value: 'aic', label: 'Assistant Inspector of Customs' },
    { value: 'ic', label: 'Inspector of Customs' },
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
      
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            {/* Access Level Field */}
            <div>
              <Field
                name="accessLevel"
                component={SelectField}
                options={accessLevelOptions}
                onChange={(option) => {
                  setFieldValue('accessLevel', option.value);
                }}
                placeholder="Select Access Level"
                id="accessLevel"
              />
              <ErrorMessage name="accessLevel" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Rank Field */}
            <div>
              <Field 
                name="rank" 
                component={SelectField} 
                options={rankOptions} 
                placeholder="Select Rank" 
                label="Rank" 
                id="rank"
              />
              <ErrorMessage name="rank" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Fullname Field */}
            <div>
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
              <ErrorMessage name="fullname" component="div" id="fullname-error" className="text-red-500 text-sm" />
            </div>

            {/* Phone Field */}
            <div>
              <Field 
                name="phone" 
                as={Input} 
                label="Phone" 
                id="phone"
                aria-describedby="phone-error"
              />
              <ErrorMessage name="phone" component="div" id="phone-error" className="text-red-500 text-sm" />
            </div>

            {/* Command Field */}
            <div>
              <Field
                name="command"
                component={SelectField}
                options={commandOptions}
                placeholder="Select Command"
                isDisabled={role === 'cpc'}
                label="Command"
                id="command"
                onChange={(option) => {
                  setFieldValue('command', option.value);
                }}
              />
              <ErrorMessage name="command" component="div" className="text-red-500 text-sm" />
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
              <ErrorMessage name="zone" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Email Field - Disabled in edit mode */}
            <div>
              <Field
                name="email"
                as={Input}
                label="Email"
                id="email"
                aria-describedby="email-error"
                disabled={isEdit}
                className={isEdit ? "bg-gray-100" : ""}
              />
              <ErrorMessage name="email" component="div" id="email-error" className="text-red-500 text-sm" />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed in edit mode</p>
              )}
            </div>

            {/* Password Field - Required only for create mode */}
            <div>
              <Field 
                name="password" 
                type="password" 
                as={Input} 
                label={isEdit ? "New Password (optional)" : "Password"} 
                id="password"
                aria-describedby="password-error"
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
              />
              <ErrorMessage name="password" component="div" id="password-error" className="text-red-500 text-sm" />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">Only enter if you want to change the password</p>
              )}
            </div>

            {/* SVN Field */}
            <div>
              <Field 
                name="svn" 
                as={Input} 
                label="SVN" 
                id="svn"
                maxLength={5}
                aria-describedby="svn-error"
              />
              <ErrorMessage name="svn" component="div" id="svn-error" className="text-red-500 text-sm" />
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-3 flex gap-3">
              <Button 
                type="submit" 
                className="bg-teal-500"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Processing...' : isEdit ? 'Update User' : 'Create User'}
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
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default UserForm;