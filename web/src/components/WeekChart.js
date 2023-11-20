import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';

const WeekChart = ({data}) => {
    const navigate = useNavigate();
    const imgRef = useRef();
  return (
    <div onClick={() => {
        navigate(data?.link?.split('.')[0]);
    }} onMouseEnter={() => {
      imgRef.current.classList.remove('animate-scale-down-image');
      imgRef.current.classList.add('animate-scale-up-image');
    }} onMouseLeave={() => {
      imgRef.current.classList.remove('animate-scale-up-image');
      imgRef.current.classList.add('animate-scale-down-image');
    }} className='cursor-pointer overflow-hidden rounded-md'>
        <img ref={imgRef} className='rounded-md' src={data.cover} alt='thumbnail'/>
    </div>
  )
}

export default WeekChart