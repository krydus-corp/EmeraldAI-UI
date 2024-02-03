import { Button, Modal } from 'react-bootstrap';
import { TAG_NOT_SUBMITTED } from '../../../constant/static';
import ButtonComponent from '../common/ButtonComponent';

interface Props {
  show: boolean;
  closeModal: Function;
  skipAnnotate: Function;
  submitAnnotate: Function;
}

const AnnotateImgConfirmModal = ({ show, closeModal, skipAnnotate, submitAnnotate }: Props) => {

  const skipFunc = async() => {
    await skipAnnotate();
    closeModal();
  };

  const submitFunc = async() => {
    await submitAnnotate();
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
              <h3>{TAG_NOT_SUBMITTED.header}</h3>
              <div className='sm-txt'>
                {TAG_NOT_SUBMITTED.content}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <ButtonComponent 
                  type='submit'
                  styling='btn secondary-btn'
                  action={() => {
                    skipFunc();
                  }}
                  name='Skip' />
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

export default AnnotateImgConfirmModal;
