import React from 'react';
import { Card, Input, Button } from '@material-tailwind/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';

import { ResetPasswordThunk, UpdatePasswordThunk } from '../../store/thunks/UserThunk';


const ResetPassword = ({  setOpen, userData = {} }) => {
  // Define validation schema with Yup
  const validationSchema = Yup.object().shape({
   
    newPassword: Yup.string().required('New password is required'),
  });
const dispatch = useDispatch()

  const initialValues = {
id:userData.userId,
   newPassword: '',
  };
  const {loading} = useSelector(state=>state.PostSlice)
  const handleSubmit = async(values) => {
    await dispatch(ResetPasswordThunk(values)).unwrap();
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
              <Field name="newPassword" type="password" as={Input} label="New Password" />
              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
            </div>
            
           
           
         
<div>
<Button type="submit" 
 className="bg-teal-500 w-fit">
        {loading ? 'Loading...' : 'Reset Password'}</Button>

</div>
           
          </Form>
        )}
      </Formik>
    
    </Card>
  );
};

export default ResetPassword;
