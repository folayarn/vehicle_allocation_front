import React, { useContext, useEffect, useState } from 'react';
import { Card, Input, Button } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUserThunk, UpdateUserThunk } from '../../store/thunks/UserThunk';
import { SelectField } from '../SelectionField';
import { UserContext } from '../../context/UserContext';
import { MultiSelectField } from '../OfficersForm/Officerformpage';


const EditUserForm = ({ commands, factory, setOpen, userData = {}, isEdit }) => {
  const [access, setAccess] = useState(userData?.accessLevel || '');
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const { loading } = useSelector(state => state.PostSlice);
  const [filteredFactories, setFilteredFactories] = useState([]);
  const [factoryOptions, setFactoryOptions] = useState([]);
  const [isFactoryOptionsReady, setIsFactoryOptionsReady] = useState(false);

  const role = sessionStorage.getItem("role");
  const defaultCommand = role === 'cpc' && commands?.length ? userData?.commandId : '';

  const validationSchema = Yup.object().shape({
    rank: Yup.string()
      .max(50, 'Rank cannot exceed 50 characters')
      .transform((value) => value?.toUpperCase())
      .nullable()
      .when('accessLevel', {
        is: (val) => !['view', 'super', 'ftz'].includes(val),
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.notRequired()
      }),
    fullname: Yup.string()
      .max(255, 'Fullname cannot exceed 255 characters')
      .required('Fullname is required')
      .transform((value) => value?.toUpperCase()),
    phone: Yup.string()
      .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
      .required('Phone is required'),
    commandId: Yup.string().required('Command ID is required'),
    email: Yup.string()
      .email('Invalid email format')
      .nullable()
      .required(isEdit ? undefined : 'Email is required'),
    svn: Yup.number()
      .typeError('SVN must be a number')
      .nullable()
      .when('accessLevel', {
        is: (val) => !['view', 'super', 'ftz'].includes(val),
        then: (schema) => schema.required(isEdit ? undefined : 'SVN is required'),
        otherwise: (schema) => schema.notRequired()
      }),
    accessLevel: Yup.string().required('Access Level is required'),
    factoryId: Yup.mixed()
      .when('accessLevel', {
        is: (val) => val === 'officer' || val === 'view' || val === 'super',
        then: (schema) => schema.required('Factory is required'),
        otherwise: (schema) => schema.nullable()
      })
      .when('accessLevel', {
        is: (val) => val === 'semi',
        then: (schema) => schema.required('Factory is required'),
        otherwise: (schema) => schema.nullable()
      })
  });

  // Get initial factoryId value based on access level
  const getInitialFactoryId = () => {
    if (userData.accessLevel === 'semi') {
      return userData.factoryIds || null;
    } else {
      return userData.factoryId || null;
    }
  };

  const initialValues = {
    rank: userData.rank || '',
    fullname: userData.fullname || '',
    phone: userData.phone || '',
    officerId: userData.userId || '',
    commandId: userData.commandId || defaultCommand,
    email: userData.email || '',
    accessLevel: userData.accessLevel || '',
    factoryId: getInitialFactoryId(),
    svn: userData.svn || '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(UpdateUserThunk(values)).unwrap();
      dispatch(FetchUserThunk());
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCommandChange = (commandId, setFieldValue) => {
    const selectedCommand = commands?.find(cmd => cmd.commandId === commandId);
    if (selectedCommand) {
      const filtered = factory?.result.filter(f => f.commandCode === selectedCommand.commandCode);
      setFilteredFactories(filtered);
      
      const options = filtered.map((z) => ({ 
        value: z.factoryId, 
        label: `${z.factoryName}` 
      }));
      setFactoryOptions(options);
      setIsFactoryOptionsReady(true);
    }
    
    // Reset factory selection when command changes
    setFieldValue('factoryId', '');
  };

  // Initialize factory options based on current command
  useEffect(() => {
    if (userData.commandId && factory?.result.length > 0 && commands?.length > 0) {
      const selectedCommand = commands.find(cmd => cmd.commandId === userData.commandId);
      if (selectedCommand) {
        const filtered = factory?.result.filter(f => f.commandCode === selectedCommand.commandCode);
        setFilteredFactories(filtered);
        
        const options = filtered.map((z) => ({ 
          value: z.factoryId, 
          label: `${z.factoryName}` 
        }));
        setFactoryOptions(options);
        setIsFactoryOptionsReady(true);
      }
    } else if (userData.commandId) {
      // If factories or commands aren't loaded yet, try again after a delay
      const timer = setTimeout(() => {
        if (factory.length > 0 && commands?.length > 0) {
          const selectedCommand = commands.find(cmd => cmd.commandId === userData.commandId);
          if (selectedCommand) {
            const filtered = factory.filter(f => f.commandCode === selectedCommand.commandCode);
            setFilteredFactories(filtered);
            
            const options = filtered.map((z) => ({ 
              value: z.factoryId, 
              label: `${z.factoryName}` 
            }));
            setFactoryOptions(options);
            setIsFactoryOptionsReady(true);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [userData.commandId, commands, factory]);

  const commandOptions = commands?.map((z) => ({ 
    value: z.commandId, 
    label: `${z.commandName} - ${z.commandCode}` 
  }));

  const accessLevelOptions = [
    { value: 'cpc', label: 'CPC' },
    { value: 'officer', label: 'Factory Officer' },
    { value: 'view', label: 'View Access For excise Trader' },
    { value: 'super', label: 'view Access For Parent Factory' },
    { value: 'all', label: 'View Access' },
    { value: 'cac', label: 'View Access For CAC' },
    { value: 'semi', label: 'View Access For Multiple factories' },
    { value: 'oc_excise', label: 'View Access For OC Excise' },
    { value: 'ftz', label: 'View Access For FTZ Operator' },
    { value: 'user', label: 'User Management' },
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div>
              <Field
                name="accessLevel"
                component={SelectField}
                options={accessLevelOptions}
                onChange={(option) => {
                  setFieldValue('accessLevel', option.value);
                  setAccess(option.value);
                  // Reset dependent fields when access level changes
                  if (option.value !== 'officer' && option.value !== 'view' && option.value !== 'semi' && option.value !== 'super') {
                    setFieldValue('factoryId', '');
                  }
                }}
                placeholder="Select Access Level"
                id="accessLevel"
              />
              <ErrorMessage name="accessLevel" component="div" className="text-red-500 text-sm" />
            </div>
           {  !['view', 'super', 'ftz'].includes(values.accessLevel) && (
            <div>
              <Field name="rank" component={SelectField} options={rankOptions} placeholder="Select Rank" label="Rank" />
              <ErrorMessage name="rank" component="div" className="text-red-500 text-sm" />
            </div>
            )}
            
            <div>
              <Field name="fullname" as={Input} label="Fullname" />
              <ErrorMessage name="fullname" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <Field name="phone" as={Input} label="Phone" />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <Field
                name="commandId"
                component={SelectField}
                options={commandOptions}
                placeholder="Select Command"
                isDisabled={role === 'cpc'}
                label="Command"
                id="commandId"
                onChange={(option) => {
                  setFieldValue('commandId', option.value);
                  handleCommandChange(option.value, setFieldValue);
                }}
              />
              <ErrorMessage name="commandId" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <Field name="email" as={Input} label="Email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            
            {!['super','view','ftz'].includes(values.accessLevel) && (
              <div>
                <Field name="svn" as={Input} label="SVN" maxLength={5} />
                <ErrorMessage name="svn" component="div" className="text-red-500 text-sm" />
              </div>
            )}
                
            {/* Factory ID Field - Single select for officer/view */}
            {['officer', 'view', 'super'].includes(values.accessLevel) && (
              <div>
                <Field
                  name="factoryId"
                  component={SelectField}
                  options={factoryOptions}
                  placeholder={isFactoryOptionsReady ? "Select Factory" : "Loading factories..."}
                  id="factoryId"
                  key={factoryOptions.length} // Force re-render when options change
                />
                <ErrorMessage name="factoryId" component="div" className="text-red-500 text-sm" />
              </div>
            )}
                
            {/* Factory ID Field - Multi select for semi */}
            {values.accessLevel === 'semi' && (
              <div>
                <Field
                  name="factoryId"
                  component={MultiSelectField}
                  options={factoryOptions}
                  placeholder={isFactoryOptionsReady ? "Select Factories" : "Loading factories..."}
                  id="factoryId"
                  key={factoryOptions.length} // Force re-render when options change
                />
                <ErrorMessage name="factoryId" component="div" className="text-red-500 text-sm" />
              </div>
            )}
            
            <Button type="submit" className="bg-teal-500 w-fit">
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default EditUserForm;