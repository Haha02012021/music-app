import { React, memo, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import * as actions from '../store/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import icons from '../utils/icons';
import * as apis from '../apis';

const { AiOutlineHeart, AiFillHeart } = icons;
const NewReleaseItem = ({data, order, percent, style, sm, time}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const [liked, setLiked] = useState(data?.is_liked);
    
    //console.log(data);
    const handleLikeSong = (e) => {
        e.stopPropagation();
        const likeSong = async() => {
            const res = await apis.apiLikeSong(data?.id, 2);
            setLiked(prev => !prev)
            console.log(res)
        }
        likeSong();
    }
    
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className={`flex-auto flex justify-between items-center p-[10px] rounded-md
            ${style ? style : 'hover:bg-white-30 w-full'}`
        }>
        <div className='flex justify-start gap-[10px]'>
            { order && <span className={`text-[#3F1859] text-[32px] font-bold 
                ${order === 1 ? 'text-shadow-no1' : order === 2 ? 'text-shadow-no2' : 'text-shadow-no3'}`
            }>
                {order}
            </span> }
            <img src={data.thumbnail} alt='thumbnail'
                className={`${sm  ? 'w-[40px] h-[40px]' : 'w-[60px] h-[60px]'} rounded-sm cursor-pointer `}
                onClick={() => {
                    dispatch(actions.setCurSongId(data?.id));
                    dispatch(actions.playSong(true));
                    dispatch(actions.getSongId(null));
                }}
            />
            <div className='flex flex-col'>
                <span className='text-md font-semibold'>
                    {data?.name?.length > 23 ? `${data?.name?.slice(0, 23)}...` : data?.name}
                </span>
                <span className={`cursor-pointer text-xs hover:text-[#9431C6] ${sm ? 'text-gray-300' : 'text-gray-500'}`}
                    onClick={() => {
                        const link = data?.singers?.[0]?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                        navigate(`singer/${link}/${data?.singers?.[0]?.pivot?.singer_id}`)
                    }}
                >
                    {data?.singers[0]?.name}
                </span>
                { !order && time && <span className='text-xs text-gray-500'>
                    {moment(data?.released_at).fromNow()}
                    </span>
                }
            </div>
        </div>
        {hover && <span className='mr-5 text-gray-600 cursor-pointer' onClick={handleLikeSong}> 
            {liked ? <AiFillHeart title='Xóa khỏi thư viện' size={16} /> : <AiOutlineHeart title='Thêm vào thư viện' size={16} /> }
        </span>}
        { percent && <span className='text-lg font-bold'>
            {percent}%
        </span> }
    </div>
  )
}

export default memo(NewReleaseItem)