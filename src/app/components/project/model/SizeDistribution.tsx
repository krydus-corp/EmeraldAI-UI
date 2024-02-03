import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { NumberLimit } from '../../../../constant/number';
import { ANNOTATION_SIZE, REPRESENTATION_STATE } from '../../../../constant/static';
import { ChartBackgroundColor } from '../../charts/CommonChart';
import DimensionChart from '../../charts/DimensionChart';
interface Props {
    statistics: any;
    classesCount: number;
}
const SizeDistribution = ({ statistics }: Props) => {

    const isEmptyStats = (statisticsObj: Object) => {
        return statisticsObj ? !('total_annotations' in statisticsObj) : true;
    };

    const perValue = NumberLimit.ONE_HUNDRED / statistics?.insights?.dimensions?.length;

    const getProgressData = (count = NumberLimit.ZERO) => {
        return perValue * count;
    };

    const displayLabelText = (state = '') => {
        let labelTxt = '';
        if (state === REPRESENTATION_STATE.representationOver) {
            labelTxt = 'Over Represented';
        } else if (state === REPRESENTATION_STATE.representationBalanced) {
            labelTxt = 'Balance Represented';
        } else {
            labelTxt = 'Under Represented';
        }
        return labelTxt;
    };

    const getClassName = (state = '') => {
        let clssName = '';
        if (state === REPRESENTATION_STATE.representationOver) {
            clssName = 'success';
        } else if (state === REPRESENTATION_STATE.representationBalanced) {
            clssName = 'warning';
        } else {
            clssName = 'danger';
        }
        return clssName;
    };

    const progressBarView = (ind: number, lable: string, val: number, balance: string) => {
        return <div className='progress-row' key={`${lable}_${ind}`}>
                <div className='name' style={{
                    color: ChartBackgroundColor[ind]
                }}>{lable}</div>
                <div className='data'>
                    <div className='value-left'>{val}</div>
                    <div className='bar'>
                    <ProgressBar variant={getClassName(balance)} now={getProgressData(val)} />
                    </div>
                    <div className={`value-right ${displayLabelText(balance)}`}>
                        {displayLabelText(balance)}
                    </div>
                </div>
            </div>;
    };

    const displayProgressView = () => {        
        if (isEmptyStats(statistics)) {
            return <span>No data found.</span>;
        } else {
            const sizeDistributions = statistics?.insights?.size_distributions;            
            const dataObj = {
                tiny: {
                    lable: 'Tiny',
                    value: sizeDistributions?.tiny?.count
                },
                small: {
                    lable: 'Small',
                    value: sizeDistributions?.small?.count
                },
                medium: {
                    lable: 'Medium',
                    value: sizeDistributions?.medium?.count
                },
                large: {
                    lable: 'Large',
                    value: sizeDistributions?.large?.count
                },
                jumbo: {
                    lable: 'Jumbo',
                    value: sizeDistributions?.jumbo?.count
                }
            };
            return <>
                {progressBarView(NumberLimit.ONE, dataObj.tiny.lable, dataObj.tiny.value, 
                        sizeDistributions?.tiny?.balance)}
                {progressBarView(NumberLimit.TWO, dataObj.small.lable, dataObj.small.value, 
                    sizeDistributions?.small?.balance)}
                {progressBarView(NumberLimit.THREE, dataObj.medium.lable, dataObj.medium.value, 
                    sizeDistributions?.medium?.balance)}
                {progressBarView(NumberLimit.FOUR, dataObj.large.lable, dataObj.large.value, 
                    sizeDistributions?.large?.balance)}
                {progressBarView(NumberLimit.FIVE, dataObj.jumbo.lable, dataObj.jumbo.value, 
                    sizeDistributions?.jumbo?.balance)}
            </>;
        }
    };

    const displayAspectRatioDistribution = () => {
        if (isEmptyStats(statistics)) {
            return <></>;
        } else {
            const aspectRatioDistributions = statistics?.insights?.aspect_ratio_distributions;
            const dataObj = {
                tall: {
                    lable: 'Tall',
                    value: aspectRatioDistributions?.tall?.count
                },
                wide: {
                    lable: 'Wide',
                    value: aspectRatioDistributions?.wide?.count
                },
                square: {
                    lable: 'Square',
                    value: aspectRatioDistributions?.square?.count
                }
            };
            return <>
                {progressBarView(NumberLimit.ONE, dataObj.tall.lable, dataObj.tall.value, 
                        aspectRatioDistributions?.tall?.balance)}
                {progressBarView(NumberLimit.TWO, dataObj.wide.lable, dataObj.wide.value, 
                        aspectRatioDistributions?.wide?.balance)}
                {progressBarView(NumberLimit.THREE, dataObj.square.lable, dataObj.square.value, 
                        aspectRatioDistributions?.square?.balance)}
            </>;

        }
    };



    return (<>
                <h5>
                    Size Distribution
                <span className='d-none'>
                    The{' '}
                    <span className='green-box'>green box</span>{' '}
                    indicates the median width by median height
                    image ({statistics?.insights?.median_height}x{statistics?.insights?.median_width}).
                </span>
                </h5>
                {displayProgressView()}
                {statistics?.insights?.dimensions ?<DimensionChart dimensions={statistics?.insights?.dimensions} />: <div className="enpoint-loader"><div className='loader-inline'><div className='loader-inner'></div></div></div>}
                {/* chart-box */}
                <h5>Aspect Ratio Distribution</h5>
                {displayAspectRatioDistribution()}
    </>);
};
export default React.memo(SizeDistribution);
