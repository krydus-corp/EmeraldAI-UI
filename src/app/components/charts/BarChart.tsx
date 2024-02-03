import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { NumberLimit } from '../../../constant/number';
import { ChartBackgroundColor } from './CommonChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface Props {
  labelText: Array<string>,
  backgroundColorData?: Array<string>,
  dataImageCount: Array<number>,
  valueText?: string,
  isViewMore?: boolean,
  showFooter?: boolean,
  height?:string
}

 
const BarChart = ({ labelText, backgroundColorData, dataImageCount, valueText, isViewMore, showFooter, height }: Props) => {
 ChartJS.defaults.font.size=NumberLimit.FOURTEEN;
 ChartJS.defaults.elements.bar.borderWidth = NumberLimit.FOUR;
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      tooltip:{
        enabled:false,
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '',
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          color: "white",
          borderColor: "black"
        },
      },
      y: {  
        barPercentage: 0.1,
        categoryPercentage: 0.3,
        display: true,
        position: 'left' as const,
        ticks: {
          autoSkip: false,
          color: "white"
        },
        grid: {
          color: "black",
          borderColor: "black"
        }
      },
      axisY2: {       
        ticks: {
          autoSkip: false,
          color: "#48fabe",
          callback: function (value: any) {
            return labelText[value];
          }
        },
        display: true,
        position: 'right' as const,
        grid: {
          borderColor: "black", 
          color:'black',
          drawOnChartArea: false,
        },
      }
    }
  };


  const data = {
    labels: (isViewMore || dataImageCount.length <= NumberLimit.TEN ) ? 
    dataImageCount : dataImageCount.slice(NumberLimit.ZERO, NumberLimit.TEN),
    datasets: [
      {
        label: '',
        data: (isViewMore || dataImageCount.length <= NumberLimit.TEN) ? 
        dataImageCount : dataImageCount.slice(NumberLimit.ZERO, NumberLimit.TEN),
        backgroundColor: (backgroundColorData && backgroundColorData.length > NumberLimit.ZERO) ? backgroundColorData : ChartBackgroundColor,
        yAxisID: 'y',
        barThickness:isViewMore ?  NumberLimit.TWINTY_FIVE : NumberLimit.EIGHTEEN
      }
    ],
  };
 
  const getHeight=()=>{
    const barChart= document.getElementById('barChart');
    let ht=barChart ? barChart?.style.height.replace('px','').trim() : '250' ;
    let height= parseInt(ht);
    if (barChart) {
    let val=dataImageCount.length > NumberLimit.TEN ?
     Math.ceil((dataImageCount.length/NumberLimit.TEN)*NumberLimit.NIGHTY):height/NumberLimit.FIVE;
      return val+'px';
    }else{
      return height + NumberLimit.ONE_HUNDRED+'px';
    }
  }

  return (
    <>
      {labelText !== undefined && <div className='bar-chat-main'>
         <Bar id='barChart' options={options} data={data} height={isViewMore ? getHeight():height?height:'140px'} /> 
        {/* <Bar id='barChart' options={options} data={data}  /> */}
      </div>}
      {showFooter === undefined && <p className="img-count">{valueText || ''}</p>}

    </>
  );
};

export default BarChart;
