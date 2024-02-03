import { Button, Modal } from 'react-bootstrap';
import ButtonComponent from '../common/ButtonComponent';

interface Props {
  show: boolean;
  closeModal: Function;
  submit: Function;
}

const ConfirmParameterModal = ({ show, closeModal, submit }: Props) => {

  const submitFunc = async() => {
    await submit();
    closeModal();
  };

  return (
    <Modal
      dialogClassName='dialog-400'
      className='delete-project-modal'
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
              <div className='sm-txt'>
                Are you sure you want to save the changes?
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <ButtonComponent 
                  type='submit'
                  styling='btn secondary-btn'
                  action={() => {
                    closeModal()
                  }}
                  name='Cancel' />
                <ButtonComponent 
                  type='button'
                  styling='btn primary-btn'
                  action={() => {
                   submitFunc();
                  }}
                  name='Submit' />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmParameterModal;
