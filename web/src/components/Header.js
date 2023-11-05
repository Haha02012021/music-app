import React from 'react';
import icons from '../utils/icons';
import Search from './Search';

const {GoArrowRight, GoArrowLeft} = icons;

const Header = () => {
  return (
    <div className='w-full flex justify-between'>
        <div className='w-full flex gap-6 items-center'>
            <div className='flex gap-4 text-[#CECED0]'>
                <span>
                    <GoArrowLeft size={24} />
                </span>
                <span>
                    <GoArrowRight size={24}/>
                </span>
            </div>
            <div className='w-1/2'>
                <Search />
            </div>
        </div>
        <div>
            Dang nhap
        </div>
    </div>
  )
}

export default Header