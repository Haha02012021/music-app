import React, { useEffect, useState } from 'react';
import icons from '../utils/icons';
import { useSelector } from 'react-redux';
import NewReleaseItem from './NewReleaseItem';
import * as apis from '../apis';

const { TfiAlarmClock, AiOutlineDelete } = icons;

const RightSideBar = () => {

  const [recent, setRecent] = useState(true);
  const { curSongData, curPlaylistId } = useSelector(state => state.music);
  const [playlist, setPlaylist] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState(null);

  const fetchPlaylistData = async () => {
    const response = await apis.apiGetDetailPlaylist(curPlaylistId);
    if (response?.data?.err === 0) {
      setPlaylist(response?.data?.data?.song?.items);
      setPlaylistTitle(response?.data?.data?.title);
    }
  }

  useEffect(() => {
    curPlaylistId && fetchPlaylistData();
  }, [])
  
  useEffect(() => {
    if (curPlaylistId) fetchPlaylistData();
  }, [curPlaylistId])
  console.log(playlist);

  return (
    <div className='w-full flex flex-col text-[13px] font-medium cursor-pointer px-2 mb-36'>
      <div className='h-[70px] py-[14px] px-2 flex-none flex items-center justify-between gap-1'>
        <div className='flex flex-row bg-gray-100 rounded-r-full rounded-l-full py-1 px-1'>
          <span className={`${recent && 'bg-white text-[#7F1FAF]'} rounded-r-full rounded-l-full py-1 px-2`}
            onClick={() => setRecent(true)}
          >
            Danh sách phát
          </span>
          <span className={`${!recent && 'bg-white text-[#7F1FAF]'} py-1 px-2 rounded-r-full rounded-l-full`}
            onClick={() => setRecent(false)}
          >
            Nghe gần đây
          </span>
        </div>
        <div className='flex flex-row gap-2'>
          <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
            <TfiAlarmClock title='Bộ hẹn giờ dừng phát nhạc' size={16} /> 
          </span>
          <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
            <AiOutlineDelete title='Xóa danh sách phát' size={16} />
          </span>
        </div>
      </div>
      <div>
        <div>
          <NewReleaseItem data={curSongData} style='bg-[#9431C6] text-white' sm={true} time={false} />
        </div>
        <div className='flex flex-col py-4 px-2 gap-1'>
          <span className='text-base font-bold'>Tiếp theo</span>
          <div className='flex flex-row gap-1 text-[15px]'>
            <span>Từ playlist </span>
            <span className='text-[#7F1FAF] cursor-pointer'>
              {playlistTitle?.length > 30 ? `${playlistTitle.slice(0, 30)}...` : playlistTitle}
            </span>
          </div>
          <div className='h-screen overflow-y-auto'>
            {playlist?.map((item, index) => (
              <NewReleaseItem key={index} data={item} time={false} sm={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSideBar