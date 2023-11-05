import React from 'react';
import icons from '../utils/icons';

const {GoSearch} = icons;

const Search = () => {
  return (
    <div className='w-full flex items-center'>
        <span className='bg-main-100 rounded-l-[20px] h-10 px-4 py-2 items-center text-[#929292]'>
            <GoSearch size={24} />
        </span>
        <input type='text'
            className='w-full outline-none bg-main-100 pr-4 py-2 rounded-r-[20px] h-10 text-gray-700'
            placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát...'
        />
    </div>
  )
}

export default Search