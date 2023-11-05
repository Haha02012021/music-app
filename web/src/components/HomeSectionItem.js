import React, { useRef, useState } from 'react';
import icons from '../utils/icons';

const { AiFillHeart,
    AiOutlineHeart, BsThreeDots, TbPlayerPlayFilled, } = icons;

const HomeSectionItem = ({thumbnail}) => {

    const [hover, setHover] = useState(false);
    const imageRef = useRef();

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
                    <span><AiOutlineHeart size={24}/></span>
                    <span className='border border-white rounded-full p-[10px] '><TbPlayerPlayFilled size={24}/></span>
                    <span><BsThreeDots size={24}/></span>
                </div>
            }
        </div>
    )
}

export default HomeSectionItem