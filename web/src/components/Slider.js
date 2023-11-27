import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/actions';
import { useNavigate } from 'react-router-dom';
import icons from '../utils/icons';
import path from '../utils/path';

const { BsChevronRight } = icons; 

const Slider = ({banner}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {

        const sliderElements = document.getElementsByClassName('slider-item');
        let min = 0;
        let max = 2;

        const intervalId = setInterval(() => {
            for (let i = 0; i < sliderElements.length; ++i) {
                sliderElements[i]?.classList?.remove('animate-slide-right', 'order-last', 'z-10');
                sliderElements[i]?.classList?.remove('animate-slide-left2', 'order-2', 'z-20');
                sliderElements[i]?.classList?.remove('animate-slide-left', 'order-first', 'z-20');

                if ((i >= min && i <= max)) {
                    sliderElements[i].style.cssText = `display: flex`;
                } else {
                    sliderElements[i].style.cssText = `display: none`;
                }
            }

            sliderElements[max]?.classList?.add('animate-slide-right', 'order-last', 'z-10');
            sliderElements[max-1]?.classList?.add('animate-slide-left2', 'order-2', 'z-20');
            sliderElements[min]?.classList?.add('animate-slide-left', 'order-first', 'z-20');

            min++;
            max++;
            if (min === 8) {
                min = 0;
                max = 2;
            }
        }, 5000);

        return () => {
            intervalId && clearInterval(intervalId);
        }
    }, [banner])

    //console.log(banner);
    
    const handleClickBanner = (item) => {
        if(item?.type === 1) {
            dispatch(actions.setCurSongId(item.encodeId));
            dispatch(actions.playSong(true));
            dispatch(actions.getSongId(null));
        } else if (item?.type === 4) {
            const playlistPath = item?.link?.split('.')[0];
            navigate(playlistPath);
        }
    }

    return (
        <div>
            <div className='flex flex-row justify-between items-center'>
                <span className='text-xl font-bold'>BXH Nhạc Mới</span>
                <div className='flex gap-2 text-gray-500 justify-center items-center cursor-pointer'
                    onClick={() => navigate(path.NEWRELEASECHART)}
                >
                    <span className='text-xs'>TẤT CẢ</span>
                    <span><BsChevronRight size={16}/></span>
                </div>
            </div>
            <div className='w-full h-[200px] gap-4 flex item-center overflow-hidden pt-4 cursor-pointer'>
                {banner?.map( (item, index) => (
                    <div key={index} className={`slider-item h-[150px] w-[32%] rounded-lg ${ index <= 2 ? 'flex' : 'hidden'}
                        bg-white shadow-md p-4`}>
                        <div className='w-[118px] h-[118px] rounded-lg mr-2'>
                            <img src={item?.thumbnail} 
                                className='w-[118px] h-[118px] rounded-lg'
                            />
                        </div>
                        <div className='flex-auto flex flex-col justify-between'>
                            <div className='flex flex-col'>
                                <span className='text-base font-medium'>{item?.name}</span>
                                <span className='text-xs text-gray-400'>
                                    {item?.singers?.map(item => item.name + ' ')}
                                </span>
                            </div>
                            <div className='flex flex-row justify-between items-end'>
                                <span className='text-[40px] text-shadow-no5 text-white'>{index < 8 ? '#' + (index + 1) : '#' + (index - 7)}</span>
                                <span className='text-sm text-gray-500'>{item?.released_at?.replaceAll('-', '.')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Slider