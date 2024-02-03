import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  fetchForgotPasswordRequest,
  updateEmail,
} from './redux/forgotPassword';
import { EMAIL_ERROR, REQUIRED_EMAIL } from '../../../constant/validations';
import LeftPanel from '../../../utils/leftPanel';

interface IForgotPasswordProps {}

const ForgotPassword: React.FC<IForgotPasswordProps> = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [isMoved, setIsMoved] = useState(false);
  const { enqueueSnackbar , closeSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(EMAIL_ERROR).required(REQUIRED_EMAIL),
  });
  const { handleSubmit, values, handleChange, errors, touched } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleOnGenerateOtp(values, resetForm);
    },
  });

  const toastMsg = (message: string, type: any) => {
    enqueueSnackbar(message, {
      variant: type,
        action: (key) => (
          <i
            className='icon-cross'
            onClick={() => {
              closeSnackbar(key);
            }}
          ></i>
        )
    })
  }

  const handleOnGenerateOtp = (values: any, resetForm: any) => {
    dispatch(
      fetchForgotPasswordRequest({
        email: values.email,
        reset: resetForm,
        navigate,
        toast: toastMsg,
      })
    );
    dispatch(updateEmail(values.email));
  };

  return (
    <div className='main-container'>
      <div className='signup-wrapper'>
        <div className='container-fluid'>
          <LeftPanel />
          {/* signup-left-item */}

          {/* signup-right-item */}
          <div className='signup-right-item cols'>
            <form className='signup-form from-flex' onSubmit={handleSubmit}>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='big-head'>
                    Forgot Password
                    <span className='sm-txt'>
                      Enter your registered email address
                    </span>
                  </div>
                  <div className='form-group'>
                    <div
                      className={`floating-input ${
                        (values.email || isMoved) && 'move'
                      } `}
                    >
                      <label>Enter Email</label>
                      <FormControl
                        type='text'
                        className='form-control'
                        name='email'
                        value={values?.email}
                        onChange={handleChange}
                        onBlur={() => setIsMoved(false)}
                        isInvalid={!!errors.email}
                        onFocus={() => {
                          setIsMoved(true);
                        }}
                      />

                      <FormControl.Feedback
                        className='error forgot-error'
                        type='invalid'
                      >
                        {errors.email && touched.email && errors.email}
                      </FormControl.Feedback>
                    </div>
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className='form-group'>
                    <div className='floating-input'>
                      <button type='submit' className='btn primary-btn wid100'>
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <a href='/' className='btn link-btn back-to-sign'>
                Back to sign in
              </a>
            </form>
          </div>
          {/* signup-right-item */}
        </div>
      </div>
      {/* signup-wrapper */}
    </div>
  );
};
export default ForgotPassword;
