import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { EYE_ICON, EYE_SLASH_ICON } from '../../../constant/image';
import { fetchLoginRequest } from './redux/login';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { AppDispatch } from '../../../store';
import {
  COMPLETE_PROFILE,
  FORGOT_PASSWORD,
  PROJECT_LIST,
} from '../../../utils/routeConstants';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from './redux/user';
import LeftPanel from '../../../utils/leftPanel';

const SigninSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const initialValues = { username: '', password: '' };

const Login = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmit(true);
    dispatch(fetchLoginRequest(values))
      .unwrap()
      .then((token) => {
        const isToken = typeof token == 'object';
        if (isToken) {
          dispatch(getUserDetails())
            .unwrap()
            .then((userData) => {
              setIsSubmit(false);
              if (userData && userData.last_name && userData.first_name) {
                return navigate(PROJECT_LIST);
              } else {
                return navigate(COMPLETE_PROFILE);
              }
            });
        }
      }).catch(() => {
        setIsSubmit(false);
      })
  };

  return (
    <div className='main-container'>
      <div className='signup-wrapper'>
        <div className='container-fluid'>
          <LeftPanel />
          {/* signup-left-item */}

          <div className='signup-right-item cols'>
            <Formik
              initialValues={initialValues}
              validationSchema={SigninSchema}
              onSubmit={(values) => { handleSubmit(values) }}
            >
              {({ errors, touched, values }) => (
                <Form className='av-tooltip tooltip-label-bottom authForm login-form' autoComplete='off'>
                  <div className='signup-form from-flex'>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='big-head'>
                          Sign In
                          <span className='sm-txt'>
                            Enter your credentials to sign in and proceed
                            further.
                          </span>
                        </div>
                        <div className='form-group'>
                          <div
                            className={`floating-input ${values.username && 'move'
                              }`}
                          >
                            <label>Username</label>
                            <Field
                              className='form-control'
                              name='username'
                              autoComplete='off'
                              maxLength='40'
                            />
                          </div>
                          {errors.username && touched.username ? (
                            <span className='error'>{errors.username}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <div
                            className={`floating-input ${values.password && 'move'
                              }`}
                          >
                            <label>Password</label>
                            <Field
                              className='form-control'
                              name='password'
                              type={showPassword ? 'text' : 'password'}
                              autoComplete='off'
                              maxLength='40'
                            />

                            <img
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                              className='password-icon'
                              src={showPassword ? EYE_SLASH_ICON : EYE_ICON }
                              alt='eye-icon'
                            />
                          </div>
                          {errors.password && touched.password ? (
                            <span className='error'>{errors.password}</span>
                          ) : null}
                        </div>
                        <div className='col-md-12'>
                          <div className='form-group forgot-main'>
                            <a
                              href={FORGOT_PASSWORD}
                              className='btn link-btn help-txt'
                            >
                              Forgot Password?
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <div className='floating-input'>
                            <button
                              type='submit'
                              className='btn primary-btn wid100 sign-in-btn'
                              disabled={isSubmit}
                            >
                             {isSubmit ? '': <span>Sign In</span>}
                              {isSubmit && <div className='loader-inline'>
                                <div className='loader-inner'></div>
                              </div>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <div className='term-txt'>
                            By sign in, you agree to our{' '}
                            <a target="_blank" href='/termCondition'>Terms of Use</a> &amp; <a target="_blank" href='/privacyPolicy'>Privacy Policy</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {/* signup-right-item */}
        </div>
      </div>
    </div>
  );
};
export default Login;
