import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as apis from '../../apis';
import icons from '../../utils/icons';

const { TbUserPlus } = icons;

const Singer = () => {
    const { sid } = useParams();
    const [data, setData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        const response = await apis.apiGetSingerById(sid);
        setData(response?.data?.data);
        console.log(response?.data?.data)
      }
      fetchData();
    }, [])
  return (
    <div className='flex flex-col'>
      <div className='relative w-full h-[300px] bg-[#F1E6E1] bg-opacity-50 rounded-3xl mb-5'>
        <div className='absolute bottom-6 left-5 flex gap-7'>
          <img src={data?.thumbnail} alt='avatar' className='w-[140px] h-[140px] rounded-full border-black' />
          <div className='flex flex-col gap-7'>
            <span className='text-5xl font-bold'>{data?.name}</span>
            <div className='flex justify-center items-center gap-4'>
              <span>{data?.followers_count} người quan tâm</span>
              <span className='flex gap-3 justify-center items-center py-1 px-6 rounded-l-full rounded-r-full border-[1px] border-gray-300'>
                <TbUserPlus size={16} />
                <span className='text-xs font-normal'>QUAN TÂM</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>Bài hát</div>
      <div>Album</div>
      <div>Bio</div>
    </div>
  )
}

export default Singer