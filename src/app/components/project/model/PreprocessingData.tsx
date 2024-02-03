import { NumberLimit } from '../../../../constant/number';
import { displayNumberValue } from '../../../../utils/common';

interface Props {
    modelData: any;
    isEmptyObj: Function;
};

const PreprocessingData = ({ modelData, isEmptyObj }: Props) => {
    return (<div className='para'>
                {modelData?.preprocessing?.percent_crop && (
                    <p>
                    Percent Crop - <span className="grey">Width:{' '}
                    {displayNumberValue(modelData?.preprocessing?.percent_crop?.width *
                      NumberLimit.ONE_HUNDRED)}
                    , Height:{' '}
                    {displayNumberValue(modelData?.preprocessing?.percent_crop?.height *
                      NumberLimit.ONE_HUNDRED)}</span>
                  </p>
                )}
                {modelData?.preprocessing?.resize && (
                    <p>
                        Resize -{' '}
                        <span className="grey">{modelData?.preprocessing?.resize?.mode} to&nbsp;
                        {modelData?.preprocessing?.resize?.size?.height}x
                        {modelData?.preprocessing?.resize?.size?.width}</span>
                    </p>
                )}
                {isEmptyObj(modelData?.preprocessing) && <span className='grey'>
                    No preprocessing were applied.</span>}
    </div>);
};
export default PreprocessingData;
