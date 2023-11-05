import React, { useEffect, useState } from 'react';
import icons from '../utils/icons';
import NewReleaseItem from './NewReleaseItem';

const { BsChevronRight } = icons;

const NewRelease = ({data}) => {

    const [type, setType] = useState(0);
    const [songData, setSongData] = useState(data?.items?.all);

    useEffect(() => {
        if (type === 0) setSongData(data?.items?.all);
        if (type === 1) setSongData(data?.items?.vPop);
        if (type === 2) setSongData(data?.items?.others);
    }, [type, data])

    return (
        <div>
            <div className='flex flex-col gap-5'>
                <h3 className='text-xl font-bold'>{data?.title}</h3>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 text-xs'>
                        <button type='button' 
                            onClick={() => setType(0)}
                            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${!type && 'bg-main-500 text-white'}`}
                        >
                            TẤT CẢ
                        </button>
                        <button type='button' 
                            onClick={() => setType(1)}
                            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type == 1 && 'bg-main-500 text-white'}`}
                        >
                            VIỆT NAM
                        </button>
                        <button type='button' 
                            onClick={() => setType(2)}
                            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type == 2 && 'bg-main-500 text-white'}`}
                        >
                            QUỐC TẾ
                        </button>
                    </div>
                    <div className='flex text-gray-500 justify-center items-center gap-2'>
                        <span className='text-xs'>TẤT CẢ</span>
                        <BsChevronRight size={16} />
                    </div>
                </div>
                <div className='flex flex-wrap w-full'>
                    {songData?.filter((item, index) => index < 12).map((item, index) => (
                        <NewReleaseItem key={item.encodeId} data={item} id={index} />
                    ))}
                </div>
            </div>
        </div>
  )
}

export default NewRelease