import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

interface Props {
  show: boolean;
  closeModal: any;
  data: any;
}

const ViewMoreUncertainTag = ({ show, closeModal, data }: Props) => {
  const { project } = useSelector(
    (state: any) => state
  );
  return (
    <Modal
      dialogClassName='dialog-400'
      className='common-modal all-tag-modal'
      show={show}
      onHide={() => {
        closeModal();
      }}
      centered
    >
      <div className='modal-head'>
        <h3>
          All Tags
          <Button
            variant='secondary'
            className='btn-close'
            onClick={() => {
              closeModal();
            }}
          ></Button>
        </h3>
      </div>
      <Modal.Body>
          <div className='tag-main'>
            <div className='tag-box'>
            {project.annotation_type === 'bounding_box' && (
              <>
                {data.map((item: any) => <span className="tag grey">{item.className} ({item.count}) - {item.confidence}%</span>)}
              </>
            )}
            {project.annotation_type !== 'bounding_box' && (
              <>
                {data.map((item: any) => <span className="tag grey">{item.className} - {item.confidence}%</span>)}
              </>
            )}

            </div>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewMoreUncertainTag;
