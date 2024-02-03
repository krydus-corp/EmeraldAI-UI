import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartBeforeDraw } from './CommonChart';
import { NumberLimit } from '../../../constant/number';

ChartJS.register(ArcElement, Tooltip, Legend);
interface Props {
    labelText: Array<string>,
    backgroundColorData: Array<string>,
    statsData: {total_annotations: number},
    dataImageCount: Array<number>
}
const PieChart = ({ labelText, backgroundColorData, statsData, dataImageCount }: Props) => {
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
                chartBeforeDraw(chart,  {text: `Total Annotation`, 
                textX: NumberLimit.ONE_HUNDRED, textY: NumberLimit.ONE_FOURTY, 
                fontSize: NumberLimit.TWELVE, 
                totalImage: statsData?.total_annotations || NumberLimit.ZERO,
                isPie: true});
        } 
        }];

  const getBackgroundColorValue = (ind: number) => {
    return backgroundColorData && backgroundColorData[ind] ? backgroundColorData[ind] : '';
  };

  return (
    <>
      <div className="bar-char-label-main pb10">
          {labelText?.map((val, ind) => {
            return (<div className="value-box" key={`bar-label-${ind}`}>
              <div style={{ background: getBackgroundColorValue(ind) }} className="dot"></div> <span>{val}</span></div>);
          })}
      </div>
      <div className='ui-pi-chart-js'>
            <Doughnut options={options} data={data} plugins={plugins} />
      </div>
    </>
  );
};

export default PieChart;
