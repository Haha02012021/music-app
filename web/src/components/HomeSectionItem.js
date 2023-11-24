import React, { memo, useRef, useState } from 'react';
import icons from '../utils/icons';
import * as apis from '../apis';

const { AiFillHeart,
    AiOutlineHeart, TbPlayerPlayFilled, BsPlusLg } = icons;

const HomeSectionItem = ({thumbnail, item_id}) => {

    const [hover, setHover] = useState(false);
    const imageRef = useRef();
    //console.log(thumbnail);

    const handleLikeAlbum = () => {
        const likeAlbum = async() => {
            const response = await apis.apiLikeSong(item_id, 2);
            console.log(response);
        }
        likeAlbum();
    }

    return (
        <div onMouseEnter={() => {
                setHover(true);
                imageRef.current.classList?.remove('animate-scale-down-image');
                imageRef.current.classList?.add('animate-scale-up-image');
            }} 
            onMouseLeave={() => {
                setHover(false);
                imageRef.current.classList?.remove('animate-scale-up-image');
                imageRef.current.classList?.add('animate-scale-down-image');
            }} 
            className='relative w-full rounded-md overflow-hidden'
        >
            <img ref={imageRef} className='w-full h-auto rounded-md' src={thumbnail} alt='thumbnail' /> 
            { hover && 
                <div className={`absolute top-0 bottom-0 left-0 right-0 rounded-md bg-overlay-30
                    text-white flex justify-center items-center gap-8`}>
                    <span onClick={handleLikeAlbum}><AiOutlineHeart title='Thêm vào thư viện' size={24}/></span>
                    <span className='border border-white rounded-full p-[10px] '><TbPlayerPlayFilled size={24}/></span>
                    <span><BsPlusLg title='Thêm vào danh sách phát' size={24}/></span>
                </div>
            }
        </div>
    )
}

export default memo(HomeSectionItem);