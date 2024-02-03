import { NumberLimit } from '../../../../constant/number';
import { CLASSIFICATION } from '../../../../constant/static';
import { changeDateFormat } from '../../../../utils/common';

interface Props {
    modelData: any;
    project: any;
};

const ModelDetailData = ({ modelData, project }: Props) => {
    
    const displayPercent = (val = NumberLimit.ZERO) => {
        let res = NumberLimit.ZERO;
        if (val) {
            res = Math.round(val * NumberLimit.ONE_HUNDRED);
        }
        return res;
    };

    const roundNumber = (val = NumberLimit.ZERO) => {
        return typeof(val) === 'number' && val.toFixed(NumberLimit.TWO);
    };

    return (<div className='para'>
                {project?.annotation_type !== CLASSIFICATION && (
                <>
                    <p>
                        train: cross entropy - <span className='green'>

                        {modelData?.metrics ? modelData?.metrics['train:cross_entropy']?.toFixed(3) : NumberLimit.ZERO}
                        </span>
                    </p>
                    <p>
                        train: smooth l1 - <span className='green'>

                        {modelData?.metrics ? modelData?.metrics['train:smooth_l1']?.toFixed(3) : NumberLimit.ZERO}
                        </span>
                    </p>
                    <p>
                    validation:mAP - <span className='green'>

                        {modelData?.metrics ? displayPercent(modelData?.metrics['validation:mAP']) : NumberLimit.ZERO}%
                        </span>
                    </p>
                </>
                )}       
                {project?.annotation_type === CLASSIFICATION && (<>         
                    <p>
                        Train | Accuracy -{' '}
                        <span className='green'>
                            {modelData?.metrics && roundNumber(modelData?.metrics['train:accuracy']) ? `${roundNumber(modelData?.metrics['train:accuracy'])}%` : `${NumberLimit.ZERO}%`}
                        </span>
                    </p>
                    <p>
                        Validation | Accuracy - <span className='green'>
                            {modelData?.metrics && roundNumber(modelData?.metrics['validation:accuracy'])? `${roundNumber(modelData?.metrics['validation:accuracy'])}%` : `${NumberLimit.ZERO}%`}
                            </span>
                    </p>
                    </>
                )}
                <p>
                    Model ID - <span className='grey'>{modelData?.id || '-'}</span>
                </p>
                <p>
                    Generated -{' '}
                    <span className='grey'>
                        {changeDateFormat(modelData?.created_at)}
                    </span>
                </p>
    </div>);
};
export default ModelDetailData;
