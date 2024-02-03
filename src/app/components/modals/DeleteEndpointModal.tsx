import { Button, Modal } from 'react-bootstrap';
import { DELETE_ICON } from '../../../constant/image';
import ButtonComponent from '../common/ButtonComponent';

interface Props {
  show: boolean;
  closeModal: Function;
  callBack: Function;
  headingText: string;
  bodyText: string;
}

const DeleteEndpoint = ({ show, closeModal, callBack, 
    headingText, bodyText }: Props) => {
  const handleSubmit = async () => {
    callBack(show);
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
              <h3>{headingText}</h3>
              <div className='sm-txt'>
                {bodyText}
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <ButtonComponent 
                  type='submit'
                  styling='btn red-btn'
                  action={() => {
                    handleSubmit();
                  }}
                  name='Delete' />
                <ButtonComponent 
                  type='button'
                  styling='btn primary-btn'
                  action={() => {
                    closeModal();
                  }}
                  name='Cancel' />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteEndpoint;
