import { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'react-image-crop/dist/ReactCrop.css';
import { useDispatch } from 'react-redux';
import { FULL_IMG } from '../../../../constant/image';
import { NumberLimit } from '../../../../constant/number';
import { HORIZONTAL, PREPROCESSING_OPTION, VERTICAL } from '../../../../constant/static';
import { ERROR_MESSAGE } from '../../../../constant/validations';
import { showToast } from '../../common/redux/toast';
import SliderBox from './SliderBox';

 /**
  * for get image real height & width
  */
  const getRenderedSize = (objRef: any) => {
    const oRatio = objRef.width / objRef.height, cRatio = objRef.cWidth / objRef.cHeight;
    const dataObj = {width: NumberLimit.ZERO, height: NumberLimit.ZERO};
    return function() {
      if (objRef.contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
        dataObj.width = objRef.cWidth;
        dataObj.height = objRef.cWidth / oRatio;
      } else {
        dataObj.width = objRef.cHeight * oRatio;
        dataObj.height = objRef.cHeight;
      }
      return dataObj;
    }.call({});
  };
  
  const getImgSizeInfo = (img: any) => {
    const pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
    return getRenderedSize({contains: true, cWidth: img.width,
        cHeight: img.height,
        width: img.naturalWidth,
        height: img.naturalHeight,
        pos: parseInt(pos[NumberLimit.ZERO])});
  };

interface Props {
    filterType: string;
    show: boolean;
    closeModal: Function;
    closeModalParent: Function;
    applyPreprocessigFilter: Function;
    streachRange: Array<number>;
    setStreachRange: Function;
    staticCropRange: any;
    setStaticCropRange: Function;
    staticCropVerRange: any;
    setStaticCropVerRange: Function;    
    setFilterType: Function;
    defaulData: any;
}

const PreprocessingFilter = ({ show, closeModal, applyPreprocessigFilter,
    filterType, closeModalParent, setStreachRange, 
    staticCropRange, setStaticCropRange, staticCropVerRange, setStaticCropVerRange,
    setFilterType, defaulData }: Props) => {    
    const dispatch = useDispatch();
    const [completedCrop, setCompletedCrop] = useState(Object);
    const [appliedRangeVer, setAppliedRangeVer] = useState<Array<number>>(staticCropVerRange);
    const [appliedRangeHor, setAppliedRangeHor] = useState<Array<number>>(staticCropRange);
    const [height, setHeight] = useState<number>(defaulData?.preprocessors?.resize?.size?.height || NumberLimit.THREE_HUNDRED);
    const [width, setWidth] = useState<number>(defaulData?.preprocessors?.resize?.size?.width || NumberLimit.THREE_HUNDRED);
    const streachImgRef = useRef<HTMLImageElement>(null);
    const [resizeWidth, setResizeWidth] = useState<number>(NumberLimit.THREE_HUNDRED);
    const [resizeHeight, setResizeHeight] = useState<number>(NumberLimit.THREE_HUNDRED);
    const maxWidth = 2048;
    const maxHeght = 2048;

    const setStaticCropData = () => {
        if (completedCrop?.width && completedCrop?.height) {
            const percentCrop = {
                height: Math.round(completedCrop?.height) / NumberLimit.THREE_HUNDRED,
                width: Math.round(completedCrop?.width) / NumberLimit.THREE_HUNDRED
            };
            setAppliedRangeVer(staticCropVerRange);
            setAppliedRangeHor(staticCropRange);


            applyPreprocessigFilter({
                percent_crop: percentCrop
            });
        }
    };

    const setFillAndFitData = () => {
        const filType = (filterType === PREPROCESSING_OPTION.resize) ? PREPROCESSING_OPTION.fit : filterType;
        const applyFillAndFit = () => {
            const filterData = {
                mode: filType,
                size: {
                    width,
                    height
                }
            };
            applyPreprocessigFilter({
                resize: filterData,
            });
        };
        applyFillAndFit();       
    };

    const setStrachData = () => {
        let imgWidth = NumberLimit.THREE_HUNDRED;
        let imgHeight = NumberLimit.THREE_HUNDRED;
        if (width && height) {
            imgHeight = height;
            imgWidth = width;
        }
        const filterData = {
            mode: filterType,
            size: {
                width: imgWidth,
                height: imgHeight
            }
        };
        applyPreprocessigFilter({
            resize: filterData,
        });
    };
    
    const checkFilterType = (filterValue: string) => {
        return filterType === filterValue;
    };

    const forApplyFilter = () => {
        if (filterType === PREPROCESSING_OPTION.static) {
            if (!completedCrop?.width || !completedCrop?.height) {
                dispatch(showToast({ message: ERROR_MESSAGE.STATIC_CROP, type: 'error' }));
                return;
            }
            setStaticCropData();
        } else {
            setFillAndFitData();
        }
        closeModal();
        closeModalParent();
    };

    const cropImgData = (obj = {
        sx: NumberLimit.ZERO, sy: NumberLimit.ZERO, 
        sWidth: NumberLimit.THREE_HUNDRED, sHeight: NumberLimit.THREE_HUNDRED
    }) => {
        const canvas: any = document.getElementById('cropedArea');
        if (canvas) {           
            const ctx = canvas.getContext('2d'); 
            ctx.clearRect(NumberLimit.ZERO, NumberLimit.ZERO, canvas.width, canvas.height);     
            const image = new Image();
            image.src = FULL_IMG;            
            image.onload = () => {
                ctx.drawImage(image, obj.sx, obj.sy, obj.sWidth, 
                    obj.sHeight, NumberLimit.ZERO, NumberLimit.ZERO, 
                    obj.sWidth, obj.sHeight);
            };
        }
    };

    const changeCropRatio = (val: any, orientation = '') => {
        if (orientation === VERTICAL) {
            setStaticCropVerRange(val);
        } else {
            setStaticCropRange(val);
        }        
    };

    const forApplyStaticCrop = () => {
        const orignalWidth = NumberLimit.THREE_HUNDRED;
        const sx = orignalWidth / NumberLimit.ONE_HUNDRED * staticCropRange[NumberLimit.ZERO];
        const sy = orignalWidth / NumberLimit.ONE_HUNDRED * staticCropVerRange[NumberLimit.ZERO];
        const sWidthPer = staticCropRange[NumberLimit.ONE] - staticCropRange[NumberLimit.ZERO];
        const sWidth = orignalWidth / NumberLimit.ONE_HUNDRED * sWidthPer;
        const sHeightPer = staticCropVerRange[NumberLimit.ONE] - staticCropVerRange[NumberLimit.ZERO];
        const sHeight = orignalWidth / NumberLimit.ONE_HUNDRED * sHeightPer;
        setCompletedCrop({
            width: sWidth,
            height: sHeight
        });
        cropImgData({ sx, sy, sWidth, sHeight });
    };

    useEffect(() => {
        forApplyStaticCrop();
    }, [staticCropRange, staticCropVerRange]);

    const isStreachFit = () => {
        return filterType === PREPROCESSING_OPTION.fit || filterType === PREPROCESSING_OPTION.resize;
    };

    const isDisableApply = () => {
        return (filterType !== PREPROCESSING_OPTION.static) && (!width || !height ||
             (width > maxWidth) || (height > maxHeght));
    };

    const resizeWidthError = () => {
        let errMsg = '';
        if (!width) {
            errMsg = 'Width is required.';
        } else if (width > maxWidth) {
            errMsg = `Width cannot be greater than ${maxWidth}.`;
        }
        return errMsg;
    };

    const resizeHeightError = () => {
        let errMsg = '';
        if (!height) {
            errMsg = 'Height is required.';
        } else if (height > maxHeght) {
            errMsg = `Height cannot be greater than ${maxHeght}.`;
        }
        return errMsg;
    };

    const resetFilter = () => {
        if (filterType === PREPROCESSING_OPTION.static) {
            setStaticCropVerRange(appliedRangeVer);
            setStaticCropRange(appliedRangeHor);
        }
    };

    const updateResizeHeightWidth = () => {
        let defHeight = height < NumberLimit.THREE_HUNDRED ? height : NumberLimit.THREE_HUNDRED;
        let defWidth = width < NumberLimit.THREE_HUNDRED ? width : NumberLimit.THREE_HUNDRED;
        if (height === width && height >= NumberLimit.THREE_HUNDRED) {
            setResizeHeight(NumberLimit.THREE_HUNDRED);
            setResizeWidth(NumberLimit.THREE_HUNDRED);
        } else if (height >= width) {
            const decreaseValue = height - width;
            const perInc = decreaseValue / height * NumberLimit.ONE_HUNDRED;
            defWidth = Math.round(defHeight - defHeight/NumberLimit.ONE_HUNDRED * perInc);
            setResizeHeight(defHeight);
            setResizeWidth(defWidth);
        } else if(width > height) {
            const decreaseValue = width - height;
            const perInc = decreaseValue / width * NumberLimit.ONE_HUNDRED;
            defHeight = Math.round(defWidth - defWidth/NumberLimit.ONE_HUNDRED * perInc);
            setResizeHeight(defHeight);
            setResizeWidth(defWidth);
        }
    };

    useEffect(() => {
        updateResizeHeightWidth();
    }, [width, height]);

    const isStreachImg = () => {
        return filterType === PREPROCESSING_OPTION.stretch;
    };

    const isFillImg = () => {
        return filterType === PREPROCESSING_OPTION.fill;
    };

    useEffect(() => {
        if (filterType === PREPROCESSING_OPTION.stretch) {
            applyResize();
        }
    }, [resizeWidth, resizeHeight]);

    const applyResize = () => {
        const canvas: any = document.getElementById('resizeImage'),
        ctx = canvas.getContext('2d'),
        img = new Image();
        img.onload = () => {
            ctx.drawImage(img, NumberLimit.ZERO, NumberLimit.ZERO, resizeWidth, resizeHeight);                 
        };                                      
        img.src = FULL_IMG;
    };
    
    return <>
        {/* Static Crop modal*/}
        <Modal
            dialogClassName='dialog-544'
            className='preprocessing-modal pre-filter-modal'
            centered
            show={show ? true : false}
        >
            <div className='modal-header-section'>
            <div className='modal-head'>
                <h3>
                {checkFilterType(PREPROCESSING_OPTION.static) && 'Static Crop'}
                {!checkFilterType(PREPROCESSING_OPTION.static) && 'Resize'}
                <Button variant='secondary' className='btn-close' onClick={() => {
                    closeModal();
                    resetFilter();
                }}></Button>
                </h3>
            </div>
            </div>
            <Modal.Body>            
            <div className={`step-1 stretch-img-section ${checkFilterType(PREPROCESSING_OPTION.static) && 'd-none'}`} >
                <p className="txt">You can apply only one at a time</p>
                <div className="inner-box">
                    <div className="item-left">
                        <div className="img-trim-boxs ui-streach-images">
                            <div className={`img-inner ui-img-center ${isStreachImg() && 'd-none'}`}>
                                {isStreachImg() && (
                                    <img
                                        src={FULL_IMG} 
                                        alt="images" 
                                        id="streachImgFilter" 
                                        ref={streachImgRef}
                                        width={NumberLimit.THREE_HUNDRED}
                                        height={NumberLimit.THREE_HUNDRED}  
                                        onLoad={() => {
                                            applyResize();                           
                                        }}              
                                    />
                                )}   
                                {isStreachFit() && (
                                    <img
                                        src={FULL_IMG} 
                                        alt="images" 
                                        id="streachImgFilter" 
                                        className={'fit-with-in'}
                                        ref={streachImgRef}                                            
                                        width={NumberLimit.THREE_HUNDRED}
                                        height={NumberLimit.THREE_HUNDRED}          
                                    />
                                )}          
                                 {isFillImg() && (
                                    <img
                                        src={FULL_IMG} 
                                        alt="images" 
                                        id="streachImgFilter" 
                                        className={'fill-with-center-crop'}
                                        ref={streachImgRef}
                                        width={resizeWidth}
                                        height={resizeHeight}                    
                                    />
                                )}                   
                            </div>
                            <div className={`img-trim-box ui-img-center ${!isStreachImg() && 'd-none'}`}>
                                <canvas id="resizeImage" width={resizeWidth} height={resizeHeight}></canvas>
                            </div>                    
                        </div>
                    </div>
                    <div className="item-right resize-for">
                        <div className="form-group">
                            <div className="floating-input move">
                                <label>Height</label>
                                <input value={height} placeholder='Height' className="form-control"
                                name='height' 
                                onChange={(evt) => {
                                    setHeight(Number(evt?.target?.value));
                                }}/>                                
                            </div>
                            {resizeHeightError() && <span className="error">{resizeHeightError()}</span>}
                        </div>
                        <div className="form-group">
                            <div className="floating-input move">
                                <label>Width</label>
                                <input value={width} placeholder='Width' className="form-control"
                                name='width'
                                onChange={(evt) => {
                                    setWidth(Number(evt?.target?.value));
                                }} />                                
                            </div>
                            {resizeWidthError() && <span className="error">{resizeWidthError()}</span>}                            
                        </div>
                        <div className="radio-box">
                            <div className='checkbox-panel'>
                                <label>
                                    <input checked={isStreachFit()} name="filterOption" 
                                    type='radio' value={PREPROCESSING_OPTION.fit} onChange={(evt) => {
                                        if (evt.target.checked) {
                                            setFilterType(evt.target.value);
                                        }
                                    }} />
                                    <span className='radio'>Fit Within</span>
                                </label>
                            </div>
                            <div className='checkbox-panel'>
                                <label>
                                    <input checked={filterType === PREPROCESSING_OPTION.stretch} name="filterOption" 
                                    type='radio' value={PREPROCESSING_OPTION.stretch} onChange={(evt) => {
                                        if (evt.target.checked) {
                                            setFilterType(evt.target.value);
                                        }
                                    }} />
                                    <span className='radio'>Streach To</span>
                                </label>
                            </div>
                            <div className='checkbox-panel'>
                                <label>
                                    <input checked={filterType === PREPROCESSING_OPTION.fill} name="filterOption" 
                                    type='radio' value={PREPROCESSING_OPTION.fill} onChange={(evt) => {
                                        if (evt.target.checked) {
                                            setFilterType(evt.target.value);
                                        }
                                    }} />
                                    <span className='radio'>Fill with center crop</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`step-4 static-crop-section ${!checkFilterType(PREPROCESSING_OPTION.static) && 'd-none'}`} >
                <p className="txt">Crop each image to the specified section, such as the bottom third.</p>
                <div className="static-wrapper">
                    <div className='left-item'>
                        <div className="img-trim-box">
                            <img 
                                src={FULL_IMG} 
                                alt="images"
                                id="staticCropImg"   
                                onLoad={() => {
                                    forApplyStaticCrop();
                                }}                   
                            />
                        </div>
                        <div className="range-box">
                            <p>Horizontal</p>
                            <SliderBox orientation={HORIZONTAL} filterType={filterType} 
                            changeCropRatio={changeCropRatio} sliderRange={staticCropRange} />
                        </div>
                        <div className="range-box">
                            <p>Vertical</p>
                            <SliderBox orientation={VERTICAL} filterType={filterType} 
                            changeCropRatio={changeCropRatio} sliderRange={staticCropVerRange} />
                        </div>
                    </div>
                    <div className='right-item'>
                        <div className="static-crop-preview">
                            <canvas id="cropedArea" width={completedCrop?.width} 
                            height={completedCrop?.height}></canvas>
                        </div>
                    </div>
                </div>
            </div>
            {/* step-4 */}
            </Modal.Body>
            <Modal.Footer className='modal-custom-footer'>
            <div className='btn-space'>
                <button className='btn white-btn' onClick={() => {
                    closeModal();
                    resetFilter();
                }}>Cancel</button>
                <button disabled={isDisableApply()} className='btn link-btn green-btn' onClick={() => {
                    forApplyFilter();
                }}>Apply</button>
            </div>
            </Modal.Footer>
        </Modal>
      </>;
};
export default PreprocessingFilter;
