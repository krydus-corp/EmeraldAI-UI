import { displayIntensity } from '../../../../utils/common';

interface Props {
    modelData: any;
    isEmptyObj: Function;
};
const AugmentationData = ({ modelData, isEmptyObj }: Props) => {
    const augmentationData = modelData?.augmentation;
    return (<div className='para'>
            {augmentationData?.flip?.horizontal && <p>
                      Horizontal Flip - <span className="grey">Applied</span>
                  </p>}
                  {augmentationData?.flip?.vertical && <p>
                      Vertical Flip - <span className="grey">Applied</span>
                  </p>}
                  {!isEmptyObj(augmentationData?.color_jitter) && (<p>
                      Color Jitter&nbsp;-&nbsp;
                      <span className="grey">Brightness: {displayIntensity(augmentationData?.color_jitter?.brightness)}&nbsp;
                      Contrast: {displayIntensity(augmentationData?.color_jitter?.contrast)}&nbsp;
                      Hue: {displayIntensity(augmentationData?.color_jitter?.hue)}&nbsp;
                      Saturation: {displayIntensity(augmentationData?.color_jitter?.saturation)}</span>
                  </p>)}
                  {augmentationData?.gaussian_blur?.intensity && <p>
                      Gaussian Blur Intensity - <span className="grey">{displayIntensity(augmentationData?.gaussian_blur?.intensity)}</span>
                  </p>}
                  {augmentationData?.greyscale?.enabled && <p>
                      Greyscale - <span className="grey">Applied</span>
                  </p>}
                  {augmentationData?.jpeg_compression?.enabled && <p>
                      Jpeg Compression - <span className="grey">Applied</span>
                  </p>}
                  {augmentationData?.noise?.intensity && <p>
                      Noise Intensity - <span className="grey">{displayIntensity(augmentationData?.noise?.intensity)}</span>
                  </p>}
                  {augmentationData?.random_crop?.enabled && <p>
                      Random Crop - <span className="grey">Applied</span>
                  </p>}
                  {augmentationData?.random_erasing?.enabled && <p>
                      Random Erasing - <span className="grey">Applied</span>
                  </p>}
                  {augmentationData?.rotate?.degree && <p>
                      Rotate - <span className="grey">{augmentationData?.rotate?.degree} degree</span>
                  </p>}
            {isEmptyObj(modelData?.preprocessing) && <p>
                <span className='grey'>
                    No augmentations were applied.
                </span>
            </p>}
    </div>);
};
export default AugmentationData;
