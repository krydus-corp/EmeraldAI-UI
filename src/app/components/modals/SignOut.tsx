import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_ICON } from '../../../constant/image';
import { NumberLimit } from '../../../constant/number';
import { LOGIN } from '../../../utils/routeConstants';
import { signOut } from '../login/redux/login';
import { clearProject } from '../project/redux/project';
import { clearUpload } from '../project/redux/upload';

interface Props {
  show: boolean;
  closeModal: any;
}

const SignOut = ({ show, closeModal }: Props) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const logOut = async () => {
    await dispatch(clearProject());
    await dispatch(clearUpload());
    await closeModal();
    await dispatch(signOut());
  };

  return (
    <Modal
      dialogClassName='dialog-400'
      className='common-modal'
      show={show}
      onHide={() => {
        closeModal();
      }}
      centered
      backdrop="static"
    >
      <Button
        variant='secondary'
        className='btn-close'
        onClick={() => {
          closeModal();
        }}
      ></Button>
      <Modal.Body>
        <div className='from-flex'>
          <div className='row'>
            <div className='col-md-12'>
              <img src={LOGOUT_ICON} alt='delete' />
              <h3>Sign out</h3>
              <div className='sm-txt'>Are you sure you want to sign out?</div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <button
                  type='button'
                  className='btn secondary-btn'
                  onClick={() => {
                    closeModal();
                  }}
                >
                  No
                </button>
                <button
                  type='button'
                  className='btn primary-btn'
                  onClick={() => {
                    logOut();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SignOut;
