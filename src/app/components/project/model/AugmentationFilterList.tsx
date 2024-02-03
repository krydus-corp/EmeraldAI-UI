import { ListGroup } from 'react-bootstrap';
import { NumberLimit } from '../../../../constant/number';
import { AUGMENTATION_OPTION } from '../../../../constant/static';
import { displayIntensity } from '../../../../utils/common';
interface Props {
    removeAugementaion: Function;
    modelData: any;
    editAugmentationFilter: Function; 
    isUpdate: boolean;
    setIsUpdate: Function;
    degreeRange: Array<number>;
}
const AugmentationFilterList = ({ modelData, removeAugementaion, 
        editAugmentationFilter, isUpdate, setIsUpdate, degreeRange }: Props) => {
    
    const isEmptyObjs = (objVal = {}) => {
        return !Object.keys(objVal).length;
    };

    return <>
            <ListGroup>
                {!isEmptyObjs(modelData?.augmentations?.flip) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.flip?.horizontal && <h5>
                        Flip Horizontal <span>Applied</span>
                    </h5>}
                    {modelData?.augmentations?.flip?.vertical && <h5>
                        Flip Vertical <span>Applied</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.flip);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.flip);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}
                {!isEmptyObjs(modelData?.augmentations?.rotate) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.rotate?.degree && <h5>
                        Rotate <span>{modelData?.augmentations?.rotate?.degree} degree</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            if (degreeRange[NumberLimit.ZERO] > NumberLimit.ZERO) {
                                editAugmentationFilter(AUGMENTATION_OPTION.rotation);
                            } else {
                                editAugmentationFilter(AUGMENTATION_OPTION.rotate);
                            }                            
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            if (degreeRange[NumberLimit.ZERO] > NumberLimit.ZERO) {
                                removeAugementaion(AUGMENTATION_OPTION.rotation);
                            } else {
                                removeAugementaion(AUGMENTATION_OPTION.rotate);
                            }
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}  
                {!isEmptyObjs(modelData?.augmentations?.random_erasing) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.random_erasing?.enabled && <h5>
                        Random Erasing <span>Applied</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.random_erasing);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.random_erasing);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}
                {!isEmptyObjs(modelData?.augmentations?.random_crop) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.random_crop?.enabled && <h5>
                        Random Crop <span>Applied</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.random_crop);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.random_crop);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}
                {!isEmptyObjs(modelData?.augmentations?.noise) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.noise?.intensity && <h5>
                        Noise Intensity <span>{displayIntensity(modelData?.augmentations?.noise?.intensity)}</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.noise);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.noise);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}
                {!isEmptyObjs(modelData?.augmentations?.jpeg_compression) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.jpeg_compression?.enabled && <h5>
                        Jpeg Compression <span>Applied</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.jpeg_compression);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.jpeg_compression);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}
                {!isEmptyObjs(modelData?.augmentations?.greyscale) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.greyscale?.enabled && <h5>
                        Greyscale <span>Applied</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.grayscale);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.grayscale);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>} 
                {!isEmptyObjs(modelData?.augmentations?.gaussian_blur) && <ListGroup.Item>
                    <div className='left-item'>
                    {modelData?.augmentations?.gaussian_blur?.intensity && <h5>
                        Gaussian Blur Intensity <span>{displayIntensity(modelData?.augmentations?.gaussian_blur?.intensity)}</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.gaussian_blur);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.gaussian_blur);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>} 
                {!isEmptyObjs(modelData?.augmentations?.color_jitter) && <ListGroup.Item>
                    <div className='left-item color-jitter-left'>
                    <h4>Color Jitter</h4>
                    {modelData?.augmentations?.color_jitter?.brightness && <h5>
                        Brightness <span>{displayIntensity(modelData?.augmentations?.color_jitter?.brightness)}</span>
                    </h5>}
                    {modelData?.augmentations?.color_jitter?.contrast && <h5>
                        Contrast <span>{displayIntensity(modelData?.augmentations?.color_jitter?.contrast)}</span>
                    </h5>}
                    {modelData?.augmentations?.color_jitter?.hue && <h5>
                        Hue <span>{displayIntensity(modelData?.augmentations?.color_jitter?.hue)}</span>
                    </h5>}
                    {modelData?.augmentations?.color_jitter?.saturation && <h5>
                        Saturation <span>{displayIntensity(modelData?.augmentations?.color_jitter?.saturation)}</span>
                    </h5>}
                    <button
                        type='button'
                        className='btn link-btn edit-btn'
                        onClick={() => {
                            editAugmentationFilter(AUGMENTATION_OPTION.color_jitter);
                        }}
                    >
                        Edit
                    </button>
                    </div>
                    <div className='right-item'>
                    <button className='btn btn-close' onClick={() => {
                            removeAugementaion(AUGMENTATION_OPTION.color_jitter);
                            setIsUpdate(!isUpdate);
                        }}></button>
                    </div>
                </ListGroup.Item>}     
            </ListGroup>
    </>;
};
export default AugmentationFilterList;
