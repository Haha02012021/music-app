import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as apis from '../../apis';
import icons from '../../utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import { ListItem, HomeSectionItem, TriangleLoading } from '../../components';

const { TbUserPlus, FaCheck } = icons;

const Singer = () => {
  const { sid } = useParams();
  const [data, setData] = useState([]);
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  const { songs } = useSelector(state => state.music);
  const navigate = useNavigate();
  const { token } = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await apis.apiGetSingerById(sid);
      setLoading(false);
      setData(response?.data?.data);
      console.log(response?.data?.data)
      if (response?.data?.data) {
        dispatch(actions.setSong(response?.data?.data?.songs_slice));
        setFollow(response?.data?.data?.is_followed)
      }
    }
    fetchData();
  }, [])

  const followSinger = async () => {
    const response = await apis.apiFollowSinger(sid);
    console.log(response)
  }

  const handleFollowSinger = () => {
    followSinger();
    setFollow(prev => !prev);
  }
  return (
    <div className='relative'>
      {loading && <div className='absolute top-0 bottom-0 left-0 right-0 z-10 bg-white over'>
        <div className='ml-[500px] mt-[200px]'>
          <TriangleLoading />
        </div>
      </div>}
      <div className='flex flex-col mb-36'>
        <div className='relative w-full h-[300px] bg-[#F1E6E1] bg-opacity-50 rounded-3xl mb-10'>
          <div className='absolute bottom-6 left-5 flex gap-7 justify-center items-center'>
            <img src={data?.thumbnail} alt='avatar' className='w-[140px] h-[140px] rounded-full border-black' />
            <div className='flex flex-col gap-5 items-start justify-start'>
              <span className='text-5xl font-bold'>{data?.name}</span>
              <div className='flex justify-center items-center gap-4'>
                <span>{data?.followers_count} người quan tâm</span>
                {!follow ?
                  <span onClick={handleFollowSinger}
                    className={`flex gap-3 justify-center items-center py-1 px-6 rounded-l-full rounded-r-full 
                    border-[1px] border-gray-300 ${token && 'cursor-pointer'}`}
                  >
                    <TbUserPlus size={16} />
                    <span className='text-xs font-normal'>QUAN TÂM</span>
                  </span>
                  : <span onClick={handleFollowSinger}
                    className={`flex gap-3 justify-center items-center py-1 px-6 rounded-l-full rounded-r-full 
                      border-[1px] border-gray-300 ${token && 'cursor-pointer'}`}
                  >
                    <FaCheck size={16} />
                    <span className='text-xs font-normal'>ĐÃ QUAN TÂM</span>
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='mb-10'>
          <span className='text-xl font-bold'>{data?.name} - Tất cả bài hát</span>
          <div className='mt-5'>
            {songs?.map(item => (
              <ListItem key={item.id} songData={item} />
            ))}

          </div>
        </div>
        <div className='mb-10'>
          <span className='text-xl font-bold'>Tuyển tập</span>
          <div className='mt-5 w-full flex flex-wrap gap-7'>
            {data?.albums_slice ? data?.albums_slice?.map(item => (
              <div key={item.id}
                className='w-1/5 flex flex-col gap-2 items-center justify-center cursor-pointer'
                onClick={() => {
                  const link = item.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                  const newLink = `/album/${link}/${item?.id}`
                  navigate(newLink, { replace: true })
                }}
              >
                <HomeSectionItem thumbnail={item.thumbnail} />
                <span className='text-gray-800 text-base font-semibold'>
                  {item?.title?.length > 30 ? `${item?.title?.slice(0, 30)}...` : item?.title}
                </span>

              </div>
            )) : <span>Hiện chưa có album</span>}
          </div>
        </div>
        <div className='w-full'>
          <span className='text-xl font-bold'>Về {data?.name}</span>
          <div className='flex gap-7 w-full mt-5'>
            <span className='w-1/3'>
              <img className='w-[90%] rounded-2xl' alt='thumbnail' src={data?.thumbnail} />
            </span>
            <div className='flex flex-col justify-between text-gray-500'>
              <div className='h-[80%] flex items-center'>
                <span className='w-3/7'>{data?.bio ? data?.bio : 'Hiện tại chưa có thông tin ca sĩ'}</span>
              </div>
              <div className='h-[20%] justify-center flex flex-col'>
                <span className='text-black text-xl font-semibold'>{data?.followers_count ? data?.followers_count : '0'}</span>
                <span className='text-sm'>Người quan tâm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Singer