import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/actions';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
    const { banner } = useSelector(state => state.app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    let bannerLength = banner?.length;
    for (let i = 0; i < bannerLength; ++i) {
        banner[i + 4] = banner[i];
    }

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
                    sliderElements[i].style.cssText = `display: block`;
                } else {
                    sliderElements[i].style.cssText = `display: none`;
                }
            }

            sliderElements[max].classList?.add('animate-slide-right', 'order-last', 'z-10');
            sliderElements[max-1].classList?.add('animate-slide-left2', 'order-2', 'z-20');
            sliderElements[min].classList?.add('animate-slide-left', 'order-first', 'z-20');

            min++;
            max++;
            if (min == 4) {
                min = 0;
                max = 2;
            }
        }, 5000);

        return () => {
            intervalId && clearInterval(intervalId);
        }
    }, [])
    
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
        <div className='flex gap-4 overflow-hidden pt-8 cursor-pointer'>
            {banner?.map( (item, index) => (
                <img src={item.banner} 
                    key={index}
                    onClick={() => handleClickBanner(item)}
                    className={`slider-item flex-1 object-contain w-[30%] rounded-lg ${ index <= 2 ? 'block' : 'hidden'}`}
                />
            ))}
        </div>
    )
}

export default Slider