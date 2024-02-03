import React from 'react';
import { Modal } from 'react-bootstrap';
import { ERROR_ICON } from '../../../constant/image';

interface Props {
  show: boolean;
  message: string;
  closeModal: any;
  header?:string
}

const UploadErrModal = ({ show, message, closeModal,header }: Props) => {
  return (
    <Modal
      dialogClassName='dialog-400 uploading-error-modal'
      className='common-modal'
      centered
      show={show}
    >
      <Modal.Body>
        <div className='from-flex'>
          <div className='row'>
            <div className='col-md-12'>
              <img src={ERROR_ICON} alt='error' />
              <h3>{header}</h3>
              <div className='sm-txt'>
                {/* Some files are in unsupported formats */}
                {message}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <button
                  type='button'
                  className='btn secondary-btn'
                  onClick={() => closeModal()}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadErrModal;
