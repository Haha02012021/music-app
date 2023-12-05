import React from 'react';
import icons from '../utils/icons';
import Search from './Search';
import { Login } from '../containers/public';

const {GoArrowRight, GoArrowLeft} = icons;

const Header = () => {

  return (
    <div className='w-full flex justify-between'>
        <div className='w-4/5 flex gap-6 items-center'>
            {/* <div className='flex gap-4 text-[#CECED0]'>
                <span>
                    <GoArrowLeft size={24} />
                </span>
                <span>
                    <GoArrowRight size={24}/>
                </span>
            </div> */}
            <div className='w-1/2'>
                <Search />
            </div>
        </div>
        <div className='w-1/5'>
            <Login />
        </div>
    </div>
  )
}

export default Header