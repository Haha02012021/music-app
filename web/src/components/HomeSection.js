import { React, memo, useState } from 'react';
import icons from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import HomeSectionItem from './HomeSectionItem';

const { BsChevronRight } = icons;

const HomeSection = ({id, data}) => {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-bold'>{data?.title}</h3>
                <div className='flex text-gray-500 justify-center items-center gap-2'>
                    <span className='text-xs'>TẤT CẢ</span>
                    <BsChevronRight size={16} />
                </div>
            </div>
            <div className='flex gap-7 justify-between items-start '>
                {data?.items?.filter((item, index) => index < 5).map(item => (
                    <div key={item.encodeId}
                        className='w-1/5 flex flex-col gap-2 items-center justify-center cursor-pointer'
                        onClick={() => {
                            navigate(item?.link?.split('.')[0]);
                        }}
                    >
                        <HomeSectionItem thumbnail={item.thumbnail}/>
                        { id < 7 ?
                            <span className='text-gray-400 text-sm'>
                                {item.sortDescription.length > 50 ? `${item.sortDescription.slice(0, 50)}...` : item.sortDescription}
                            </span>
                            : 
                            <span className='text-gray-400 text-sm'>
                                {item.artistsNames.length > 50 ? `${item.artistsNames.slice(0, 50)}...` : item.artistsNames}
                            </span>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(HomeSection);