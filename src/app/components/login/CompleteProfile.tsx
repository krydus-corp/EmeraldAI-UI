import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store';
import { PROJECT_LIST } from '../../../utils/routeConstants';
import {
  fetchUpdateProfilePicRequest,
  fetchUpdateRequest,
  deleteProfileImage
} from './redux/updateProfile';
import { NumberLimit } from '../../../constant/number';
import { PROFILE_DEFAULT } from '../../../constant/image';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [isFocus, setIsFocus] = useState('');
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
  });

  const storageData: any = localStorage.getItem('User');
  const userProfileData = JSON.parse(storageData);
  const [profileImage, setProfileImage] = useState(userProfileData.profile_400 ? `data:image/png;base64,${userProfileData.profile_400}` :'');
  const [isError, setIsError] = useState<any>({});
  const verificationData = useSelector((state: any) => {
    return state.updateProfile;
  });
  const dispatch: AppDispatch = useDispatch();

  const handleNavigate = () => {
    navigate(PROJECT_LIST);
  };
  const handleChange = (e: any) => {
    const keyData = e.target.value;
    setProfileData({ ...profileData, [e.target.name]: keyData });
  }; 
  const handleupload = (e: any) => {
    const file = e.target.files[0];
    const image = URL.createObjectURL(file);
    dispatch(
      fetchUpdateProfilePicRequest({
        id: userProfileData && userProfileData.id,
        data: file,
      })
    );
    setProfileImage(image);
  };

  const handleBlur = () => {
    setIsFocus('');
  };

  const handleDeleteProfileImage=useCallback(()=>{
    dispatch(
      deleteProfileImage({
        id: userProfileData && userProfileData.id,
      })
    );  
      setProfileImage('');    
  },[])

  const validateProfileData = () => {
    const error: any = {};
    if (!profileData.firstname || profileData.firstname === '') {
      error.firstname = true;
    }
    if (!profileData.lastname || profileData.lastname === '') {
      error.lastname = true;
    }
    return error;
  };

  const handleContinue = () => {
    const validation = validateProfileData();
    setIsError(validation);
    const data: any = {
      first_name: profileData.firstname.trim(),
      last_name: profileData.lastname.trim(),
    };
    if (verificationData.email && verificationData.otp) {
      data.email = verificationData.email.trim();
      data.email_verification_code = verificationData.otp.trim();
    }
    if (profileData.firstname && profileData.lastname) {
      dispatch(
        fetchUpdateRequest({
          data,
          id: userProfileData && userProfileData.id,
          navigate,
        })
      );
    }
  };

  const handleclearImage = (event: any) => {
    const { target = {} } = event || {};
    target.value = '';
  };
  return (
    <div className='main-container'>
      <div className='profile-container'>
        <div className='big-head'>Complete your profile</div>
        <div className='inner-box'>
          <div className='profile-circle-box'>
            <img src={profileImage ? profileImage :
                       PROFILE_DEFAULT} alt='profile' />
            { profileImage && (
              <button
                type='button'
                className='btn trash-icon'
                onClick={() => {
                  handleDeleteProfileImage();
                }}
              ></button>
            )}
          </div>
          <input
            type='file'
            id='ProfileImg'
            style={{ display: 'none' }}
            accept='.jpg,.jpeg,.png,.tiff'
            onChange={(e) => {
              handleupload(e);
            }}
            onClick={(e) => {
              handleclearImage(e);
            }}
          />
          <label className='btn upload-btn' htmlFor='ProfileImg'>
            Click here to {profileImage === '' ? 'upload' : 'update'} image
          </label>
        </div>
        <div className='profile-form from-flex'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='form-group'>
                <div
                  className={`floating-input ${
                    (isFocus === 'firstname' || profileData.firstname) && 'move'
                  }`}
                >
                  <label>Your First Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='firstname'
                    onFocus={() => {
                      setIsFocus('firstname');
                    }}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={() => {
                      handleBlur();
                    }}
                    maxLength={NumberLimit.TWINTY_FIVE}
                  />
                </div>
                {isError.firstname && (
                  <span className='error'>Please enter first name</span>
                )}
              </div>
            </div>
            <div className='col-md-6'>
              <div className='form-group'>
                <div
                  className={`floating-input ${
                    (isFocus === 'lastname' || profileData.lastname) && 'move'
                  }`}
                >
                  <label>Your Last Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='lastname'
                    onFocus={() => {
                      setIsFocus('lastname');
                    }}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={() => {
                      handleBlur();
                    }}
                    maxLength={NumberLimit.TWINTY_FIVE}
                  />
                </div>
                {isError.lastname && (
                  <span className='error'>Please enter last name</span>
                )}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='form-group'>
                <button
                  type='button'
                  className='btn primary-btn wid100'
                  disabled={!profileData.firstname || !profileData.lastname}
                  onClick={() => {
                    handleContinue();
                  }}
                >
                  Continue
                </button>
                <button
                  type='button'
                  className='btn grey-link-btn'
                  onClick={() => {
                    handleNavigate();
                  }}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* profile-container */}
    </div>
  );
};

export default CompleteProfile;
