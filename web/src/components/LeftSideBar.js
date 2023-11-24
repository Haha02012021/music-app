import React from 'react';
import Logo from '../assets/Logo.svg';
import { sidebarMenu } from '../utils/menu';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import path from '../utils/path';

const noneActive = 'py-2 px-[25px] font-semibold text-[#32323D] flex gap-[12px] items-center';
const active = 'py-2 px-[25px] font-semibold text-[#8D22C3] flex gap-[12px] items-center';

const LeftSideBar = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-main-100 h-full flex flex-col'>
        <div onClick={() => navigate(path.HOME)}
        className='w-full h-[70px] py-[15px] px-[25px] cursor-pointer flex justify-start items-center'
        >
            <img className='w-[120px] object-container' src={Logo} alt='Zing Mp3 Logo' />
        </div>

        <div className='flex flex-col'>
          {sidebarMenu.map((item, index) => ( 
            <div key={item.path}>
              <NavLink to={item.path}
                end={item.end}
                className={ ({isActive}) => isActive ? active : noneActive}
              >
                {item.icon}
                {item.text}
              </NavLink>
              {index === 3 && <div className='h-[1px] w-[90%] bg-gray-400 my-5 mx-3'></div>}
            </div>
          ))}
        </div>
    </div>
  )
}

export default LeftSideBar