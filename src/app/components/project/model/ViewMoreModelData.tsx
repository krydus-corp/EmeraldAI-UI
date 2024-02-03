
import { useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Row } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { FILTER_ICON } from '../../../../constant/image';
import { NumberLimit } from '../../../../constant/number';
import MultiRange from '../../../../utils/MultiRange';
import PredictionsChart from '../../charts/PredictionsChart';
interface Props {
  show: boolean;
  closeModal: Function;
  predictionsData: any,
  isBarChart: boolean,
  setBarChart: Function,
  getImagesData: any,
  setFilterModal: any,
  range: Array<number>,
  setRange: any,
  fetchDeployInfo: Function,
  fetchImgData: any,
  selectedTagData: any,
  selectAll: Function,
  modelData: any,
  content: any,
  applyLoader: boolean,
  filterTagId: any,
  colorIndex?:any
}

const ViewMoreModelChart = ({ show, closeModal, predictionsData,colorIndex, isBarChart, setBarChart, getImagesData, filterTagId,
  setFilterModal, range, setRange, fetchDeployInfo, fetchImgData, selectedTagData, selectAll, modelData, content, applyLoader }: Props) => {
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

  const getData = () => {
    setLoad(false);
    fetchImgData();
  };

  const applyThreshold = () => {
    setLoad(false);
    fetchDeployInfo();
  }

  return (
    <>
      <Modal
        className='full-chart-modal deployment-full-view'
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
              ></Button> <span>Back to Model</span>
            </h3>
          </div>
        </div>
        <Modal.Body>
          <div className='from-flex create-project-form'>
            <>
              <div className={`section deploy-info-section`}>
                <div className='page-header'>
                  <div className='left-item'>
                    <h3>Deployment Info</h3>
                  </div>
                  <div className='right-item'>
                    <div className='filter-section-right'>
                      <button type='button' className='btn link-btn filter-btn' style={{ position: 'relative' }} onClick={setFilterModal}>
                        {filterTagId.length > NumberLimit.ZERO && <span className='filter-dot-modal'></span>}
                        <img src={FILTER_ICON} alt='sort icon' /> Filter</button>
                    </div>
                  </div>
                </div>
                {/* page-header */}
                <Row className='info-inner-wrapper'>
                  <div className='page-header'>
                    <div className='left-item'>
                      <h3>Class Distribution (Count per class)</h3>
                    </div>
                    <div className='right-item'>
                      <h3>Confidence Threshold</h3>
                      <div className='bar'>
                        <MultiRange range={range} setRange={setRange} />
                        <span className='percentage'>{range}%</span>
                      </div>
                      <button type="button" disabled={range[0]===0} className='btn link-btn' onClick={() => fetchDeployInfo()}>Apply</button>
                    </div>
                  </div>

                  <div className='chart-content'>
                    {(!load || applyLoader) &&
                      <div className='loader'>
                        <div className='loader-inner'></div>
                      </div>}
                    {load && !applyLoader && predictionsData?.predictions_per_class === null && <p>No data available. Please try to change threshold value.</p>}
                    {load && !applyLoader && <PredictionsChart colorIndex={colorIndex} isModalPopup={show} predictionsData={predictionsData} getImageData={getImagesData} selectAll={selectAll} selectedData={selectedTagData} />}
                  </div>

                  <div className='info-footer'>
                    <button type="button" className='btn secondary-btn' disabled={selectedTagData.length === 0} onClick={getData}>Inspect Selected</button>
                    <div className='count'>Processed: {modelData?.batch?.total_content} / {content?.unAnnotateCount || NumberLimit.ZERO}</div>
                  </div>

                </Row>
              </div>
            </>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewMoreModelChart;
