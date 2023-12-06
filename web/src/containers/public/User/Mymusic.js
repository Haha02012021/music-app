import React, { useEffect, useState } from 'react';
import icons from '../../../utils/icons';
import * as apis from '../../../apis';
import * as actions from '../../../store/actions';
import { AudioUpload, HomeSectionItem, ListItem, ProgressBarLoading, TriangleLoading } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { 
  BsPlusLg
} = icons;

const Mymusic = () => {

  const {info} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [addLoad, setAddLoad] = useState();
  const [addSongLoad, setAddSongLoad] = useState();
  const [data, setData] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);
  const [uploadedSongData, setUploadedSongData] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [type, setType] = useState(1);
  const [isCreate, setIsCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getLiked = async () => {
      setLoading(true);
      const res = await apis.apiGetLikedAlbums();
      if (res?.data?.success === false) {
        toast.warn(res?.data?.message);
        dispatch(actions.getLogin(false))
      }
      const res2 = await apis.apiGetLikedSongs();
      if (res2?.data?.success === false) {
        //toast.warn(res2?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setLikedSongData(res2?.data?.data);
      }
      const res3 = await apis.apiGetPlaylist();
      if (res3?.data?.success === false) {
        //toast.warn(res3?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setData([...res3?.data?.data, ...res?.data?.data]);
      }
      const res4 = await apis.apiGetUploadedSongs();
      setLoading(false);
      if (res4?.data?.success === false) {
        //toast.warn(res4?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setUploadedSongData(res4?.data?.data);
      }
  }
  getLiked();
  }, []);

  useEffect(() => {
    const getPlaylist = async () => {
      const res = await apis.apiGetLikedAlbums();
      if (res?.data?.success === false) {
        //toast.warn(res?.data?.message);
        dispatch(actions.getLogin(false))
      }
      const res3 = await apis.apiGetPlaylist();
      if (res3?.data?.success === false) {
        //toast.warn(res3?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setData([...res3?.data?.data, ...res?.data?.data]);
      }
      setAddLoad(false);
    }
    getPlaylist();
  }, [addLoad]);

  useEffect(() => {
    const addSong = async () => {
      const res2 = await apis.apiGetLikedSongs();
      if (res2?.data?.success === false) {
        //toast.warn(res2?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setLikedSongData(res2?.data?.data);
      }
      const res4 = await apis.apiGetUploadedSongs();
      setAddSongLoad(false);
      if (res4?.data?.success === false) {
        //toast.warn(res4?.data?.message);
        dispatch(actions.getLogin(false))
      } else {
        setUploadedSongData(res4?.data?.data);
      }
    }

    addSong();
  }, [addSongLoad])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoad(true);
    const res = await apis.apiCreatePlaylist(formData?.name);
    setIsOpenPopup(false);
  }

  return (
    <div className='relative mb-36 w-full'>
      {loading && <div className='absolute top-0 bottom-0 left-0 right-0 z-10 bg-white over'>
        <div className='ml-[500px] mt-[200px]'>
          <TriangleLoading />
        </div>
      </div>}
      {!loading && <div className='w-full flex flex-col gap-7 mb-36'>
        <span className='text-[40px] font-bold'>Thư viện</span>
        <div className='relative w-full flex flex-col gap-4'>
          {addLoad && <div className='absolute top-0 bottom-0 right-0 left-0 z-10 flex justify-center items-center bg-gray-200 rounded-md'>
            <ProgressBarLoading />
          </div>}
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
            {data?.map((item, index) => (
              <div key={index} className='w-[18%] flex flex-col gap-2 cursor-pointer'
                onClick={() => {
                  const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                  const newLink = (info.id === item?.account_id ? '/playlist/' : '/album/') +link+'/'+item?.id;
                  navigate(newLink, { state: { isPlaylist: true }});
                }}
              >
                <HomeSectionItem thumbnail={item?.thumbnail} setAddLoad={setAddLoad} myMusic={true}
                  item_id={item?.id} isPlaylist={info.id === item?.account_id} />
                <span className='text-base font-medium'>{item?.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='relative w-full flex flex-col gap-4'>
          <span className='text-xl font-bold'>Bài hát</span>
          {addSongLoad && <div className='absolute top-0 bottom-0 right-0 left-0 z-10 flex justify-center items-center bg-gray-200 rounded-md'>
            <ProgressBarLoading />
          </div>}
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
              <ListItem songData={item} is_liked={true} myMusic={true} setAddSongLoad={setAddSongLoad} isUploaded={false} />
            </div>
          ))}
          </div>}
          {type === 0 && <div className='w-full flex flex-col gap-7'>
            <span className='cursor-pointer mt-4' onClick={() => setIsCreate(prev => !prev)} ><BsPlusLg className='p-1 rounded-full bg-gray-200' size={24} /></span>
            {isCreate === true && <AudioUpload setIsCreate={setIsCreate} setAddSongLoad={setAddSongLoad} />}
            {uploadedSongData?.map(item => (
              <div key={item?.id}>
                <ListItem songData={item} is_liked={true} myMusic={true} setAddSongLoad={setAddSongLoad}  isUploaded={true}/>
              </div>
            ))}
          </div>
          }
        </div>
      </div>}
    </div>
  )
}

export default Mymusic