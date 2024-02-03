
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { NumberLimit } from '../../../constant/number';
import ChartDataView from '../project/ChartDataView';
interface Props {
  show: boolean;
  closeModal: Function;
  statsData: Object,
  isBarChart: boolean,
  setBarChart: Function
}

const ViewMoreChart = ({ show, closeModal, statsData, isBarChart,
  setBarChart }: Props) => {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setLoad(true);
      }, NumberLimit.ZERO);
    }
  }, [])

  const handleClose = () => {
    closeModal();
  };

  return (
    <>
      <Modal
        className='full-chart-modal'
        show={show}
        centered
        onHide={() => {
          handleClose();
        }}
        backdrop="static"
      >
        <div className='modal-head-section'>
          <div className='modal-head'>
            <h3 onClick={() => {
              handleClose();
            }}>
              <Button
                variant='secondary'
                className='btn-close'
              ></Button> <span>Back to Dataset</span>
            </h3>
          </div>
        </div>
        <Modal.Body>
          <div className='from-flex create-project-form'>
            <>
              {load ? <ChartDataView statsData={statsData} isModalPopup={true}
                isBarChart={isBarChart} setBarChart={setBarChart} /> :
                <div className='loader'>
                  <div className='loader-inner'></div>
                </div>}
            </>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewMoreChart;
