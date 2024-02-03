import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DELETE_ICON } from '../../../constant/image';
import ButtonComponent from '../common/ButtonComponent';

interface Props {
  show: string;
  closeModal: Function;
  deleteTag: Function;
}

const DeleteModal = ({ show, closeModal, deleteTag }: Props) => {
  const handleSubmit = async () => {
    deleteTag(show);
    closeModal();
  };
  return (
    <Modal
      dialogClassName='dialog-400'
      className='delete-project-modal'
      centered
      show={show ? true : false}
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
              <img src={DELETE_ICON} alt='delete' />
              <h3>Delete Class?</h3>
              <div className='sm-txt'>
                This class will be removed from this project and from
                <br />
                the images it was associated with
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <ButtonComponent
                  type="submit"
                  styling='btn red-btn'
                  action={() => { handleSubmit(); }}
                  name='Delete' />
                <ButtonComponent
                  type="button"
                  styling='btn primary-btn'
                  action={() => { closeModal(); }}
                  name='Cancel' />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
