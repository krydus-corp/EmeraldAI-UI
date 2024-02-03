import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { NumberLimit } from '../../../constant/number';
interface Props {
  show: boolean;
  closeModal: any;
  filter: string;
  submit: any;
  date: any;
}

const ProjectFilter = ({ show, closeModal, filter, submit, date }: Props) => {
  const [annotation, setAnnotation] = useState(filter);

  const [dateRange, setDateRange] = useState<any>(date);
  const [startDate, endDate] = dateRange;

  const handleClose = () => {
    closeModal();
  };

  const clear = () => {
    setAnnotation('');
    setDateRange([]);
  };
  const handleDateChangeRaw = (e:any) => {
    e.preventDefault();
}

  return (
    <Modal className='filter-modal modal-right' show>
      <div className='modal-head-section'>
        <div className='modal-head'>
          <h3>
            Filter{' '}
            <Button
              variant='secondary'
              className='btn-close'
              onClick={() => {
                handleClose();
              }}
            ></Button>
          </h3>
        </div>
      </div>
      <Modal.Body>
        <div className='from-flex'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='form-group calendar-icon'>
                <p className='label-txt'>Filter by dates</p>

                <ReactDatePicker
                  className='form-control'
                  placeholderText='Select Dates'
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update,e:any) => {
                    if(e?.target?.value === ''){
                      setDateRange([]);
                    }else{
                      setDateRange(update);
                    }                 
                  }}
                  maxDate={moment().toDate()}
                  isClearable={true}
                  onChangeRaw={(e)=>{handleDateChangeRaw(e)}}
                />
                {dateRange && dateRange.length > 0 && (
                  <span
                    className='close-icon'
                    onClick={() => {
                      setDateRange([]);
                    }}
                  ></span>
                )}
              </div>
            </div>

            <div className='col-md-12'>
              <div className='form-group project-type'>
                <p className='label-txt'>Filter by Project Type</p>
                <div className='checkbox-list'>
                  <ul className='list-group list-group-flush'>
                    <li
                      className='list-group-item'
                      onClick={() => setAnnotation('classification')}
                    >
                      <div className='checkbox-panel'>
                        <label>
                          <input
                            type='radio'
                            name='annotation_type'
                            value={'classification'}
                            checked={annotation === 'classification'}
                          />
                          <span className='radio'>Classification</span>
                        </label>
                      </div>
                    </li>
                    <li
                      className='list-group-item'
                      onClick={() => setAnnotation('bounding_box')}
                    >
                      <div className='checkbox-panel'>
                        <label>
                          <input
                            type='radio'
                            name='annotation_type'
                            value={'bounding_box'}
                            checked={annotation === 'bounding_box'}
                          />
                          <span className='radio'>
                            Object Detection (Bounding Box)
                          </span>
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='form-group'>
            <div className='button-panel'>
              <button
                type='button'
                disabled={annotation === '' && dateRange.length === NumberLimit.ZERO }
                className='btn link-btn green-btn'
                onClick={() => {
                  clear();
                }}
              >
                Clear
              </button>
              <button
                type='button'
                className='btn primary-btn'
                onClick={() => {
                  submit(annotation, dateRange);
                }}
                disabled={
                  (startDate && !endDate) || (!startDate && endDate)
                }
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectFilter;
