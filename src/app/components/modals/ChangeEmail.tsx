import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { CODE_SEND, EDIT_ICON } from '../../../constant/image';
import { NumberLimit } from '../../../constant/number';
import { fetchForgotPasswordRequest } from '../login/redux/forgotPassword';
import {
  fetchUpdateEmailRequest,
  updateOtpCode,
  verifyUpdateEmailCodeRequest
} from '../login/redux/updateProfile';
import * as yup from 'yup';
import { EMAIL_ERROR, REQUIRED_EMAIL } from '../../../constant/validations';
interface Props {
  show: boolean;
  closeModal: any;
  closeMyProfile: any;
  changeEmail: any;
}

const ChangeEmail = ({
  show,
  closeModal,
  closeMyProfile,
  changeEmail,
}: Props) => {
  const storageData: any = localStorage.getItem('User');

  const userProfileData = JSON.parse(storageData);

  const userEmail = userProfileData && userProfileData.email;
  const userId = userProfileData && userProfileData.id;

  const [pageChange, setPageChange] = useState(true);
  const [email, setEmail] = useState(userEmail);
  const [isMoved, setIsMoved] = useState(false);
  const [counter, setCounter] = React.useState(NumberLimit.THIRTY);
  const [isResend, setIsResend] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [emailErr, setEmailError] = useState('');
  const dispatch: any = useDispatch();
const schema =yup.object().shape({
  email: yup.string().email(EMAIL_ERROR).required(REQUIRED_EMAIL),
});
// check validity
const checkValid =(val:string)=>{
  schema
  .validate({email:val}).then(()=>{
    setEmailError('');
  if (email) {
    dispatch(
      fetchUpdateEmailRequest({
        id: userId,
        email,
        reset: () => {
          setPageChange(false);
        },
      })
    );
    setCounter(NumberLimit.THIRTY);
  }})
    .catch((err) => {
      setEmailError(err.errors[0])
    });
}

  React.useEffect(() => {
    if (!pageChange) {
      counter > 0
        ? setTimeout(() => setCounter(counter - 1), NumberLimit.THOUSAND)
        : setIsResend(true);
    }
  }, [counter, pageChange]);

  const handleChange = (e: any) => {
    const key = e.target.value;
    if (key === userEmail) {
      setEmailError('');
    }
    setEmail(key);  
  };

  const handleOtpEnter = (e: any) => {
    setOtp(e.target.value);
  };
  const handleSubmit = () => {
  checkValid(email);
  };

  const handleResend = () => {
    setCounter(NumberLimit.THIRTY);
    setIsResend(false);
    dispatch(
      fetchForgotPasswordRequest({
        email,
        reset: () => {
          setPageChange(false);
        },
      })
    );
  };
  const handleChangeBtn = () => {
    setPageChange(true);
  };

  const handleVerify = async() => { 
    if (otp.length === NumberLimit.EIGHT) {
      await dispatch(verifyUpdateEmailCodeRequest({
        id:userId,
        email:email,
        code:otp
      })).unwrap().then(async()=>{
          await dispatch(updateOtpCode(otp));
          await changeEmail(email);
         setPageChange(true);
          closeModal();      
      })  
    }
  };
  const closeCurrentModal = () => {
    setEmailError('');
    setEmail(userEmail);
    setPageChange(true);
    closeModal();
  };
  return (
    <Modal
      show={show}
      dialogClassName='change-email-modal'
      className='profile-modal modal-right'
    >
      <div className='modal-head-section'>
        <div className='modal-head'>
          <h3>
            Change Email{' '}
            <Button
              variant='secondary'
              className='btn-close'
              onClick={() => closeCurrentModal()}
            ></Button>
          </h3>
        </div>
      </div>
      <Modal.Body>
        {pageChange ? (
          <div className='from-flex step-3'>
            <div className='row'>
              <div className='col-md-12'>
                <h4>Please enter your new email for verification</h4>
                <div className='form-group'>
                <div
                    className={`floating-input ${
                      (email || isMoved) && 'move'
                    }  `}
                  >
                    <label>Email Address</label>

                    <input
                      type='text'
                      className='form-control'
                      value={email}
                      onChange={handleChange}
                      onFocus={() => {
                        setIsMoved(true);
                      }}
                      onBlur={() => {
                        setIsMoved(false);
                      }}
                    />
                  </div>
                  {!email && <span className='error'>{REQUIRED_EMAIL}</span>}
                  {(email && emailErr) && <span className='error'>{emailErr}</span>}
                </div>
              </div>
              {email && email !== userEmail &&
                <div className='col-md-12'>
                  <div className='center-btn'>
                    <button
                      type='button'
                      className='btn primary-btn wid100'
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                 }
            </div>
          </div>
        ) : (
          <div className='from-flex code-send-wrapper step-4'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='big-head'>
                  <img className='code-send-img' src={CODE_SEND} />
                  Code Sent Successfully!
                </div>
                <div className='enter-email-txt'>
                  Enter the code that was sent to
                </div>
                <div className='enter-email-sm'>
                  {email} -{' '}
                  <a onClick={handleChangeBtn}>
                    Change <img src={EDIT_ICON} />
                  </a>
                </div>
                <div className='form-group'>
                  <div className='input-boxs'>
                    <input
                      type='text'
                      autoFocus
                      className={
                        otp ? 'form-control active-state' : 'form-control'
                      }
                      placeholder='Enter Code'
                      style={{ width: '200px' }}
                      maxLength={8}
                      id='otp'
                      name='otp'
                      onChange={handleOtpEnter}
                    />
                  </div>
                  {isResend ? (
                    <div className='resend-code active' onClick={handleResend}>
                      Resend Code
                    </div>
                  ) : (
                    <div className='resend-code'>
                      Resend Code in {<span>00:{counter}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className='col-md-12'>
                <div className='form-group'>
                  <div className='floating-input'>
                    <button
                      type='submit'
                      className='btn primary-btn wid100'
                      onClick={handleVerify}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* step-3 */}

        {/* step-4 */}
      </Modal.Body>
    </Modal>
  );
};

export default ChangeEmail;
