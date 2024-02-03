import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DELETE_ICON } from '../../../constant/image';
import { SELECT_MANUALLY, SELECT_RANDOMLY } from '../../../constant/static';

interface Props {
  show: boolean;
  closeModal: VoidFunction;
  addContent: VoidFunction;
  addManualContent: VoidFunction;
  images: any;
}

const AddRandomlyModal = ({ show, closeModal, addContent, addManualContent, images }: Props) => {

  const imageData = images.filter((ele: any) => ele.checked);

  const handleSubmit = async () => {
    {imageData.length > 0 ? addContent() : addManualContent();}
    closeModal();
  };
  
  return (
    <Modal
      dialogClassName='dialog-400'
      className='delete-project-modal'
      centered
      show={show}
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
              {/* <img src={DELETE_ICON} alt='delete' /> */}
              <h3>{imageData.length === 0 ? SELECT_MANUALLY.header : SELECT_RANDOMLY.header}</h3>
              <div className='sm-txt'>
                {imageData.length === 0 ? SELECT_MANUALLY.contentOne : SELECT_RANDOMLY.contentOne}
                <br />
                {imageData.length === 0 ? SELECT_MANUALLY.contentTwo : SELECT_RANDOMLY.contentTwo}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <button
                  type='submit'
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
                    handleSubmit();
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

export default AddRandomlyModal;
