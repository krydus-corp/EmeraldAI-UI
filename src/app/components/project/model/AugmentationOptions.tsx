import { Modal, Button } from 'react-bootstrap';
import { FILP, ROTATE, RANDOM_CROP, BLUR, GREYSCALE, RANDOM_ERASING, COLOR_JITTER, NOISE, JCOMPRESSION, INFO_ICON } from '../../../../constant/image';
import { AUGMENTATION_OPTION } from '../../../../constant/static';

interface Props {
    show: boolean;
    closeModal: Function;
    setAugmentationFilter: Function;
    setFilterType: Function;
}

const AugmentationOptions = ({ show, closeModal, setAugmentationFilter, setFilterType }: Props) => {
    return <>
            {/* Augementation Options modal*/}
            <Modal
                    dialogClassName='dialog-544'
                    className='preprocessing-modal'
                    centered
                    show={show ? true : false}
                >
                    
                    <div className='modal-header-section'>
                    <div className='modal-head'>
                        <h3>
                        Augmentaion Options{' '}
                        <Button variant='secondary' className='btn-close' onClick={() => {closeModal();}}></Button>
                        </h3>
                    </div>
                    </div>
                    <Modal.Body>
                    <p>Augmentaions create new training examples for your model to learn from.</p>
                    <div className='upload-gallery'>
                        <div className='img-container'>                        
                        <div className='img-wrapper' onClick={() => {
                            setFilterType(AUGMENTATION_OPTION.flip);
                            setAugmentationFilter(true);
                        }}>
                            <div className='img-box'>
                            <img
                                src={FILP}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Flip images
</div>
                            <div className='img-caption'>Flip</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                            setFilterType(AUGMENTATION_OPTION.rotate);
                            setAugmentationFilter(true);
                        }}>
                            <div className='img-box'>
                            <img
                                src={ROTATE}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Rotate images by degree
</div>
                            <div className='img-caption'>Rotate</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                            setFilterType(AUGMENTATION_OPTION.random_crop);
                            setAugmentationFilter(true);
                        }}>
                            <div className='img-box'>
                            <img
                                src={RANDOM_CROP}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Crop images randomly
</div>
                            <div className='img-caption'>Random Crop</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.gaussian_blur);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={BLUR}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Apply gaussian_blur to the images
</div>
                            <div className='img-caption'>Gaussian Blur</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.grayscale);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={GREYSCALE}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Convert the images to greyscale
</div>
                            <div className='img-caption'>Grayscale</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.random_erasing);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={RANDOM_ERASING}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Randomly select rectangles in the images and erase the rectangles pixels
</div>
                            <div className='img-caption'>Random Erasing</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.color_jitter);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={COLOR_JITTER}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            	

Randomly change brightness, contrast, saturation and hue of the images

</div>
                            <div className='img-caption'>Color Jitter</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.noise);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={NOISE}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Add noise to the images
</div>
                            <div className='img-caption'>Noise</div>
                        </div>
                        <div className='img-wrapper' onClick={() => {
                                setFilterType(AUGMENTATION_OPTION.jpeg_compression);
                                setAugmentationFilter(true);
                            }}>
                            <div className='img-box'>
                            <img
                                src={JCOMPRESSION}
                                alt='gallery images'
                            />
                            </div>
                            <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                            Compress the images
</div>
                            <div className='img-caption'>Jpeg Compression</div>
                        </div>
                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer className='modal-custom-footer'>
                    <button className='btn white-btn' onClick={() => {closeModal();}}>Cancel</button>
                    </Modal.Footer>
                </Modal>
    </>;
};
export default AugmentationOptions;
