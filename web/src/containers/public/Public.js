import React from 'react';
import { Outlet } from 'react-router-dom';
import { LeftSideBar, RightSideBar, Player, Header } from '../../components';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Public = () => {

  const [openRightSideBar, setOpenRightSideBar] = useState(false);
  const { curSongId } = useSelector(state => state.music);

  const handleOpenSidebar = () => {
    setOpenRightSideBar(!openRightSideBar)
  }

  return (
    <div className='w-full h-screen relative flex flex-col bg-main-300'>
      <div className='w-full flex flex-auto overflow-hidden relative'>
        <div className='h-full w-[240px] flex-none'>
          <LeftSideBar />
        </div>

        <div className='flex-auto px-[59px] overflow-auto'>
          <div className='h-[70px] flex items-center mb-5'>
            <Header />
          </div>
            <Outlet />
        </div>

        { openRightSideBar && 
          <div className='w-[329px] z-20 absolute top-0 right-0 bg-white border-l-2 1600:flex flex-none animate-slide-left'>
            <RightSideBar />
          </div>
        }
      </div>
      
      {curSongId && <div className='fixed z-30 bottom-0 left-0 right-0 h-[90px]'>
        <Player setOpenRightSideBar={handleOpenSidebar} openRightSideBar={openRightSideBar}/>
      </div>}
    </div>
  )
}

export default Public