import { React, memo, useState } from 'react';
import icons from '../utils/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/actions';
import * as apis from '../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const { PiMusicNotesSimpleLight, IoRemoveOutline, AiOutlineHeart, AiFillHeart, BsPlusLg,
    IoIosCloseCircleOutline, AiOutlineDelete
} = icons;

const ListItem = ({ songData, index, release, is_liked, setIsAdd, 
    setAddItem, myMusic, setAddSongLoad, isUploaded, isPlaylist, setDeleteItem
}) => {

    const dispatch = useDispatch();
    const [hover, setHover] = useState(false);
    const [liked, setLiked] = useState(is_liked);
    const { nearlyListenSongs } = useSelector(state => state.music);
    const { login } = useSelector(state => state.user);
    const navigate = useNavigate();
    //console.log(songData);

    const likeSong = async () => {
        if (myMusic) setAddSongLoad(true);
        const res = await apis.apiLikeSong(songData?.id, 2);
        if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            setLiked(prev => !prev)
        }
    }

    const handleDelete = (e) => {
        const deleteModel = async () => {
        if (myMusic) setAddSongLoad(true);
          const res = await apis.apiDelete('song', songData?.id);
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
          }
        }
        deleteModel();
      }

    const handleLikeSong = (e) => {
        e.stopPropagation();
        if (!isUploaded) {
            likeSong();
        }
        else {
            handleDelete();
        }
    }

    return (
        <div className='flex justify-between items-center p-[10px] border-t border-gray-300 hover:bg-gray-100 cursor-pointer'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => {
                dispatch(actions.setCurSongId(songData?.id));
                dispatch(actions.playSong(true));
                dispatch(actions.setNearlyListenSongs([...nearlyListenSongs, songData]));
                dispatch(actions.getSongId(index));
            }}
        >
            <div className='flex flex-1 justify-start items-center gap-2'>
                {!release && <PiMusicNotesSimpleLight size={14} />}
                {release &&
                    <div className='flex justify-center items-center mr-5'>
                        <span className={`text-white text-[32px] font-bold m-4
                            ${index === 0 ? 'text-shadow-no1' : index === 1 ? 'text-shadow-no2' : index === 2 ? 'text-shadow-no3' : 'text-shadow-no4'}`
                        }>
                            {index + 1}
                        </span>
                        <span><IoRemoveOutline size={16} /></span>
                    </div>
                }
                <img src={songData?.thumbnail} alt='thumbnail'
                    className='w-10 h-10 object-cover rounded-md'
                />
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-500 font-semibold'>
                        {songData?.name?.length > 30 ? `${songData?.name?.slice(0, 30)}...` : songData?.name}
                    </span>
                    <span className='text-xs text-gray-400 flex'>
                        {songData?.singers?.map((item, index) => (
                            index < 3 && <span key={index} className='hover:text-[#9431C6]' 
                                onClick={(event) => {
                                    event.stopPropagation();
                                    const link = item?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                                    navigate(`/singer/${link}/${item?.id}`)
                                }}
                            >
                                {(index > 0 ? ', ' : '') + item?.name}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
            {!hover && <div className='flex-1 flex justify-end'>
                {moment.utc(songData?.duration * 1000).format("mm:ss")}
            </div>}
            {hover && login && !isUploaded && <div className='flex-1 flex justify-end gap-7 cursor-pointer'>
                <div onClick={handleLikeSong}>
                    {liked ? <AiFillHeart title='Xóa khỏi thư viện' size={16} /> : <AiOutlineHeart title='Thêm vào thư viện' size={16} />}
                </div>
                {!myMusic && !isPlaylist && <BsPlusLg size={16} title='Thêm vào playlist' onClick={(event) => {
                    event.stopPropagation();
                    setIsAdd(true);
                    setAddItem(songData)
                }} />}
                {isPlaylist && <AiOutlineDelete size={16} title='Xóa khỏi playlist' 
                    onClick={(event) => {
                        event.stopPropagation();
                        setDeleteItem(songData)
                    }}/>
                }
            </div>}
            {hover && login && isUploaded && <div className='flex-1 flex justify-end gap-7 cursor-pointer' onClick={handleLikeSong}>
                <IoIosCloseCircleOutline size={16} />
            </div>}
        </div>

    )
}

export default memo(ListItem);