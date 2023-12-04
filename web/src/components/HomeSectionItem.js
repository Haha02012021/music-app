import React, { memo, useRef, useState } from 'react';
import icons from '../utils/icons';
import * as apis from '../apis';
import defaultBackground from '../assets/PlaylistDefaultBackground.png';
import { toast } from 'react-toastify';

const { AiFillHeart, IoIosCloseCircleOutline,
    AiOutlineHeart, TbPlayerPlayFilled, BsPlusLg } = icons;

const HomeSectionItem = ({ thumbnail, item_id, is_liked, isPlaylist, setAddLoad, myMusic }) => {

    const [hover, setHover] = useState(false);
    const imageRef = useRef();
    const [liked, setLiked] = useState(is_liked);
    console.log(isPlaylist)

    const likeAlbum = async () => {
        if (myMusic) setAddLoad(true);
        const response = await apis.apiLikeSong(item_id, 1);
        console.log(response);
        toast.success('Xóa album/playlist thành công')
        setLiked(prev => !prev);
    }

    const handleDelete = () => {
        const deleteModel = async () => {
            if (myMusic) setAddLoad(true);
            const res = await apis.apiDelete('album', item_id);
            if (res?.data?.success === true) {
                toast.success(res?.data?.message);
            }
        }
        deleteModel();
    }

    const handleLikeAlbum = (e) => {
        e.stopPropagation();

        if (!isPlaylist) {
            likeAlbum();
        } else {
            handleDelete();
        }
    }

    return (
        <div onMouseEnter={() => {
            setHover(true);
            imageRef.current.classList?.remove('animate-scale-down-image');
            imageRef.current.classList?.add('animate-scale-up-image');
        }}
            onMouseLeave={() => {
                setHover(true);
                imageRef.current.classList?.remove('animate-scale-up-image');
                imageRef.current.classList?.add('animate-scale-down-image');
            }}
            className='relative w-full rounded-md overflow-hidden'
        >
            <img ref={imageRef} className='w-full h-auto rounded-md' src={thumbnail ? thumbnail : defaultBackground} alt='thumbnail' />
            {hover &&
                <div className={`absolute top-0 bottom-0 left-0 right-0 rounded-md bg-overlay-30
                    text-white`}>
                    {item_id && myMusic && <span className='flex flex-row-reverse mt-2 mr-2' onClick={handleLikeAlbum}>
                        <IoIosCloseCircleOutline size={24} />
                    </span>}
                    <div className={`w-full flex justify-center ${myMusic ? 'mt-[60px]' : 'h-full items-center gap-7'}`}>
                        {item_id > 0 && !myMusic &&
                            <span onClick={handleLikeAlbum}>
                                {liked ? <AiFillHeart title='Xóa khỏi thư viện' size={24} /> : <AiOutlineHeart title='Thêm vào thư viện' size={24} />}
                            </span>
                        }
                        <span className='border border-white rounded-full p-[10px] '><TbPlayerPlayFilled size={24} /></span>
                        {item_id > 0 && !myMusic && <span><BsPlusLg title='Thêm vào danh sách phát' size={24} /></span>}
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(HomeSectionItem);