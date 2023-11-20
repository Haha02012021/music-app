import React, { useEffect, useState } from 'react';
import icons from '../utils/icons';
import NewReleaseItem from './NewReleaseItem';
import * as apis from '../apis';

const { BsChevronRight } = icons;

const NewRelease = () => {

    const [type, setType] = useState(1);
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.getNewRelease(type);
            setSongData(response?.data?.data);
        }
        fetchData();
    }, [type]);

    return (
        <div>
            <div className='flex flex-col gap-5'>
                <h3 className='text-xl font-bold'>Mới phát hành</h3>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 text-xs'>
                        <button type='button' 
                            onClick={() => setType(1)}
                            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 1 && 'bg-main-500 text-white'}`}
                        >
                            VIỆT NAM
                        </button>
                        <button type='button' 
                            onClick={() => setType(0)}
                            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 0 && 'bg-main-500 text-white'}`}
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
                    {songData?.filter((item, index) => index < 12)?.map((item) => (
                        <div key={item.id}  className='w-[300px] min-[1024px]:w-[30%]'>
                            <NewReleaseItem data={item} time={true} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default NewRelease