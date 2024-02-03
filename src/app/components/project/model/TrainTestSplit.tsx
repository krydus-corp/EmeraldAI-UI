import { Col } from 'react-bootstrap';
import { NumberLimit } from '../../../../constant/number';

interface Props {
    trainedPercent: number;
    trainedCount: number;
    validPercent: number;
    validCount: number;
    testPercent: number;
    testCount: number;
};

const TrainTestSplit = ({ trainedPercent, trainedCount, validPercent,
    validCount, testPercent, testCount }: Props) => {
        
    return <>
            <Col sm='6'>
                <div className='train-cards'>
                    <div className='head'>
                        <h4>Training Set</h4>
                        <span className='inline-tag green'>
                            {trainedPercent || NumberLimit.ZERO}%
                        </span>
                    </div>
                    <div className='img-count'>
                        <span>{trainedCount || NumberLimit.ZERO}</span> images
                    </div>
                </div>
            </Col>
            <Col sm='6'>
                <div className='train-cards'>
                <div className='head'>
                    <h4>Validation Set</h4>
                    <span className='inline-tag yellow'>
                    {validPercent || NumberLimit.ZERO}%
                    </span>
                </div>
                <div className='img-count'>
                    <span>{validCount || NumberLimit.ZERO}</span> images
                </div>
                </div>
            </Col>
            {/* As per the discussion we are hiding test split */}
            {/* <Col sm='4'>
                <div className='train-cards'>
                <div className='head'>
                    <h4>Testing Set</h4>
                    <span className='inline-tag blue'>
                    {testPercent || NumberLimit.ZERO}%
                    </span>
                </div>
                <div className='img-count'>
                    <span>{testCount || NumberLimit.ZERO}</span> images
                </div>
                </div>
            </Col> */}
    </>;
};
export default TrainTestSplit;
