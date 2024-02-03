import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartBackgroundColor, chartBeforeDraw } from './CommonChart';
import { NumberLimit } from '../../../constant/number';
import BarChart from './BarChart';
import ViewMorePredictionChart from './ViewMorePredictionChart'
import _ from 'lodash';

ChartJS.register(ArcElement, Tooltip, Legend);
interface Props {
    predictionsData: {total_predictions: number, predictions_per_class: any},
    getImageData: Function,
    viewMoreChart?: Function,
    isModalPopup?: boolean,
    selectedData: any,
    selectAll: Function,
    colorIndex?:any
}
const PredictionsChart = ({ predictionsData, getImageData, viewMoreChart, isModalPopup, selectedData, selectAll, colorIndex }: Props) => {    
    let labelText = [];
    let labelTextFullList = [];
    const dataImageCount = [];
    const sortedPredictions = predictionsData?.predictions_per_class && _.sortBy(predictionsData?.predictions_per_class,'count').reverse();  
   if (sortedPredictions) {    
    for (const key in sortedPredictions) {
        if (sortedPredictions[key].count) {
            labelText.push(sortedPredictions[key].classname);
            dataImageCount.push(sortedPredictions[key].count);
        }
    }   
   }
   
    const backgroundColorData = labelText.map((ele, index) => {
        if(colorIndex?.length){
          const filterColorIndex = colorIndex?.find((color:any)=>color?.tagName===ele)
          return ChartBackgroundColor[filterColorIndex.index]
        }
        // const random = Math.floor(Math.random() * ChartBackgroundColor.length);
        return ChartBackgroundColor[index];
    });
    
    let dataForChart = isModalPopup ? dataImageCount : dataImageCount.length <= NumberLimit.TEN ? dataImageCount : dataImageCount.slice(NumberLimit.ZERO, NumberLimit.TEN);
    labelTextFullList = [...labelText]
    labelText = labelText.length <=NumberLimit.TEN ? labelText : labelText.slice(NumberLimit.ZERO, NumberLimit.TEN)
    const data: any = {
        labels: labelText,
        datasets: [
            {
              label: '',
              data: dataImageCount,
              backgroundColor: backgroundColorData,
              borderColor: backgroundColorData,
              borderWidth: NumberLimit.ZERO,  
              hoverOffset: NumberLimit.SIX,    
              animations: {
                  animateRotate: true,
                  animateScale: true
              }
            },
        ]
    };
    const options: Object = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: NumberLimit.SIX
          }
        }
      },
      layout: {
        padding: NumberLimit.SIX
      }
    };
    const plugins: any = [{
        beforeDraw: (chart:any) => {
                chartBeforeDraw(chart,  {text: `Total Predictions`, 
                textX: NumberLimit.ONE_HUNDRED, textY: NumberLimit.ONE_FOURTY, 
                fontSize: NumberLimit.TWELVE, 
                totalImage: predictionsData?.total_predictions || NumberLimit.ZERO,
                isPie: true});
        } 
        }];

        return (
    <>
    {dataImageCount.length > NumberLimit.ZERO && <div className='checkbox-panel select-all'>
        <label>
            <input type='checkbox' checked={selectedData.length > NumberLimit.ZERO && selectedData.length === predictionsData?.predictions_per_class.length} onChange={() => selectAll()}/>
            <span className='checkbox'>Select All</span>
        </label>
      </div> }

      {!isModalPopup ? <div className={`deployment-chart ${isModalPopup ? 'deployment-chart-view':''}`}>
        <div className={`bar-char-label-main  pb10 ${isModalPopup ? 'inside':''}`}>
          {labelText.map((val: any, ind: number) => {
            const barChart= document.getElementById('barChart');
            let ht=barChart ? barChart?.style.height.replace('px','').trim() : '250' ;
            let height= parseInt(ht);          
            let oneitemHeight = !isModalPopup ? (height+20) / dataForChart.length : (height+110) / dataImageCount.length;
            let resultedData = predictionsData?.predictions_per_class.filter((ele: any) => ele.classname === val);
            return (
              <div key={`${val}-${ind}`} className={`checkbox-panel ${isModalPopup ? 'check-box-final':''}`} style={{ height: oneitemHeight}}>
              <label>
                <input type='checkbox' checked={selectedData.includes(resultedData[0].tagid)} onChange={() => getImageData(resultedData[0].tagid)}/>
                <span className='checkbox'></span>
              </label>
            </div> );
          })}
        </div>
         <BarChart 
         labelText={labelText}
         isViewMore={isModalPopup}
         backgroundColorData={backgroundColorData.length > 0 ? backgroundColorData : ChartBackgroundColor} 
         dataImageCount={dataImageCount}
         showFooter={false} />
      </div>: <ViewMorePredictionChart predictionsData={predictionsData} 
      getImageData={getImageData}
      viewMoreChart={viewMoreChart}
      selectedData={selectedData}
      selectAll={selectAll}
      dataImageCount={dataImageCount}
      labelText={labelTextFullList}
      colorIndex={colorIndex}
      />}
    </>
  );
};

export default PredictionsChart;
