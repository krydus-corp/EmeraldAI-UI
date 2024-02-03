import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store';
import { CODE_SEND, EDIT_ICON } from '../../../constant/image';
import { NumberLimit } from '../../../constant/number';
import { FORGOT_PASSWORD, RESET_PASSWORD } from '../../../utils/routeConstants';
import { fetchForgotPasswordRequest, updateOtp } from './redux/forgotPassword';
import LeftPanel from '../../../utils/leftPanel';

const ForgotPasswordCode = () => {
  const userData = useSelector((state: any) => {
    return state.forgotPassword;
  });
  const [counter, setCounter] = React.useState(NumberLimit.THIRTY);
  const [isResend, setIsResend] = React.useState(false);
  const [otp, setOtp] = React.useState('');

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const isEmailed = userData?.email;
    if (!isEmailed) {
      navigate(FORGOT_PASSWORD);
    }
  }, []);

  React.useEffect(() => {
    counter > 0
      ? setTimeout(() => setCounter(counter - 1), NumberLimit.THOUSAND)
      : setIsResend(true);
  }, [counter]);

  const handleResend = () => {
    setCounter(NumberLimit.THIRTY);
    setIsResend(false);
    dispatch(fetchForgotPasswordRequest({ email: userData.email }));
  };

  const handleVerify = (e: any) => {
    e.preventDefault();
    if (otp.length === NumberLimit.EIGHT) {
      dispatch(updateOtp(otp));
      navigate(RESET_PASSWORD);
    }
  };

  const handleOtpEnter = (e: any) => {
    const key = e.target.value;
    setOtp(key);
  };

  return (
    <div className='main-container'>
      <div className='signup-wrapper'>
        <div className='container-fluid'>
          <LeftPanel />
          {/* signup-left-item */}

          {/* signup-right-item */}
          <div className='signup-right-item cols'>
            <form
              className='signup-form from-flex code-send-wrapper'
              onSubmit={handleVerify}
            >
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
                    {userData?.email} -{' '}
                    <a href='/forgotpassword'>
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
                        maxLength={8}
                        placeholder='Enter Code'
                        style={{ width: '200px' }}
                        id='otp'
                        name='otp'
                        onChange={handleOtpEnter}
                      />
                    </div>
                    {isResend ? (
                      <div
                        className='resend-code active'
                        onClick={handleResend}
                      >
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
                      <button type='submit' className='btn primary-btn wid100'>
                        Verify
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
export default ForgotPasswordCode;
