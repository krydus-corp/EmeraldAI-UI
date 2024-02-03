import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DEL_ICON, DOT_ICON, EDIT_ICON, ERROR_ICON, TICK_ICON_BIG } from '../../../../constant/image';
import { NumberLimit } from '../../../../constant/number';
import { MODEL_STATUS } from '../../../../constant/static';
import { AppDispatch } from '../../../../store';
import { getStatusExport } from '../redux/export';
interface Props {
  isEditName: boolean;
  modelData: { name: string; id: string };
  setIsEditName: Function;
  deleteModel: Function;
  forUpdateModelData: Function;
  checkModelState: Function;
}
const ModelName = ({
  modelData,
  isEditName,
  setIsEditName,
  deleteModel,
  forUpdateModelData,
  checkModelState
}: Props) => {
  const [name, setName] = useState('');
  const { project, dataSet } = useSelector(
    (state: any) => state
  );
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    project?.id && dispatch(getStatusExport(project.id));
    if (modelData?.name) {
      setName(modelData?.name);
    }
  }, [modelData?.name]);

  return (
    <>
      <div className='section section-1'>
        <div className='name-section'>
          {isEditName && (
            <>
              <div>
                <input
                  maxLength={NumberLimit.TWINTY_FIVE}
                  value={name}
                  type='text'
                  className='form-control'
                  onChange={(evt) => {
                    setName(evt.target.value);
                  }}
                />
                {!name && (
                  <span className='error'>Please enter a model name</span>
                )}
              </div>
              <span
                className='name ui-cursor-pointer'
                onClick={() => {
                  if (name) {
                    forUpdateModelData(name);
                  }
                }}
              >
                Save Name
              </span>
            </>
          )}
          {!isEditName && <>
            <h3>
              {modelData?.name}
            </h3>
            {checkModelState(MODEL_STATUS.TRAINED) && (
              <div className="ui-train-compete">Training Completed
                <img className='time' src={TICK_ICON_BIG} alt='images' />
              </div>
            )}

            {checkModelState(MODEL_STATUS.ERR) && (
              <div className="ui-train-compete">Training Failed
                <img className='time' src={ERROR_ICON} alt='images' />
              </div>
            )}
          </>}
        </div>
        <div className='model-section'>
          <div className='round-dropdwon'>
            <Dropdown>
              <Dropdown.Toggle
                className='card-dropdown'
                variant='success'
                id='dropdown-basic'
              >
                <img src={DOT_ICON} alt='profile' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setIsEditName(true);
                  }}
                >
                  <img src={EDIT_ICON} alt='profile' /> Rename Model
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    deleteModel();
                  }}
                  disabled={checkModelState(MODEL_STATUS.TRAINING)}
                >
                  <img src={DEL_ICON} alt='profile' /> Delete Modal
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelName;
