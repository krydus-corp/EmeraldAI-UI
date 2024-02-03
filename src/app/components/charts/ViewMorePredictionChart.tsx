
import { ChartBackgroundColor } from './CommonChart';
interface Props {
    predictionsData: {total_predictions: number, predictions_per_class: any},
    getImageData: Function,
    viewMoreChart?: Function,
    isModalPopup?: boolean,
    selectedData: any,
    selectAll: Function,
    dataImageCount:any,
    labelText:any,
    colorIndex?:any
}
const ViewMorePredictionChart = ({ predictionsData,colorIndex, getImageData, viewMoreChart, isModalPopup, selectedData, selectAll,dataImageCount,labelText }: Props) => {   
    const max = Math.max(...dataImageCount);
    const getPercentage=(val:number)=>Math.ceil((val/max)*100);
    return (
        <>
          {/* Start for css chart */}
          <div className="deployment-chart-wrapper">
          {labelText?.map((value:any, ind:number) => {  
            let resultedData = predictionsData?.predictions_per_class.filter((ele: any) => ele.classname === value);
            const filterColorIndex = colorIndex?.find((color:any)=>color?.tagName===value)   
            let background = colorIndex?.length? ChartBackgroundColor[filterColorIndex?.index] : ChartBackgroundColor[ind] 
          return (
            <div className="deployment-chart-new" key={ind}>
            <div className='deployment-first-sec'>
              <div className='checkbox-panel'>
                <label><input type="checkbox" checked={selectedData.includes(resultedData[0].tagid)} onChange={() => getImageData(resultedData[0].tagid)} /><span className="checkbox"></span></label>
              </div>
            </div>
            <div className='deployment-second-sec'>{dataImageCount[ind]}</div>
            <div className='deployment-third-sec'>
              <div className="progress-bar horizontal">
                <div className="progress-track">
                  <div className="progress-fill" style={{background:background, width: `${getPercentage(parseInt(dataImageCount[ind]))}%`}}>
                    <span></span>
                  </div>
                </div>
              </div>
              <span></span>
            </div>
            <div className='deployment-four-sec'><span>{value}</span></div>
          </div>   
          )      
          })}
          </div>
           
        </>
      );
}

export default ViewMorePredictionChart;