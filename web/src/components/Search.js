import React, { useEffect, useRef, useState } from 'react';
import icons from '../utils/icons';
import * as apis from '../apis';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';
import { useNavigate } from 'react-router-dom';

const { GoSearch } = icons;

const Search = () => {

  const searchRef = useRef();
  const dispatch = useDispatch();
  const { nearlyListenSongs } = useSelector(state => state.music);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [songData, setSongData] = useState([]);
  const [singerData, setSingerData] = useState([]);
  const [albumData, setAlbumData] = useState([]);


  useEffect(() => {

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])
  
  const handleSearch = (e) => {
    setIsOpen(true);
    setSearchText(e.target.value);
    const search = async () => {
      const res = await apis.apiSearch(e.target.value);
      setSongData(res?.data?.data?.songs);
      setSingerData(res?.data?.data?.singers);
      setAlbumData(res?.data?.data?.albums);
    }
    search();
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      navigate(`/tim-kiem/tat-ca/${searchText}`)
    }
  }
  return (
    <div className='relative flex flex-col z-50' ref={searchRef}>
      <div className='w-full flex items-center z-10'>
        <span className='bg-main-100 rounded-l-[20px] h-10 px-4 py-2 items-center text-[#929292]'>
          <GoSearch size={24} />
        </span>
        <input type='text'
          className='w-full outline-none bg-main-100 pr-4 py-2 rounded-r-[20px] h-10 text-gray-700'
          placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát...'
          onChange={handleSearch}
          onKeyDown={handleEnter}
          value={searchText}
        />
      </div>
      {isOpen && (songData?.length > 0 || singerData?.length > 0 || albumData?.length > 0) &&
        <div className='absolute top-[20px] left-0 right-0 max-h-[590px] rounded-b-3xl
          bg-white pt-10 pb-4 px-4 shadow-lg border border-gray-200 overflow-y-auto'>
          {songData?.map((item, index) => (index < 3 &&
            <div key={index} className='flex p-2 mb-4 gap-4 hover:bg-gray-200 cursor-pointer rounded-md'
              onClick={() => {
                dispatch(actions.setCurSongId(item?.id));
                dispatch(actions.playSong(true));
                dispatch(actions.setNearlyListenSongs([...nearlyListenSongs, item]));
                dispatch(actions.getSongId(null));
              }}
            >
              <img src={item?.thumbnail} alt='thumbnail' className='w-[50px] h-[50px] rounded-md' />
              <div className='flex flex-col'>
                <span className='font-semibold text-base'>{item?.name}</span>
                <span className='text-xs text-gray-400'>Bài hát</span>
              </div>
            </div>
          ))}
          {singerData?.map((item, index) => (index < 3 &&
            <div key={index} className='flex p-2 mb-4 gap-4 hover:bg-gray-200 cursor-pointer rounded-md'
              onClick={() => {
                setIsOpen(false);
                const link = item?.name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                const newLink = `/singer/${link}/${item?.id}`;
                navigate(newLink);
              }}
            >
              <img src={item?.thumbnail} alt='thumbnail' className='w-[50px] h-[50px] rounded-full' />
              <div className='flex flex-col'>
                <span className='font-semibold text-base'>{item?.name}</span>
                <span className='text-xs text-gray-400'>Ca sĩ</span>
              </div>
            </div>
          ))}
          {albumData?.map((item, index) => (index < 3 &&
            <div key={index} className='flex p-2 mb-4 gap-4 hover:bg-gray-200 cursor-pointer rounded-md'
              onClick={() => {
                setIsOpen(false);
                const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                const newLink = '/album/'+link+'/'+item?.id;
                navigate(newLink);
              }}
            >
              <img src={item?.thumbnail} alt='thumbnail' className='w-[50px] h-[50px] rounded-md' />
              <div className='flex flex-col'>
                <span className='font-semibold text-base'>{item?.title}</span>
                <span className='text-xs text-gray-400'>Album</span>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}

export default Search