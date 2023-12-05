import React, { useEffect, useState } from 'react';
import icons from '../utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import NewReleaseItem from './NewReleaseItem';
import * as apis from '../apis';
import * as actions from '../store/actions';
import { toast } from 'react-toastify';
import { RotateLine } from '../components';

const { AiOutlineDelete, IoIosCloseCircleOutline } = icons;

const RightSideBar = () => {

  const [recent, setRecent] = useState(true);
  const { curSongData, curPlaylistId, nearlyListenSongs } = useSelector(state => state.music);
  const [playlist, setPlaylist] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState(null);
  const [addPlaylist, setAddPlaylist] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [addItem, setAddItem] = useState({});
  const [playlistLoading, setPlaylistLoading] = useState();
  const dispatch = useDispatch();

  var reverseArray = [...nearlyListenSongs].reverse();
  const nearlySongs = [];
  reverseArray?.forEach((item) => {
    const exists = nearlySongs.some(existingItem => existingItem.id === item.id);
    if (!exists) {
      nearlySongs.push(item);
    }
    if (nearlySongs.length > 20) {
      return;
    }
  });

  const fetchPlaylistData = async () => {
    const response = await apis.apiGetDetailPlaylist(curPlaylistId);
    if (response?.data?.success === true) {
      setPlaylist(response?.data?.data?.songs);
      setPlaylistTitle(response?.data?.data?.title);
    }
  }

  useEffect(() => {
    curPlaylistId && fetchPlaylistData();
  }, [])

  useEffect(() => {
    if (curPlaylistId) fetchPlaylistData();
  }, [curPlaylistId])

  useEffect(() => {
    const fetchPlaylistData = async () => {
        setPlaylistLoading(true);
        const resPlaylist = await apis.apiGetPlaylist();
        setPlaylistLoading(false);
        setAddPlaylist(resPlaylist?.data?.data);
        console.log(resPlaylist?.data?.data);
    }
    fetchPlaylistData();
}, [isAdd])

  const handleAddPlaylist = (playlistData) => {
    const formData = new FormData();
    formData.append(`song_ids[0]`, addItem?.id);
    formData.append('id', playlistData?.id);
    const updateAlbum = async () => {
      setPlaylistLoading(true);
      const res = await apis.apiUpdateAlbum(formData);
      setPlaylistLoading(false);
      if (res?.data?.success === true) {
        console.log(res);
        setIsAdd(false);
        toast.success('Thêm vào playlist thành công');
      }
    }
    updateAlbum();
  }

  return (
    <div className='relative w-full h-screen z-50 flex flex-col text-[13px] font-medium cursor-pointer px-2 mb-36'>
      <div className='h-[70px] py-[14px] px-2 flex-none flex items-center justify-between gap-1'>
        <div className='flex flex-row bg-gray-100 rounded-r-full rounded-l-full py-1 px-2'>
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
          <span className='p-2 rounded-full bg-gray-100 text-gray-600' onClick={() => {
            if (recent) {
              dispatch(actions.setCurPlaylistId(null));
            } else {
              dispatch(actions.setNearlyListenSongs([]));
            }
          }}>
            <AiOutlineDelete title='Xóa danh sách phát' size={16} />
          </span>
        </div>
      </div>
      {recent && curPlaylistId && <div>
        <div className='flex flex-col py-4 px-2 gap-1'>
          <div className='flex flex-row gap-1 text-[15px]'>
            <span>Từ playlist </span>
            <span className='text-[#7F1FAF] cursor-pointer'>
              {playlistTitle?.length > 30 ? `${playlistTitle.slice(0, 30)}...` : playlistTitle}
            </span>
          </div>
          <div className='h-screen overflow-y-auto'>
            {playlist?.map((item, index) => (
              <NewReleaseItem key={index} data={item} time={false} sm={true} 
                setIsAdd={setIsAdd} setAddItem={setAddItem}
              />
            ))}
          </div>
        </div>
      </div>}
      {!recent &&
        <div className='flex flex-col gap-4'>
          <div>
            <NewReleaseItem data={curSongData} style={'bg-[#9431C6] text-white'} sm={true} time={false} />
          </div>
          <span>Tiếp theo</span>
          <div className='h-screen overflow-y-auto pb-40'>
            {nearlySongs?.map((item, index) => (
              <NewReleaseItem key={index} data={item} time={false} sm={true}
                setIsAdd={setIsAdd} setAddItem={setAddItem}
              />
            ))}
          </div>
        </div>}
      {isAdd && !playlistLoading &&
        <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-overlay-80'>
          <div className='w-full rounded-md p-4 border border-gray-200 shadow-lg bg-white flex flex-col'>
            <div className='flex items-center justify-between mb-7' onClick={() => setIsAdd(false)}>
              <span className='text-base font-semibold'>Thêm vào playlist</span>
              <IoIosCloseCircleOutline size={24} className='cursor-pointer' />
            </div>
            {addPlaylist?.length > 0 ? addPlaylist?.map(item => (
              <div key={item?.id} className='w-[80%] cursor-pointer mb-3' onClick={() => handleAddPlaylist(item)}>
                <span className='w-full p-2 border-t-2 border-gray-300'>{item?.title}</span>
              </div>
            )) : <div>Hiện chưa có playlist</div>}
          </div>
        </div>}
      {isAdd && playlistLoading &&
        <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center '>
          <div className='w-[30%] rounded-md p-4 border border-gray-200 shadow-lg bg-white flex justify-center items-center'>
            <RotateLine width={30} />
          </div>
        </div>}
    </div>
  )
}

export default RightSideBar