import React, { useState } from 'react';
import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LEFT_ARROW_ICON,
  LOGO_ICON,
  PASSWORD_ICON,
  PROFILE_DEFAULT,
  PROFILE_ICON,
  SIGNOUT_ICON,
} from '../../../constant/image';
import { NumberLimit } from '../../../constant/number';
import { AppDispatch } from '../../../store';
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP2,
  CREATE_PROJECT_STEP4,
  PROJECT_LIST,
  PROJECT_OVERVIEW,
  PROJECT_OVERVIEW_STEP2,
  PROJECT_OVERVIEW_STEP4,
} from '../../../utils/routeConstants';
import ChangePassword from '../modals/ChangePassword';
import MyProfile from '../modals/MyProfile';
import SignOut from '../modals/SignOut';
import { clearProject } from '../project/redux/project';
import { clearUpload } from '../project/redux/upload';
import { createBrowserHistory } from 'history';
import { clearProjectList, projectListLoading } from '../project/redux/projectList';
import { PROJECT_TYPE } from '../../../constant/static';

const NavBar = ({ children, project }: any) => {
  const storageData: any = localStorage.getItem('User');

  const history = createBrowserHistory();
  const location = history.location.pathname;

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const prevLocation: any = useLocation();

  const userProfileData = JSON.parse(storageData);
  const [myProfileModelShow, setMyProfileModelShow] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const handleMyProfile = () => {
    setMyProfileModelShow(true);
  };
  const handleMyProfileModelClose = () => {
    setMyProfileModelShow(false);
  };

  const handleChangePasswordModelClose = () => {
    setIsChangePassword(false);
  };

  const handleChangePassword = () => {
    setIsChangePassword(true);
  };

  const [signOutShow, setSignOutShow] = useState(false);

  const closeSignOutShow = () => setSignOutShow(false);
  const handleNavigate = async () => {
    dispatch(clearProject());
    dispatch(clearUpload());
    dispatch(clearProjectList())
    if (location === PROJECT_LIST) {
      navigate('/');
      dispatch(projectListLoading());
    } else {
      navigate(PROJECT_LIST);
    }
  };
  const onSetProjectStep = () => {
    const location = prevLocation.state.pathname;
    if (location.includes(CREATE_PROJECT_STEP4)) {
      navigate(`${CREATE_PROJECT_STEP4}/${project.id}`)
    } else if (location.includes(PROJECT_OVERVIEW_STEP4)) {
      navigate(`${PROJECT_OVERVIEW_STEP4}/${project.id}`)
    } else if (location.includes(PROJECT_OVERVIEW_STEP2)) {
      navigate(`${PROJECT_OVERVIEW_STEP2}/${project.id}`)
    } else if (location.includes(CREATE_PROJECT_STEP2)) {
      navigate(`${CREATE_PROJECT_STEP2}/${project.id}`)
    } else if (location.includes(PROJECT_OVERVIEW)) {
      navigate(`${PROJECT_OVERVIEW}/${project.id}`)
    } else if (location.includes(CREATE_PROJECT)) {
      navigate(`${CREATE_PROJECT}/${project.id}`)
    }
  };

  const getType = (obj:any,key:string)=> obj[key];

  return (
    <>
      <div className='main-container'>
        <div className='dashboard-wrapper'>
          <Navbar fixed='top' bg='dark'>
            <Container>
              <Navbar.Brand
                onClick={() => {
                  handleNavigate();
                }}
              >
                <img
                  src={LOGO_ICON}
                  className='header-logo'
                  alt='React Bootstrap logo'
                />
              </Navbar.Brand>
              {project?.name && (
                <div className='page-back'>
                  <img
                    onClick={() => onSetProjectStep()}
                    src={LEFT_ARROW_ICON}
                    alt='back arrow'
                  />{' '}
                  <span>{project?.name}</span>
                  <div className='project-type'>Project Type :{' '}{ project?.annotation_type && getType(PROJECT_TYPE,project?.annotation_type)}</div>
                </div>
              )}
              <div className='header-right-item'>
                <h3
                  className='active'
                  onClick={() => {
                    handleNavigate();
                  }}
                >
                  Projects
                </h3>
                <Dropdown>
                  <div className='user-profile'>
                    <img
                      src={
                        userProfileData && userProfileData.profile_400
                          ? `data:image/png;base64,${userProfileData.profile_400}`
                          : PROFILE_DEFAULT
                      }
                      alt='profile'
                    />
                  </div>
                  <Dropdown.Toggle variant='success' id='dropdown-basic'>
                    My Profile
                  </Dropdown.Toggle>
                  <Dropdown.Menu align='end'>
                    <Dropdown.Item
                      onClick={() => {
                        handleMyProfile();
                      }}
                    >
                      <img src={PROFILE_ICON} alt='profile' /> My Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        handleChangePassword();
                      }}
                    >
                      <img src={PASSWORD_ICON} alt='password' /> Change Password
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSignOutShow(true)}>
                      <img src={SIGNOUT_ICON} alt='sign-out' /> Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Container>
          </Navbar>
          <>{children}</>

          {/* change password modal*/}
          {isChangePassword && <ChangePassword
            show={isChangePassword}
            closeModal={handleChangePasswordModelClose}
          />}

          {/* signout-modal */}
          {/* <SignOut /> */}

          {/* my profile */}
          <MyProfile
            show={myProfileModelShow}
            closeModal={handleMyProfileModelClose}
          />

          {/* change email modal */}
          {/* <ChangeEmail /> */}
        </div>
        {signOutShow && (
          <SignOut closeModal={closeSignOutShow} show={signOutShow} />
        )}
      </div>
    </>
  );
};

export default NavBar;
