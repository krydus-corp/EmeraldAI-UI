import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUpdateProfilePicRequest,
  fetchUpdateRequest,
  deleteProfileImage
} from '../login/redux/updateProfile';
import ChangeEmail from './ChangeEmail';
import {UPDATE_PROFILE,PROFILE_NOT_CHANGE} from '../../../constant/validations';

import { showToast } from '../common/redux/toast';
import { PROFILE_DEFAULT } from '../../../constant/image';
interface Props {
  show: boolean;
  closeModal: any;
}
const MyProfile = ({ show, closeModal }: Props) => {
  const {userDetails:userProfileData} = useSelector((state:any)=>state);  
  const [profileImage, setProfileImage] = useState('');
  const dispatch: any = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const verificationData = useSelector((state: any) => {
    return state.updateProfile;
  });
  const [profileData, setProfileData] = useState({
        firstname: userProfileData && userProfileData.first_name,
        lastname: userProfileData && userProfileData.last_name,
        email: userProfileData && userProfileData.email,
  });
  const [isMoved, setIsMoved] = useState('');
  const [emailChange, setEmailChange] = useState(false);

  const handleupload = (e: any) => {
    const file = e.target.files[0];
    const image = URL.createObjectURL(file);
    setProfileImage(image);
    dispatch(
      fetchUpdateProfilePicRequest({
        id: userProfileData && userProfileData.id,
        data: file,
      })
    );
  };
  const handleBlur = () => {
    setIsMoved('');
  };

  const handleChange = (e: any) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if(show ){
      setProfileData({
        firstname: userProfileData && userProfileData.first_name,
        lastname: userProfileData && userProfileData.last_name,
        email: userProfileData && userProfileData.email,
      });
    }
  },[show]);
  
  const handleUpdate =async () => {
    const flag =
      userProfileData &&
      userProfileData.first_name === profileData.firstname &&
      userProfileData &&
      userProfileData.last_name === profileData.lastname &&
      userProfileData &&
      userProfileData.email === profileData.email;
    if (flag) {
      dispatch(showToast({message: PROFILE_NOT_CHANGE, type: 'error'}));
    } else { 
         const data: any = {
        first_name: profileData.firstname.trim(),
        last_name: profileData.lastname.trim(),
      };
      if (verificationData.email && verificationData.otp) {
        data.email = verificationData.email.trim();
        data.email_verification_code = verificationData.otp.trim();
      }
    await  dispatch(
        fetchUpdateRequest({
          data,
          close: closeModal,
          id: userProfileData && userProfileData.id,
        })
      );
      setIsEdit(false)
    }
  };
  const handleClose = () => {
    setIsEdit(false);
    closeModal();
  };

  const handleclearImage = (event: any) => {
    const { target = {} } = event || {};
    target.value = '';
  };
  const handleChangeEmail = (key: any) => {
    setProfileData({
      ...profileData,
      email: key,
    });
  };

  const handleDeleteImage=async()=>{
  await dispatch(
      deleteProfileImage({
        id: userProfileData && userProfileData.id,
      })
    );
    setProfileImage('');   
  }

 
  return (
    <>
      <ChangeEmail
        show={emailChange}
        closeModal={() => {
          setEmailChange(false);
        }}
        closeMyProfile={closeModal}
        changeEmail={handleChangeEmail}
      />
      <Modal show={show} className='profile-modal modal-right'>
        <div className='modal-head-section'>
          <div className='modal-head'>
            <h3>
              My Profile{' '}
              <Button
                variant='secondary'
                className='btn-close'
                onClick={() => {
                  handleClose();
                }}
              ></Button>
            </h3>
          </div>
        </div>
        <Modal.Body>
          {isEdit ? (
            <>
              <div className='profile-banner'>
                <div className='profile-circle'>
                  <img
                    src={profileImage ? profileImage : userProfileData.profile_400
                      ? `data:image/png;base64,${userProfileData.profile_400}`
                      : PROFILE_DEFAULT}
                    alt='profile pic'
                  />
                  {(profileImage || userProfileData.profile_400) && (
                    <button
                      type='button'
                      className='btn trash-icon'
                      onClick={() => {
                        handleDeleteImage();
                      }}
                    ></button>
                  )}
                </div>
              </div>
              <div className='from-flex step-2'>
                <div className='row'>
                  <div className='col-md-12'>
                    <input
                      type='file'
                      id='profileImg'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        handleupload(e);
                      }}
                      onClick={(e) => {
                        handleclearImage(e);
                      }}
                    />
                    <div className='upload-wrapper'>
                      <label htmlFor='profileImg' className='btn upload-btn'>
                        Click here to {(profileImage ||  userProfileData.profile_400 ) ? 'update' : 'upload'} image
                      </label>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <div
                        className={`floating-input ${
                          (profileData.firstname || isMoved === 'firstname') &&
                          'move'
                        } `}
                        onFocus={() => {
                          setIsMoved('firstname');
                        }}
                        onBlur={() => {
                          handleBlur();
                        }}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <label>First Name</label>
                        <input
                          type='text'
                          className='form-control'
                          name='firstname'
                          maxLength={50}
                          value={profileData.firstname}
                        />
                      </div>
                      {!profileData.firstname && (
                        <span className='error'>Enter Your First Name</span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <div
                        className={`floating-input ${
                          (profileData.lastname || isMoved === 'lastname') &&
                          'move'
                        } `}
                        onFocus={() => {
                          setIsMoved('lastname');
                        }}
                        onBlur={() => {
                          handleBlur();
                        }}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <label>Last Name</label>
                        <input
                          type='text'
                          className='form-control'
                          name='lastname'
                          maxLength={50}
                          value={profileData.lastname}
                        />
                      </div>
                      {!profileData.lastname && (
                        <span className='error'>Enter Your Last Name</span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <div
                        className={`floating-input ${
                          (profileData.email || isMoved === 'email') && 'move'
                        } `}
                        onFocus={() => {
                          setIsMoved('email');
                        }}
                        onBlur={() => {
                          handleBlur();
                        }}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <label>Email</label>
                        <input
                          type='text'
                          className='form-control'
                          name='email'
                          value={profileData.email}
                          disabled
                        />
                        <button
                          type='button'
                          className='btn link-btn change-btn'
                          onClick={() => {
                            setEmailChange(true);
                          }}
                        >
                          Change
                        </button>
                      </div>
                      {!profileData.email && (
                        <span className='error'>User name doesn't exist</span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='center-btn'>
                      <button
                        type='button'
                        disabled={ !profileData.firstname || !profileData.lastname || userProfileData &&
                          userProfileData.first_name === profileData.firstname &&
                          userProfileData &&
                          userProfileData.last_name === profileData.lastname &&
                          userProfileData &&
                          userProfileData.email === profileData.email}
                        className='btn primary-btn wid100'
                        onClick={() => {
                          handleUpdate();
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='profile-banner'>
                <div className='profile-circle'>
                  <img
                    src={
                      userProfileData && userProfileData.profile_400
                        ? `data:image/png;base64,${userProfileData.profile_400}`
                        : PROFILE_DEFAULT
                    }
                    alt='profile pic'
                  />
                </div>
              </div>
              <div className='from-flex step-1'>
                <div className='row'>
                  <div className='col-md-12'>
                    <h3>
                      {`${userProfileData &&userProfileData.first_name&& userProfileData.first_name}  ${
                        userProfileData && userProfileData.last_name && userProfileData.last_name
                      } `}{' '}
                      <span className='sm-txt'>
                        {userProfileData && userProfileData.email && userProfileData.email}
                      </span>
                    </h3>
                  </div>
                  <div className='col-md-12'>
                    <div className='center-btn'>
                      <button
                        type='button'
                        className='btn secondary-btn'
                        onClick={() => {
                          setIsEdit(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* step 1 */}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyProfile;
