import React, { useEffect, useState } from 'react';
import icons from '../../utils/icons';
import * as apis from '../../apis';
import { HomeSectionItem, ListItem } from '../../components';

const { 
  BsPlusLg
} = icons;

const Mymusic = () => {

  const [data, setData] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const getLiked = async () => {
      const res = await apis.apiGetLikedAlbums();
      setData(res?.data?.data);
      const res2 = await apis.apiGetLikedSongs();
      setLikedSongData(res2?.data?.data);
  }
  getLiked();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = () => {
    const creatForm = async () => {
      const res = await apis.apiCreatePlaylist(formData?.name);
      console.log(res);
    }
    console.log(creatForm);
  }


  return (
    <div className='w-full flex flex-col gap-7 mb-36'>
      <span className='text-[40px] font-bold'>Thư viện</span>
      <div className='w-full flex flex-col gap-4'>
        <div className='flex justify-start items-center gap-4'>
          <span className='text-xl font-bold'>PLAYLIST</span>
          <span className='p-1 rounded-full bg-gray-200' onClick={() => setIsOpenPopup(true)}><BsPlusLg /></span>
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
            <div key={item?.id} className='w-[18%] flex flex-col gap-2'>
              <HomeSectionItem thumbnail={item?.thumbnail} is_liked={true} item_id={item?.id}/>
              <span className='text-base font-medium'>{item?.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <span className='text-xl font-bold'>Bài hát</span>
        <div>{likedSongData?.map(item => (
          <div key={item?.id}>
            <ListItem songData={item}/>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default Mymusic