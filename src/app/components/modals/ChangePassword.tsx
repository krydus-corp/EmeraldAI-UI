import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { EYE_ICON, EYE_SLASH_ICON } from '../../../constant/image';
import { fetchPasswordChangeRequest } from '../login/redux/updateProfile';
import * as Yup from 'yup';
import { AppDispatch } from '../../../store';
import { NumberLimit } from '../../../constant/number';

interface Props {
  show: boolean;
  closeModal: any;
}
interface IVisibleState {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

const ChangePassword = ({ show, closeModal }: Props) => {
  const [isVisble, setIsVisible] = useState<any>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isFocus, setIsFocus] = useState('');
  const [isValidation, setIsValidation] = React.useState({
    special: false,
    length: false,
    number: false,
  });
  const dispatch: AppDispatch = useDispatch();

  const storageData: any = localStorage.getItem('User');

  const userData = JSON.parse(storageData);
  
  const userId = userData && userData.id;

  const handleVisble = (key: string) => {
    const updatedState = {
      ...isVisble,
      [key]: !isVisble[key],
    };
    setIsVisible(updatedState);
  };
  const handlePasswordValidationCheck = (key: string) => {
    const special = RegExp('[!@#$%^&*(),.?":{}|<>]').test(key);
    const length = key.length >= NumberLimit.EIGHT;
    const number = RegExp("(.*\\d.*)").test(key);
    return {
      special,
      length,
      number,
    };
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Please enter your new password')
      .max(NumberLimit.TWINTY, 'Password too long')
      .matches(
        /^(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must contain 8 characters, one number and one special case Character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    currentPassword: Yup.string()
      .required('Please enter your current password')
      .max(NumberLimit.TWINTY, 'Password too long'),
  });
  const { handleSubmit, values, handleBlur, handleChange, errors, touched } =
    useFormik({
      initialValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      validationSchema,
      onSubmit: (values, { resetForm }) => {
        handleUpdateApicall(values, resetForm);
      },
    });
  const handleUpdateApicall = (value: any, resetForm: any) => {
    const payloadData = {
      new_password: value.newPassword,
      new_password_confirm: value.confirmPassword,
      old_password: value.currentPassword,
    };
    dispatch(
      fetchPasswordChangeRequest({
        data: payloadData,
        id: userId,
        reset: resetForm,
        close: closeModal,
      })
    );
  };

  return (
    <Modal show={show} className='change-password-modal modal-right'>
      <div className='modal-head-section'>
        <div className='modal-head'>
          <h3>
            Change Password{' '}
            <Button
              variant='secondary'
              className='btn-close'
              onClick={() => {
                closeModal();
              }}
            ></Button>
          </h3>
        </div>
      </div>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className='from-flex'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='form-group'>
                  <div
                    className={`floating-input password-main ${
                      (values.currentPassword ||
                        isFocus === 'currentPassword') &&
                      'move'
                    }`}
                  >
                    <label>Current Password</label>
                    <input
                      type={isVisble.currentPassword ? 'text' : 'password'}
                      className='form-control'
                      name='currentPassword'
                      maxLength={NumberLimit.TWINTY}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onFocus={() => {
                        setIsFocus('currentPassword');
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      value={values.currentPassword}
                    />
                    <img
                      className='password-icon'
                      src={isVisble.currentPassword ? EYE_SLASH_ICON :EYE_ICON}
                      alt='eye-icon'
                      onClick={() => handleVisble('currentPassword')}
                    />
                  </div>
                  {touched.currentPassword && errors.currentPassword && (
                    <span className='error'>{errors.currentPassword}</span>
                  )}
                </div>
              </div>
              <div className='col-md-12'>
                <div className='form-group'>
                  <div
                    className={`floating-input password-main ${
                      (values.newPassword || isFocus === 'newPassword') && 'move'
                    }`}
                  >
                    <label>New Password</label>
                    <input
                      type={isVisble.newPassword ? 'text' : 'password'}
                      className='form-control'
                      name='newPassword'
                      maxLength={NumberLimit.TWINTY}
                      onChange={(e) => {
                        handleChange(e);
                        const validation = handlePasswordValidationCheck(e.target.value);
                        setIsValidation(validation);
                      }}
                      onFocus={() => {
                        setIsFocus('newPassword');
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      value={values.newPassword}
                    />
                    <img
                      className='password-icon'
                      src={isVisble.newPassword ? EYE_SLASH_ICON :EYE_ICON}
                      alt='eye-icon'
                      onClick={() => handleVisble('newPassword')}
                    />
                  </div>
                  <div className='error-list-main'>
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
                  {/* {touched.newPassword && errors.newPassword && (
                    <span className='error'>{errors.newPassword}</span>
                  )} */}
                </div>
              </div>
              <div className='col-md-12'>
                <div className='form-group'>
                  <div
                    className={`floating-input password-main ${
                      (values.confirmPassword ||
                        isFocus === 'confirmPassword') &&
                      'move'
                    }`}
                  >
                    <label>Confirm New Password</label>
                    <input
                      type={isVisble.confirmPassword ? 'text' : 'password'}
                      className='form-control'
                      name='confirmPassword'
                      maxLength={NumberLimit.TWINTY}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onFocus={() => {
                        setIsFocus('confirmPassword');
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      value={values.confirmPassword}
                    />
                    <img
                      className='password-icon'
                      src={isVisble.confirmPassword ? EYE_SLASH_ICON : EYE_ICON}
                      alt='eye-icon'
                      onClick={() => handleVisble('confirmPassword')}
                    />
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <span className='error'>{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
              <div className='col-md-12'>
                <div className='form-group'>
                  <button type='submit' className='btn primary-btn wid100'>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePassword;
