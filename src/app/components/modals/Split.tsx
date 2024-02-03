import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NumberLimit } from '../../../constant/number';
import { AppDispatch } from '../../../store';
import MultiRange from '../../../utils/MultiRange';
import { updateDataSet } from '../project/redux/dataset';

interface Props {
  show: boolean;
  closeModal: Function;
}

const Split = ({ show, closeModal }: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const { dataSet, statistics } = useSelector((state: any) => state);

  const [range, setRange] = useState([0]);

  useEffect(() => {
    const train = Math.round(dataSet.split.train * NumberLimit.ONE_HUNDRED);
    // const validation = Math.round(
    //   (dataSet.split.train + dataSet.split.validation) * NumberLimit.ONE_HUNDRED
    // );

    setRange([train]);
  }, [dataSet]);

  const [dataSetCount, setDataSetCount] = useState({
    train: NumberLimit.ZERO,
    validation: NumberLimit.ZERO,
    // test: NumberLimit.ZERO, hiding test value in pie chart as per discussion on 18/01/2023
  });

  const handleChange = () => {
    if (statistics?.total_annotated_images >= NumberLimit.TEN) {
      const train = Math.round(
        (statistics.total_annotated_images / NumberLimit.ONE_HUNDRED) * range[0]
      );
      const validation = statistics.total_annotated_images - train
      // const validation = Math.round(
      //   (statistics.total_annotated_images / NumberLimit.ONE_HUNDRED) *
      //     (NumberLimit.ONE_HUNDRED - range[0])
      // );

      setDataSetCount({
        train,
        validation,
        // test: range[NumberLimit.TWO] === NumberLimit.ZERO ? NumberLimit.ZERO : statistics.total_annotated_images - (train + validation),
      });
    } else {
      setDataSetCount({
        train: statistics.total_annotated_images,
        validation: NumberLimit.ZERO,
        // test: NumberLimit.ZERO,
      });
    }
  };

  useEffect(() => {
    handleChange();
  }, [range]);

  const handleSubmit = () => {
    dispatch(
      updateDataSet({
        id: dataSet.id,
        data: {
          train: range[0],
          validation:NumberLimit.ONE_HUNDRED - range[0],
          test:0
          //test: NumberLimit.ONE_HUNDRED - range[1],
        },
      })
    );
    closeModal();
  };

  return (
    <Modal className='filter-modal modal-right add-dataset' show={show}>
      <div className='modal-head-section'>
        <div className='modal-head'>
          <h3>
            Rebalance Dataset{' '}
            <Button
              variant='secondary'
              className='btn-close'
              onClick={() => {
                closeModal();
              }}
            ></Button>
          </h3>
        </div>
      </div>
      <Modal.Body>
        <div className='from-flex'>
          <div className='row'>
            <div className='col-md-12'>
              <h4>Add {statistics.total_annotated_images} Images to dataset</h4>
            </div>
            <div className='col-md-12'>
              <div className='data-set-box'>
                <div
                  className='data-rang-value'
                  style={{ marginBottom: '10px' }}
                >
                  <span>Train {range[0]}%</span>
                  <span>Valid {NumberLimit.ONE_HUNDRED - range[0]}%</span>
                  {/* <span>Test {NumberLimit.ONE_HUNDRED - range[1]}%</span> */}
                </div>
                {dataSet && dataSet.split && (
                  <MultiRange range={range} setRange={setRange} />
                )}
              </div>
            </div>
            <div className='col-md-12'>
              <p>Image Distribution</p>
              <div className='data-set-value' style={{justifyContent:"space-between"}}>
                <span>Train: {dataSetCount.train} Images </span>
                <span>Valid: {dataSetCount.validation} Images </span>
                {/* <span>Test: {dataSetCount.test} Images</span> */}
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='form-group'>
            <div className='button-panel'>
              <button
                type='button'
                className='btn primary-btn'
                onClick={() => {
                  handleSubmit();
                }}
                disabled={range[0]===0 || range[0]===100}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Split;
