import { React, useEffect, useState } from 'react';
import { HomeSection, NewRelease, Slider, WeekChart, ZingChart } from '../../components';
import { useSelector } from 'react-redux';
import * as apis from '../../apis';

const Home = () => {

  const [banner, setBanner] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.apiGetTopNewReleaseSongs();
            const data = response?.data?.data?.slice(0, 8);
            setBanner([...data, ...data]);
        }
        fetchData();
    })

  return (
    <div className='flex flex-col mb-36 gap-12 overflow-y-auto'>
      <Slider banner={banner} />

      <NewRelease/>

      <HomeSection id={3} name='Album hot' />
      <HomeSection id={2} name='Nghệ sĩ thịnh hành' />
      <HomeSection id={1} name='Top 100' />
    </div>
  )
}

export default Home