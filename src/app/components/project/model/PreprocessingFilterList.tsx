import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { PLUS_CIRCLE_ICON } from '../../../../constant/image';
import { NumberLimit } from '../../../../constant/number';
import { PREPROCESSING_OPTION } from '../../../../constant/static';
import { displayNumberValue } from '../../../../utils/common';
interface Props {
    setOpenPreprocessiong: Function;
    removePreprocessing: Function;
    modelData: any;
    editPreprocessingFilter: Function; 
}
const PreprocessingFilterList = ({ setOpenPreprocessiong, modelData,
    removePreprocessing, editPreprocessingFilter }: Props) => {
    const [isUpdate, setUpdate] = useState(false);
    return <>
            <ListGroup>
                {modelData?.preprocessors?.percent_crop && (
                    <ListGroup.Item>
                        <div className='left-item'>
                            <h5>
                                Percent Crop <span> Width: {displayNumberValue(modelData?.preprocessors?.percent_crop?.width * NumberLimit.ONE_HUNDRED)}, 
                                            Height: {displayNumberValue(modelData?.preprocessors?.percent_crop?.height * NumberLimit.ONE_HUNDRED)}
                                </span>
                            </h5>{' '}
                            <button
                                type='button'
                                className='btn link-btn edit-btn'
                                onClick={() => {
                                    editPreprocessingFilter(PREPROCESSING_OPTION.static);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                        <div className='right-item' onClick={() => {
                            setUpdate(!isUpdate);
                            removePreprocessing(PREPROCESSING_OPTION.static);
                        }}>
                            <button className='btn btn-close'></button>
                        </div>
                    </ListGroup.Item>                    
                )}
                {modelData?.preprocessors?.resize && (
                    <ListGroup.Item>
                        <div className='left-item'>
                            <h5>
                                Resize - <span>
                                {modelData?.preprocessors?.resize?.mode} to&nbsp;
                        {modelData?.preprocessors?.resize?.size?.height}x{modelData?.preprocessors?.resize?.size?.width}
                                </span>
                            </h5>{' '}
                            <button
                                type='button'
                                className='btn link-btn edit-btn'
                                onClick={() => {
                                    editPreprocessingFilter(modelData?.preprocessors?.resize?.mode);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                        <div className='right-item' onClick={() => {
                            setUpdate(!isUpdate);
                            removePreprocessing(modelData?.preprocessors?.resize?.mode);
                        }}>
                            <button className='btn btn-close'></button>
                        </div>
                    </ListGroup.Item>                    
                )}
            <ListGroup.Item>
                <button
                className='btn link-btn preprocessing-btn'
                onClick={() => {setOpenPreprocessiong(true);}}
                >
                <img src={PLUS_CIRCLE_ICON} alt='plus icon' />
                Add Preprocessing Step
                </button>
            </ListGroup.Item>
            </ListGroup>
    </>;
};
export default PreprocessingFilterList;
