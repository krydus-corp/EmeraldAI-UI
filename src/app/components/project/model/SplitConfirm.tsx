import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP4,
  PROJECT_OVERVIEW_STEP4,
} from '../../../../utils/routeConstants';
import { createBrowserHistory } from 'history';
import { NumberLimit } from '../../../../constant/number';
import { useSelector } from 'react-redux';

interface Props {
  show: boolean;
  closeModal: any;
  openRebalance:any
}

const SplitConfirm = ({ show, closeModal, openRebalance }: Props) => {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { statistics } = useSelector((state: any) => state);

  const history = createBrowserHistory();
  const location = history.location.pathname;

  const handleNavigate = () => {
    location.includes(CREATE_PROJECT)
      ? navigate(`${CREATE_PROJECT_STEP4}/${project_id}`)
      : navigate(`${PROJECT_OVERVIEW_STEP4}/${project_id}`);
  };

  return (
    <Modal
      dialogClassName='dialog-400'
      className='common-modal no-head'
      show={show}
      // onHide={() => {
      //   closeModal();
      // }}
      centered
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
              <h3>Rebalance split images?</h3>
              <div className='sm-txt'>
                Do you want to rebalance the split before proceeding further?
              </div>
            </div>
            <div className='col-md-12'>
              <div className='center-btn'>
                <button
                  type='button'
                  className='btn secondary-btn'
                  onClick={() => {
                    handleNavigate();
                  }}
                >
                  No
                </button>
                <button
                  disabled={
                    statistics?.total_annotated_images < NumberLimit.TEN
                  }
                  type='button'
                  className='btn primary-btn'
                  onClick={() => {
                    openRebalance();
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

export default SplitConfirm;
