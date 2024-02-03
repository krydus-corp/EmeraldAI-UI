import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LOGO_ICON,
  EYE_ICON,
  TICK_ICON,
  EYE_SLASH_ICON,
} from '../../../constant/image';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { fetchResetPasswordRequest } from './redux/forgotPassword';
import { FORGOT_PASSWORD, LOGIN } from '../../../utils/routeConstants';
import { PASSWORD_VALIDATIONS } from '../../../constant/validations';
import { NumberLimit } from '../../../constant/number';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = React.useState();
  const [confirmPassword, setConfirmPassword] = React.useState();
  const [isShow, setIsShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isValidation, setIsValidation] = React.useState({
    special: false,
    length: false,
    number: false,
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isDone, setIsDone] = useState(false);
  const navigator = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isMoved, setIsMoved] = useState('');
  const [isError, setIsError] = useState<any>('');

  const handleValidationCheck = (key: string) => {
    const special = RegExp('[!@#$%^&*(),.?":{}|<>]').test(key);
    const length = key.length >= NumberLimit.EIGHT;
    const number = RegExp("(.*\\d.*)").test(key);
    return {
      special,
      length,
      number,
    };
  };
  const userData = useSelector((state: any) => {
    return state.forgotPassword;
  });

  React.useEffect(() => {
    const isVaild = userData.email && userData.otp;
    if (!isVaild) {
      navigator(FORGOT_PASSWORD);
    }
  }, []);

  const handlePasswordChange = (e: any) => {
    const key = e.target?.value;
    setPassword(key);
    const validation = handleValidationCheck(key);
    setIsValidation(validation);
  };
  const handleConfirmPasswordChange = (e: any) => {
    const key = e.target?.value;
    setConfirmPassword(key);
  };
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
    });
  };

  const handleValidation = () => {
    let error;
    if (!password || !confirmPassword) {
      error = PASSWORD_VALIDATIONS.REQUIRED;
    } else if (!isValidation.special) {
      error = PASSWORD_VALIDATIONS.SPECIAL_CHARACTER;
    } else if (!isValidation.number) {
      error = PASSWORD_VALIDATIONS.NUMBER_VALIDATION;
    } else if (!isValidation.length) {
      error = PASSWORD_VALIDATIONS.MIN_CHARACTERS;
    } else if (password !== confirmPassword) {
      error = PASSWORD_VALIDATIONS.MISMATCHED;
    }
    return error;
  };

  const handleReset = async() => {
    const validationErrorMsg = handleValidation();
    const isvalid =
      Object.values(isValidation).every((valid) => {
        return valid === true;
      }) && password === confirmPassword;
    const error: any = document.getElementById('confirmPassword');
    const resetData: any = {
      email: userData.email,
      new_password: password,
      new_password_confirm: confirmPassword,
      token: userData.otp,
    };
    if (isvalid) {
      setIsError('');
      if (!isDone) {
        error.style.border = 'none';
       await dispatch(
          fetchResetPasswordRequest({
            data: resetData,
            toast: toastMsg,
            done: () => {
              setIsDone(true);
            },
          })
        );
        navigator(LOGIN);
      } else {
        navigator(LOGIN);
      }
    } else {
      error.style.border = '0px solid #DC143C';
      error?.focus();
      setIsError(validationErrorMsg);
    }
  };
  const handleShow = (key?: boolean) => {
    if (key) {
      setIsShow({
        ...isShow,
        password: !isShow.password,
      });
    } else {
      setIsShow({
        ...isShow,
        confirmPassword: !isShow.confirmPassword,
      });
    }
  };

  const handleBlur = () => {
    setIsMoved('');
  };

  return (
    <div className='main-container'>
      <div className='signup-wrapper'>
        <div className='container-fluid'>
          <div className='signup-left-item cols'>
            <div className='signup-left-data'>
              <img src={LOGO_ICON} />
              <div className='data'>
                <p>Emerald Ai</p>
                <h3>
                  A Machine
                  <br />
                  Learning platform
                  <br />
                  for collecting,
                  <br />
                  cleaning, &<br />
                  balancing <span>data</span>.
                </h3>
              </div>
            </div>
          </div>
          {/* signup-left-item */}

          <div className='signup-right-item cols'>
            <div className='signup-form from-flex reset-password'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='big-head'>
                    Reset Password
                    <span className='sm-txt'>Enter new password & confirm</span>
                  </div>
                  <div className='form-group'>
                    <div
                      className={`floating-input ${
                        (password || isMoved === 'password') && 'move'
                      } `}
                    >
                      <label>Password</label>
                      <input
                        type={isShow.password ? 'text' : 'password'}
                        className='form-control'
                        onFocus={() => {
                          setIsMoved('password');
                        }}
                        onBlur={handleBlur}
                        name='password'
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <img
                        className='password-icon'
                        src={isShow.password ? EYE_ICON : EYE_SLASH_ICON}
                        onClick={() => handleShow(true)}
                      />
                    </div>
                    <div className='error-list'>
                      <ul>
                        <li className={isValidation.special ? 'active' : ''}>
                          Special character
                        </li>
                        <li className={isValidation.number ? 'active' : ''}>
                          Number
                        </li>
                        <li className={isValidation.length ? 'active' : ''}>
                          8 characters
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='form-group'>
                    <div
                      className={`floating-input ${
                        (confirmPassword || isMoved === 'confirmPassword') &&
                        'move'
                      } `}
                    >
                      <label>Confirm password</label>
                      <input
                        type={isShow.confirmPassword ? 'text' : 'password'}
                        className='form-control'
                        name='Confirm password'
                        onChange={handleConfirmPasswordChange}
                        id='confirmPassword'
                        onFocus={() => {
                          setIsMoved('confirmPassword');
                        }}
                        onBlur={handleBlur}
                      />
                      <img
                        className='password-icon'
                        src={isShow.confirmPassword ? EYE_SLASH_ICON : EYE_ICON }
                        onClick={() => handleShow(false)}
                      />
                    </div>
                    {isError && <span className='error'> {isError} </span>}
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className='form-group'>
                    <div className='floating-input'>
                      <button
                        type='submit'
                        className='btn primary-btn wid100'
                        onClick={handleReset}
                      >
                        {isDone ? <img src={TICK_ICON} /> : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <a href='/' className='btn link-btn back-to-sign'>
                Back to sign in
              </a>
            </div>
          </div>
        </div>
        {/* signup-right-item */}
      </div>
    </div>
  );
};
export default ResetPassword;
