import { React, useEffect } from 'react';
import { HomeSection, NewRelease, Slider, WeekChart, ZingChart } from '../../components';
import * as apis from '../../apis';

const Home = () => {

 useEffect(() => {

    const getLikedAlbums = async () => {
        const res = await apis.apiGetLikedAlbums();
        console.log(res);
    }
    getLikedAlbums();
}, [])

  return (
    <div className='flex flex-col mb-36 gap-12 overflow-y-auto'>
      {/* <Slider /> */}

      <HomeSection id={4} name='Gần đây'/>
      <NewRelease/>

      {/* { homeData.filter((item, index) => index >= 3 && index <= 7).map((item, index) => (
        <HomeSection key={index} data={item} id={index} />
      ))} */}

      {/* <ZingChart chartData={homeData[9]} /> */}

      {/* <div className='flex justify-between items-center'>
        {homeData[10]?.items?.map((item, index) => (
          <WeekChart key={index} data={item} />
        ))}
        </div> */}
      <HomeSection id={3} name='Album hot' />
      <HomeSection id={2} name='Nghệ sĩ thịnh hành' />
      <HomeSection id={1} name='Top 100' />
    </div>
  )
}

export default Home