import React, { useEffect, useState } from 'react';
import icons from '../../utils/icons';
import * as apis from '../../apis';
import { AudioUpload, HomeSectionItem, ListItem } from '../../components';
import { useNavigate } from 'react-router-dom';

const { 
  BsPlusLg
} = icons;

const Mymusic = () => {

  const [data, setData] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [type, setType] = useState(1);
  const [isCreate, setIsCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getLiked = async () => {
      const res = await apis.apiGetLikedAlbums();
      //setData(res?.data?.data);
      const res2 = await apis.apiGetLikedSongs();
      setLikedSongData(res2?.data?.data);
      const res3 = await apis.apiGetPlaylist();
      console.log(res3?.data?.data);
      setData([...res3?.data?.data, ...res?.data?.data]);
  }
  getLiked();
  }, []);
  console.log(data);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apis.apiCreatePlaylist(formData?.name);
    console.log(res);
  }

  return (
    <div className='w-full flex flex-col gap-7 mb-36'>
      <span className='text-[40px] font-bold'>Thư viện</span>
      <div className='w-full flex flex-col gap-4'>
        <div className='flex justify-start items-center gap-4'>
          <span className='text-xl font-bold'>PLAYLIST</span>
          <span className='p-1 rounded-full bg-gray-200 cursor-pointer' onClick={() => setIsOpenPopup(true)}><BsPlusLg /></span>
        </div>
        {isOpenPopup && <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className='text-xl font-semibold'>Tên Playlist:</label>
            <input type="text" id="name" name="name" onChange={handleInputChange} 
              className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
            />          
            <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
          </form>
        </div>}
        <div className='w-full flex flex-wrap gap-7'>
          {data?.map(item => (
            <div key={item?.id} className='w-[18%] flex flex-col gap-2 cursor-pointer'
              onClick={() => {
                const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                const newLink = '/album/'+link+'/'+item?.id;
                navigate(newLink);
              }}
            >
              <HomeSectionItem thumbnail={item?.thumbnail} is_liked={true} item_id={item?.id}/>
              <span className='text-base font-medium'>{item?.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <span className='text-xl font-bold'>Bài hát</span>
        <div className='flex gap-4'>
          <button type='button' 
            onClick={() => setType(1)}
            className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 1 && 'bg-main-500 text-white'}`}
          >
              Yêu thích
          </button>
          <button type='button' 
              onClick={() => setType(0)}
              className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 0 && 'bg-main-500 text-white'}`}
          >
              Đã tải lên
          </button>
        </div>
        {type === 1 && <div>{likedSongData?.map(item => (
          <div key={item?.id}>
            <ListItem songData={item} is_liked={true} />
          </div>
        ))}
        </div>}
        {type === 0 && <div className='w-full'>
          <span className='cursor-pointer' onClick={() => setIsCreate(prev => !prev)} ><BsPlusLg className='p-1 rounded-full bg-gray-200' size={24} /></span>
          {isCreate === true && <AudioUpload />}
        </div>
        }
      </div>
    </div>
  )
}

export default Mymusic