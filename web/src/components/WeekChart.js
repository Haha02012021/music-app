import React from 'react'
import { useNavigate } from 'react-router-dom';

const WeekChart = ({data}) => {
    const navigate = useNavigate();
  return (
    <div onClick={() => {
        navigate(data?.link?.split('.')[0]);
    }} className='cursor-pointer'>
        <img className='rounded-md' src={data.cover} alt='thumbnail'/>
    </div>
  )
}

export default WeekChart