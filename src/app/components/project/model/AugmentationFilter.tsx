import { Modal, Button } from 'react-bootstrap';
import { CORRECT_FLOWER, FULL_IMG, noiseImagePath, RANDOM_CROP_BIG, ERASING_BIG} from '../../../../constant/image';
import { NumberLimit } from '../../../../constant/number';
import { AUGMENTATION_OPTION, HORIZONTAL } from '../../../../constant/static';
import SliderBox from './SliderBox';

interface Props {
    filterType: string;
    show: boolean;
    closeModal: Function;
    closeModalParent: Function;
    flipHorizontal: boolean;
    setFlipHorizontal: Function;
    flipVertical: boolean;
    setFlipVertical: Function;
    setIsUpdate: Function;
    isUpdate: boolean;
    degree: number;
    setDegree: Function;
    defaulData: any;
    setDefaultData: Function;
    degreeRange: Array<number>;
    setDegreeRange: Function;
    noiseIntensity: number;
    setNoiseIntensity: Function;
    jitterIntensity: number;
    setJitterIntensity: Function;
    gaussianIntensity: number;
    setGaussianIntensity: Function;
}

const AugmentationFilter = ({ show, closeModal, filterType, 
    flipHorizontal, setFlipHorizontal, flipVertical,
    setFlipVertical, closeModalParent,
    setIsUpdate, isUpdate, degree, setDegree, 
    defaulData, setDefaultData, degreeRange,
    setDegreeRange, noiseIntensity, setNoiseIntensity, jitterIntensity,
    setJitterIntensity, gaussianIntensity, setGaussianIntensity }: Props) => {
    const checkFilterType = (filterVal: string) => {
        return filterType === filterVal;
    };

    const setFlipData = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                flip: {
                    horizontal: flipHorizontal,
                    vertical: flipVertical
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setRotateData = () => {
        if (degree) {
            let augmentationData = defaulData;
            augmentationData = {
                ...augmentationData,
                augmentations: {
                    ...augmentationData.augmentations,
                    rotate: {
                        degree: Number(degree)
                    }
                }        
            };
            setDefaultData(augmentationData);
        }        
    };

    const setColorJitter = () => {
        let augmentationData = defaulData;
        const colorJitter = jitterIntensity/NumberLimit.ONE_HUNDRED;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                color_jitter: {
                    brightness: colorJitter,
                    contrast: colorJitter,
                    hue: colorJitter,
                    saturation: colorJitter
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setGaussianBlur = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                gaussian_blur: {
                    intensity: gaussianIntensity/NumberLimit.ONE_HUNDRED
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setGreyscale = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                greyscale: {
                    enabled: true
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setJpegCompression = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                jpeg_compression: {
                    enabled: true
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setNoise = () => {
        const inten = noiseIntensity/NumberLimit.ONE_HUNDRED;
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                noise: {
                    intensity: inten
                }
            }        
        };
        setDefaultData(augmentationData);
    };
    
    const setRandomCrop = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                random_crop: {
                    enabled: true
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const setRandomErasing = () => {
        let augmentationData = defaulData;
        augmentationData = {
            ...augmentationData,
            augmentations: {
                ...augmentationData.augmentations,
                random_erasing: {
                    enabled: true
                }
            }        
        };
        setDefaultData(augmentationData);
    };

    const applyAugmentFilterSecond = () => {
        switch (filterType) {
            case AUGMENTATION_OPTION.jpeg_compression: {
                setJpegCompression();
            }          
            break;
            case AUGMENTATION_OPTION.noise: {
                setNoise();
            }          
            break;
            case AUGMENTATION_OPTION.random_crop: {
                setRandomCrop();
            }          
            break;
            case AUGMENTATION_OPTION.random_erasing: {
                setRandomErasing();
            }          
            break;
        }
    };

    const applyAugmentFilter = () => {
        switch (filterType) {
            case AUGMENTATION_OPTION.flip: {
                setFlipData();
            }          
            break;
            case AUGMENTATION_OPTION.rotate: {
                setRotateData();
            }    
            break;  
            case AUGMENTATION_OPTION.rotation: {
                setRotateData();
            }    
            break;
            case AUGMENTATION_OPTION.color_jitter: {
                setColorJitter();
            }          
            break;
            case AUGMENTATION_OPTION.gaussian_blur: {
                setGaussianBlur();
            }
            break;
            case AUGMENTATION_OPTION.grayscale: {
                setGreyscale();
            }          
            break;
            default:
                applyAugmentFilterSecond();
              break;
        }   
        setIsUpdate(!isUpdate);
        closeModal();
        closeModalParent();        
    };

    const isValidFlip = () => {
        return (filterType === AUGMENTATION_OPTION.flip) && !flipHorizontal && !flipVertical;
    };

    const isApplyDisabled = () => {
        return isValidFlip();
    };

    const horizontalVerticalRotate = (flipH = false, flipV = false) => {
        const canvas: any = document.getElementById('horizontalVertical'),
        ctx = canvas.getContext('2d'),
        img = new Image(),
        width = NumberLimit.THREE_HUNDRED,
        height = NumberLimit.THREE_HUNDRED;
        img.src = FULL_IMG;
        const scaleH = flipH ? NumberLimit.MINUS_ONE : NumberLimit.ONE, 
        scaleV = flipV ? NumberLimit.MINUS_ONE : NumberLimit.ONE, 
        posX = flipH ? width * NumberLimit.MINUS_ONE : NumberLimit.ZERO, 
        posY = flipV ? height * NumberLimit.MINUS_ONE : NumberLimit.ZERO; 
        ctx.save();
        ctx.scale(scaleH, scaleV);
        ctx.drawImage(img, posX, posY, width, height);
        ctx.restore(); 
    };

    const forRotateImage = (degrees = NumberLimit.ZERO) => {
            let canvas: any = null;
            if (filterType === AUGMENTATION_OPTION.rotate) {
                canvas = document.getElementById('rotateImage');
            } else {
                canvas = document.getElementById('rotationImage');
            }
            const ctx = canvas.getContext('2d');
            const image = document.createElement('img');
            image.src = FULL_IMG;
            ctx.clearRect(NumberLimit.ZERO, NumberLimit.ZERO, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width/NumberLimit.TWO,canvas.height/NumberLimit.TWO);
            ctx.rotate(degrees*Math.PI/NumberLimit.ONE_HUNDRED_EIGHTY);
            ctx.drawImage(image,-image.width/NumberLimit.TWO,-image.width/NumberLimit.TWO);
            ctx.restore();
    };

    const displayImageOnCanvas = (id = '') => {
        const canvas: any = document.getElementById(id),
        ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, NumberLimit.ZERO, NumberLimit.ZERO);                 
        };                                      
        img.src = FULL_IMG;         
    };

    const applyColorJiiter = () => {
        displayImageOnCanvas('jitterImage');
    };

    const applyGaussianImage = () => {
        displayImageOnCanvas('gaussianImage');
    };

    const resetFilter = () => {
        switch (filterType) {
            case AUGMENTATION_OPTION.flip: {
                setFlipVertical(!!defaulData?.augmentations?.flip?.vertical);
                setFlipHorizontal(!!defaulData?.augmentations?.flip?.horizontal);
            }          
            break;
            case AUGMENTATION_OPTION.rotate: {
                setDegree(defaulData?.augmentations.rotate?.degree || NumberLimit.ZERO);
            }    
            break;
            case AUGMENTATION_OPTION.color_jitter: {
                const jitInt = defaulData?.augmentations.color_jitter?.brightness ? 
                    defaulData?.augmentations.color_jitter?.brightness*NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;
                setJitterIntensity(jitInt);
            }          
            break;
            case AUGMENTATION_OPTION.gaussian_blur: {
                const gauInt = defaulData?.augmentations.gaussian_blur?.intensity ? 
                defaulData?.augmentations.gaussian_blur?.intensity*NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;
                setGaussianIntensity(gauInt);
            }
            break;
            case AUGMENTATION_OPTION.noise: {
                const noiseInt = defaulData?.augmentations.noise?.intensity ? 
                defaulData?.augmentations.noise?.intensity*NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;
                setNoiseIntensity(noiseInt);
            }          
            break;
            default:
              break;
        }
    };

    return <>
            {/* Static Flip modal*/}
                <Modal
                    dialogClassName='dialog-544'
                    className='preprocessing-modal'
                    centered
                    show={show ? true : false}
                >
                    <div className='modal-header-section'>
                    <div className='modal-head'>
                        <h3>
                            {checkFilterType(AUGMENTATION_OPTION.flip) && 'Flip'}
                            {checkFilterType(AUGMENTATION_OPTION.rotate) && 'Rotate'}
                            {checkFilterType(AUGMENTATION_OPTION.random_crop) && 'Random Crop'}
                            {checkFilterType(AUGMENTATION_OPTION.rotation) && 'Rotation'}
                            {checkFilterType(AUGMENTATION_OPTION.gaussian_blur) && 'Gaussian Blur'}
                            {checkFilterType(AUGMENTATION_OPTION.grayscale) && 'Grayscale'}
                            {checkFilterType(AUGMENTATION_OPTION.random_erasing) && 'Random Erasing'}
                            {checkFilterType(AUGMENTATION_OPTION.color_jitter) && 'Color Jitter'}
                            {checkFilterType(AUGMENTATION_OPTION.noise) && 'Noise'}
                            {checkFilterType(AUGMENTATION_OPTION.jpeg_compression) && 'Jpeg Compression'}
                            <Button variant='secondary' className='btn-close' onClick={() => {
                                resetFilter();
                                closeModal();
                                }}></Button>
                        </h3>
                    </div>
                    </div>
                    <Modal.Body className='flip-modal'>
                        <div className={`step-1 flip-step ${!checkFilterType(AUGMENTATION_OPTION.flip) && 'd-none'}`}>
                            <p className='txt'>Add horizontal or verticle flip to help your model be insensitive to subject orientation</p>
                            <div className='flip-body'>
                                <div className={`img-trim-box ${(flipHorizontal || flipVertical) && 'd-none'}`}>
                                    <img src={CORRECT_FLOWER} alt='images' onLoad={() => {
                                        horizontalVerticalRotate(flipHorizontal, flipVertical);
                                    }} />
                                </div>
                                <div className={`img-trim-box ${(!flipHorizontal && !flipVertical) && 'd-none'}`}>
                                        <canvas id="horizontalVertical" width="300" height="300"></canvas>
                                </div>                                
                                <div className='checkbox-list'>
                                    <ul className='list-group list-group-flush'>
                                    <li className='list-group-item'>
                                        <div className='checkbox-panel'>
                                        <label>
                                            <input type='checkbox' checked={flipHorizontal} onChange={(evt) => {
                                               setFlipHorizontal(evt.target.checked);
                                               setIsUpdate(!isUpdate);
                                               horizontalVerticalRotate(evt.target.checked, flipVertical);
                                            }} />
                                            <span className='checkbox'>Horizontal</span>
                                        </label>
                                        </div>
                                        <div className='checkbox-panel'>
                                        <label>
                                            <input type='checkbox' checked={flipVertical} onChange={(evt) => {                                                
                                                setFlipVertical(evt.target.checked);
                                                setIsUpdate(!isUpdate);
                                                horizontalVerticalRotate(flipHorizontal, evt.target.checked);   
                                            }} />
                                            <span className='checkbox'>Verticle</span>
                                        </label>
                                        </div>
                                    </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* step-1 */}

                        <div className={`step-2 rotate-clock-step ${!checkFilterType(AUGMENTATION_OPTION.rotate) && 'd-none'}`}>
                            <p className='txt'>Rotate the image with the rotate buttons</p>
                            <div className='flip-body'>
                                <div className={`img-trim-box ${degree && 'd-none'}`}>
                                    <img src={CORRECT_FLOWER} alt='images' onLoad={() => {
                                        forRotateImage(degree);
                                    }} />
                                </div>
                                <div className={`img-trim-box ${!degree && 'd-none'}`}>
                                        <canvas id="rotateImage" width="300" height="300"></canvas>
                                </div>
                                <div className='checkbox-list'>
                                    <ul className='list-group list-group-flush'>
                                    <li className='list-group-item'>
                                        <div className='checkbox-panel'>
                                        <label>
                                            <input checked={degree === NumberLimit.NIGHTY} name="degree" 
                                            type='radio' value={NumberLimit.NIGHTY} onChange={(evt) => {
                                                if (evt.target.checked) {
                                                    const deg = Number(evt.target.value);
                                                    setDegree(deg);
                                                    forRotateImage(deg);
                                                }
                                            }} />
                                            <span className='radio'>Clockwise</span>
                                        </label>
                                        </div>
                                        <div className='checkbox-panel'>
                                        <label>
                                            <input checked={degree === NumberLimit.TWO_HUNDRED_SEVENTY} name="degree" type='radio' 
                                            value={NumberLimit.TWO_HUNDRED_SEVENTY}  onChange={(evts) => {
                                                if (evts.target.checked) {
                                                    const degs = Number(evts.target.value);
                                                    setDegree(degs);
                                                    forRotateImage(degs);
                                                }
                                            }}/>
                                            <span className='radio'>Counter clockwise</span>
                                        </label>
                                        </div>
                                        <div className='checkbox-panel'>
                                        <label>
                                            <input checked={degree === NumberLimit.ONE_HUNDRED_EIGHTY} name="degree" type='radio' 
                                                value={NumberLimit.ONE_HUNDRED_EIGHTY}  onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const degr = Number(e.target.value);
                                                        setDegree(degr);
                                                        forRotateImage(degr);
                                                    }
                                                }} />
                                            <span className='radio'>Upside down</span>
                                        </label>
                                        </div>
                                    </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* step-2 */}

                        <div className={`step-3 crop-step ${!checkFilterType(AUGMENTATION_OPTION.random_crop) && 'd-none'}`}>
                            <p className='txt'>Crop the image Randomly</p>
                            <div className='flip-body'>
                                <div className='img-trim-box'>
                                    <img src={RANDOM_CROP_BIG} alt='images' />
                                </div>
                            </div>
                        </div>
                        {/* step-3 */}
                        
                        <div className={`step-4 rotation-step ${!checkFilterType(AUGMENTATION_OPTION.rotation) && 'd-none'}`}>
                            <p className='txt'>Rotate the image with the angle slider</p>
                            <div className='flip-body'>
                                <div className='img-trim-box'>
                                    <img src={CORRECT_FLOWER} alt='images' onLoad={() => {
                                        forRotateImage(degree);
                                    }} />
                                </div>
                                <div className={`img-trim-box ${!degree && 'd-none'}`}>
                                        <canvas id="rotationImage" width="300" height="300"></canvas>
                                </div>
                                <div className="range-box">
                                    <SliderBox orientation={HORIZONTAL} filterType={filterType} 
                                        changeCropRatio={(val: number) => {
                                            setDegree(val);
                                            setDegreeRange([val]);
                                            forRotateImage(val);
                                        }}
                                        sliderRange={degreeRange}
                                        maxRange={NumberLimit.ONE_HUNDRED_EIGHTY} />
                                </div>
                            </div>
                        </div>
                        {/* step-4 */}


                        <div className={`step-5 aussian-blur-step ${!checkFilterType(AUGMENTATION_OPTION.gaussian_blur) && 'd-none'}`}>
                            <p className='txt'>Apply gaussian blur to the image with the slider</p>
                            <div className='flip-body'>
                                <div className='img-trim-box blur d-none'>
                                    <img src={FULL_IMG} alt='images' onLoad={() => {
                                        applyGaussianImage();
                                    }} />
                                </div>
                                <div className={`img-trim-box blur`}>
                                        <canvas style={{filter: `blur(${gaussianIntensity*NumberLimit.POINT_SIXTEEN}px)`}} id="gaussianImage" width="300" height="300"></canvas>
                                </div>
                            </div>
                            <div className="range-box">
                                <SliderBox orientation={HORIZONTAL} filterType={filterType} 
                                        changeCropRatio={(val: number) => {
                                            setGaussianIntensity(val);                                            
                                        }}
                                        sliderRange={[gaussianIntensity]} />
                            </div>
                        </div>
                        {/* step-5 */}

                        <div className={`step-6 grayscale-step ${!checkFilterType(AUGMENTATION_OPTION.grayscale) && 'd-none'}`}>
                            <p className='txt'>Apply grayscale to the image</p>
                            <div className='flip-body'>
                                <div className='img-trim-box grayscale'>
                                    <img src={CORRECT_FLOWER} alt='images' />
                                </div>
                            </div>
                        </div>
                        {/* step-6 */}

                        <div className={`step-7 random-erasing-step ${!checkFilterType(AUGMENTATION_OPTION.random_erasing) && 'd-none'}`}>
                            <p className='txt'>Apply random erase to the image to erase random part of the image</p>
                            <div className='flip-body'>
                                <div className='img-trim-box'>
                                    <img src={ERASING_BIG} alt='images' />
                                </div>
                            </div>
                        </div>
                        {/* step-7 */}

                        <div className={`step-8 color-jitter-step ${!checkFilterType(AUGMENTATION_OPTION.color_jitter) && 'd-none'}`}>
                            <p className='txt'>Apply color jitter to the image with the slider</p>
                            <div className='flip-body'>
                                <div className={`img-trim-box ${!!jitterIntensity && 'd-none'}`}>
                                    <img src={FULL_IMG} alt='images' onLoad={() => {
                                        applyColorJiiter();
                                    }} />
                                </div>
                                <div className={`img-trim-box ${!jitterIntensity && 'd-none'}`}>
                                        <canvas style={{filter: `saturate(${jitterIntensity*NumberLimit.ONE_HUNDRED}%)`}}  id="jitterImage" width="300" height="300"></canvas>
                                </div>
                                <div className="range-box">
                                <SliderBox orientation={HORIZONTAL} filterType={filterType} 
                                        changeCropRatio={(val: number) => {
                                            setJitterIntensity(val);
                                        }}
                                        sliderRange={[jitterIntensity]} />
                                </div>
                            </div>
                        </div>
                        {/* step-8 */}

                        <div className={`step-9 noise-step ${!checkFilterType(AUGMENTATION_OPTION.noise) && 'd-none'}`} >
                            <p className='txt'>Apply noise to the image with the slider</p>
                            <div className='flip-body'>
                                <div className='img-trim-box noise'>
                                    {noiseIntensity ? <img src={noiseImagePath(noiseIntensity)} alt='images' /> : 
                                    <img src={FULL_IMG} alt='images' />}
                                    
                                </div>                    
                                <div className="range-box">
                                    <SliderBox orientation={HORIZONTAL} filterType={filterType} 
                                        changeCropRatio={(val: number) => {
                                            setNoiseIntensity(val);
                                        }}
                                        sliderRange={[noiseIntensity]} maxRange={NumberLimit.ONE_HUNDRED} />
                                </div>
                            </div>
                        </div>
                        {/* step-9 */}

                        <div className={`step-9 compression-step ${!checkFilterType(AUGMENTATION_OPTION.jpeg_compression) && 'd-none'}`}>
                            <p className='txt'>Compress the Jpeg images.</p>
                            <div className='flip-body'>
                                <div className='img-trim-box'>
                                    <img src={CORRECT_FLOWER} alt='images' />
                                </div>
                            </div>
                        </div>
                        {/* step-10 */}

                    </Modal.Body>
                    <Modal.Footer className='modal-custom-footer'>
                    <div className='btn-space'>
                        <button className='btn white-btn' onClick={() => {
                                resetFilter();
                                closeModal();
                            }}>Cancel</button>
                        <button disabled={isApplyDisabled()} className='btn link-btn green-btn' onClick={() => {
                            applyAugmentFilter();
                        }}>Apply</button>
                    </div>
                    </Modal.Footer>
                </Modal>
    </>;
};
export default AugmentationFilter;
