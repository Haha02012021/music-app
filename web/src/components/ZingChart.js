import { React, memo, useEffect, useRef, useState } from 'react';
import icons from '../utils/icons';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import NewReleaseItem from './NewReleaseItem';
import _ from 'lodash';
import path from '../utils/path';
import { useNavigate } from 'react-router-dom';

const { TbPlayerPlayFilled } = icons;
const ZingChart = ({ chartData }) => {

    const navigate = useNavigate();
    const [data, setData] = useState({
        labels: [],
        datasets:[],
    });
    const chartRef = useRef();
    const [tooltip, setTooltip] = useState({
        opacity: 0,
        left: 0,
        top: 0,
    });
    const [selected, setSelected] = useState();
    const options = {
        margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        responsive: true,
        pointRadius: 0,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: { display: false },
                grid: { color: 'gray',  drawTicks: false, },
                min: chartData?.chart?.minScore,
                max: chartData?.chart?.maxScore,
                border: { dash: [3, 4]}
            },
            x: {
                ticks: { color: '#9A979B' },
                grid: { color: 'transparent' }
            }
        },
        plugins: {
            legend: false,
            tooltip: {
                enabled: false,
                external: (context) => {
                    if (!chartRef || !chartRef.current) return;

                    if (context.tooltip.opacity === 0) {
                        if (tooltip.opacity === 0) setTooltip(prev => ({...prev, opacity: 0}));
                        return
                    }

                    const counters = [];
                    for (let i = 0; i < 3; ++i) {
                        counters.push({
                            data: chartData
                                ?.chart
                                ?.items[Object.keys(chartData?.chart?.items)[i]]
                                ?.filter((item, index) => (index % 2 === 0))
                                .map(item => item.counter),
                            encodeId: Object.keys(chartData?.chart?.items)[i],
                        })
                    }
                    const selectedSong = counters
                        .find(item => item.data
                        .some(number => number === +context.tooltip.body[0]?.lines[0]?.replace(',', '')));
                    setSelected(selectedSong.encodeId);

                    const newTooltipData = {
                        opacity: 1, 
                        left: context.tooltip.caretX,
                        top: context.tooltip.caretY,
                    }
                    if (!_.isEqual(newTooltipData, tooltip)) setTooltip(newTooltipData);
                }
            }
        },
        hover: {
            mode: 'dataset',
            intersect: false,
        }
    }
    useEffect(() => {
        const labels = chartData?.chart?.times?.filter((item, index) => (index % 2 === 0)).map(item => item.hour + ':00');
        const datasets = [];
        if (chartData?.chart) {
            for (var i = 0; i < 3; ++i) {
                datasets.push({
                    data: chartData
                        ?.chart
                        ?.items[Object.keys(chartData?.chart?.items)[i]]
                        ?.filter((item, index) => (index % 2 === 0))
                        .map(item => item.counter),
                    borderColor: i === 0 ? '#4A90E2' : i === 1 ? '#27BD9C' : '#E35050',
                    tension: 0.2,
                    borderWidth: 2,
                    pointBackgroundColor: 'white',
                    pointHoverRadius: 6,
                    pointBorderColor:  i === 0 ? '#4A90E2' : i === 1 ? '#27BD9C' : '#E35050',
                    pointHoverBorderWidth: 3,
                })
            }
            setData({labels, datasets});
        }
    }, [chartData]);

    return (
        <div className='w-full max-h-[430px] p-4 bg-[#3F1859] rounded-xl text-white'>
            <div className='flex gap-4 justify-start items-center mb-4 cursor-pointer' onClick={() => {
                navigate(path.ZINGCHART);
            }}>
                <h3 className='text-3xl font-bold bg-gradient-to-r from-[#ff9357] via-[#9100ff] to-blue-600
                    inline-block text-transparent bg-clip-text'>
                    #zingchart
                </h3>
                <span className='bg-white rounded-full p-[6px]'>
                    <TbPlayerPlayFilled color='black' size={16} />
                </span>
            </div>
            <div className='flex h-[90%] gap-7 justify-center items-center'>
                <div className='flex-4 flex flex-col items-center gap-3'>
                    {chartData?.items?.filter((item, index) => (index < 3)).map((item, index) => (
                        <NewReleaseItem key={index} data={item} order={index + 1} 
                            percent={Math.round(item?.score * 100 / chartData?.chart?.totalScore)} 
                        />
                    ))}
                    <button className='mb-4 hover:bg-white-30 border border-white rounded-l-full rounded-r-full py-1 px-6'>Xem thêm</button>
                </div>
                <div className='flex-6 h-full relative'>
                    {chartData && <Line ref={chartRef} data={data} options={options}/>}
                    <div className='tooltip' style={{top: tooltip.top, left: tooltip.left, opacity: tooltip.opacity,
                        position: 'absolute',    
                    }}>
                        {selected && <NewReleaseItem style={'w-[250px] bg-white text-black'} data={chartData?.items?.find(item => item.encodeId === selected)}/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ZingChart)