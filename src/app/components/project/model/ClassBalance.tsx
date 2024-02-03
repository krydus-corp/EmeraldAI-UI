import _ from 'lodash';
import { ProgressBar } from 'react-bootstrap';
import { NumberLimit } from '../../../../constant/number';
import { REPRESENTATION_STATE } from '../../../../constant/static';
import { ChartBackgroundColor } from '../../charts/CommonChart';
interface Props {
    statistics: any;
    classesCount: number;
}

const ClassBalance = ({ statistics, classesCount }: Props) => {
    const isEmptyStats = (statisticsData: Object) => {
        return  statisticsData ? !('total_annotations' in statisticsData) : true;
    };

    const percentValue = NumberLimit.ONE_HUNDRED / statistics?.total_annotated_images;

    const getProgressValue = (count = NumberLimit.ZERO) => {
        return percentValue * count;
    };

    const displayLabelText = (state = '') => {
        let labelText = '';
        if (state  === REPRESENTATION_STATE.representationOver) {
            labelText = 'Over Represented';
        } else if (state  === REPRESENTATION_STATE.representationBalanced) {
            labelText = 'Balanced';
        } else {
            labelText = 'Under Represented';
        }
        return labelText;
    };

    const getClassName = (state = '') => {
        let clsName = '';
        if (state === REPRESENTATION_STATE.representationOver) {
            clsName = 'success';
        } else if (state === REPRESENTATION_STATE.representationBalanced) {
            clsName = 'warning';
        } else {
            clsName = 'danger';
        }
        return clsName;
    };


    const backgroundColorData = () => {
        const colorArr = [];
        for(let i = NumberLimit.ZERO; i < classesCount; i++) {
            const random = Math.floor(Math.random() * classesCount);
            colorArr.push(ChartBackgroundColor[random]);
        }        
        return colorArr;
    };
    
    const displayProgressBar = () => {
        const annotationOver =  statistics?.annotations_per_class && _.filter(statistics?.annotations_per_class,(fl:any)=>fl.balance === REPRESENTATION_STATE.representationOver);
        const annotaionBalanced =statistics?.annotations_per_class &&_.filter(statistics?.annotations_per_class,(fl:any)=>fl.balance === REPRESENTATION_STATE.representationBalanced);
        const annotationUnder =statistics?.annotations_per_class && _.filter(statistics?.annotations_per_class,(fl:any)=>fl.balance === REPRESENTATION_STATE.representationUnder);
        let mergedClasses =annotationOver && annotationOver.concat(annotaionBalanced);
        const annotationsPerClass=mergedClasses && mergedClasses.concat(annotationUnder);

        if (isEmptyStats(statistics)) {
            return <span>No data found.</span>;
        } else {
            let ind = NumberLimit.ZERO;
            return Object.keys(annotationsPerClass).map((key) => {
                ind++;
                const countVal = annotationsPerClass[key].count;
                const balance = annotationsPerClass[key].balance;
                return <div className='progress-row' key={key}>
                        <div className='name' style={{
                            color: ChartBackgroundColor[ind]
                        }}>{annotationsPerClass[key].name}</div>
                        <div className='data'>
                            <div className='value-left'>{countVal}</div>
                            <div className='bar'>
                            <ProgressBar variant={getClassName(balance)} now={getProgressValue(countVal)} />
                            </div>
                             <div className={`value-right ${displayLabelText(balance)}`}>
                        {displayLabelText(balance)}
                    </div>
                        </div>
                    </div>;
            });
        }
    };


    return (<>
                        {displayProgressBar()}
          </>);
  };
  
export default ClassBalance;
