import React from 'react';
import { Card, Input, Button } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';

import { UpdatePasswordThunk } from '../../store/thunks/UserThunk';


const ChangePassword = ({setOpen}) => {
  // Define validation schema with Yup
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required'),
  });
const dispatch = useDispatch()

  const initialValues = {
   oldPassword: '',
   newPassword: '',
  };
  const {loading} = useSelector(state=>state.PostSlice)
  const handleSubmit = async(values, { resetForm }) => {
    await dispatch(UpdatePasswordThunk(values)).unwrap();
    resetForm();
setOpen(false)
    
  };
  
  return (
    <Card className="w-full p-6 mt-6">
     
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="grid grid-cols-1 gap-4">
            <div>
              <Field name="oldPassword" type="password" as={Input} label="Old Password" />
              <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <Field name="newPassword" type="password" as={Input} label="New Password" />
              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
            </div>
            
           
           
         
<div>
<Button type="submit" 
 className="bg-teal-500 w-fit">
        {loading ? 'Loading...' : 'Change Password'}</Button>

</div>
           
          </Form>
        )}
      </Formik>
    
    </Card>
  );
};

export default ChangePassword;
