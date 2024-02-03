import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { chartBeforeDraw } from './CommonChart';
import { NumberLimit } from '../../../constant/number';
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  imageCount?: number,
  chartData?: {    
    split?: {
      test?: number;
      train?: number;
      validation?: number
    }
  },
}

const DatasetSplitChart = ({ chartData, imageCount }: Props) => {
    const totalImage  = imageCount || NumberLimit.ZERO;
    const trainValue = chartData?.split?.train ? 
    chartData?.split?.train * NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;
    // hiding test value in pie chart as per discussion on 18/01/2023
    // const testValue = chartData?.split?.test ? 
    // chartData?.split?.test * NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;
    const validValue = chartData?.split?.validation ? 
    chartData?.split?.validation * NumberLimit.ONE_HUNDRED : NumberLimit.ZERO;    
    const data: any = {
        labels: ['Train %', 'Valid %'],
        datasets: [
          {
            label: '',
            data: [trainValue, validValue],
            backgroundColor: [
              '#48fabe',
              '#ffda56',
              '#6fb8f8'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: NumberLimit.ZERO,  
            hoverOffset: NumberLimit.FOUR,    
            animations: {
              animateRotate: true,
              animateScale: true
            },
            
          },
        ]
      };
      const plugins: any = [{
        beforeDraw: (chart:any) => {
              var width = chart.width
              const ctx = chart.ctx
              ctx.textBaseline = "middle";
              ctx.textAlign = "left"
              var text = "Total Images",
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = NumberLimit.ONE_HUNDRED;
              ctx.fillStyle ="#ffffff"
              ctx.font = 
              "11.3px \"Helvetica Neue\", Helvetica, Arial, sans-serif"
              ctx.fillText(text, textX, textY);
              ctx.restore()

              ctx.textBaseline = "middle";
              ctx.textAlign = "left"
              var text = totalImage.toString(),
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = 115;
              ctx.fillText(text, textX, textY);
            //  chartBeforeDraw(chart, {text: `Total Images`, 
            //   textX:90,
            //   textY:NumberLimit.ONE_HUNDRED, fontSize: NumberLimit.ELEVEN_THREE, totalImage:7865446  , isPie: false });
              
        }, 
      }];
      const options: Object = {
        events: ["mousemove", "mouseout"],
        responsive: true,
        plugins: {
          legend: {
            onClick: (e: any) => e.stopPropagation(),
            display: true,
            position: 'bottom',
            labels: {
              color: "white",
              usePointStyle: true,
              boxWidth: NumberLimit.TEN,
              boxHeight: NumberLimit.EIGHT,
              padding: 20,
            }
          }
        },
        layout: {
          paddingTop: NumberLimit.SIX
        }
      };

    return (
      <>
        <div className='ui-split-chart'>
            <Doughnut options={options} data={data} plugins={plugins} redraw />
        </div>
      </>
    );
  };
  
  export default React.memo(DatasetSplitChart);
