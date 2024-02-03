import { green } from '@mui/material/colors';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { NumberLimit } from '../../../constant/number';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
    dimensions: Array<{width: number, height: number}>,
}

const DimensionChart = ({ dimensions }: Props) => {

    const [dataArray, setDataArray] = useState([]);
    const [lineArray, setLineArray] = useState([]);
    const [data,setData] = useState<any>({})

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        let maxValue = NumberLimit.ZERO;
        const dataArr: any = dimensions?.length ? dimensions.map((obj:{width: number, height: number}) => {
            if (maxValue < obj.width) {
                maxValue = obj.width;
            }
            if (maxValue < obj.height) {
                maxValue = obj.height;
            }
            return {
                x: obj.width,
                y: obj.height
            };
        }) : [];
        setDataArray(dataArr);
        const midLineArr: any = [];
        for(let j = NumberLimit.ZERO; j <= maxValue; j += NumberLimit.FIFTY) {
            midLineArr.push({
                x: j,
                y: j
            });
        }
        setLineArray(midLineArr);
        const data = {
            datasets: [{
                    label: '',
                    data: dataArr,
                    backgroundColor: 'rgba(255, 99, 132, 1)'
                },
                {
                    label: '',
                    data: midLineArr,
                    borderColor: '#fff',
                    borderWidth: NumberLimit.ONE,
                    pointRadius: NumberLimit.ZERO,
                    pointHoverRadius: NumberLimit.ONE,
                    fill: false,
                    tension: NumberLimit.ZERO,
                    showLine: true,
                    backgroundColor: 'rgba(255, 99, 132, 1)'
                }
            ],
        };
        setData(data)
    }, [dimensions]);    
    
    return <div className='chart-box mb25 mt25 dimension-chart'>
         <span className='top-left'>Tall</span>
         <span className='top-right'>Square</span>
         <span className='bottom-right'>Wide</span>
         {Object.keys(data)?.length > 0 ? <Scatter options={options} data={data} />: <div className="enpoint-loader chart-loader"><div className='loader-inline chart-inline'><div className='loader-inner'></div></div></div>}
    </div>;
};  
export default DimensionChart;
