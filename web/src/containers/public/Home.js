import { React } from 'react';
import { HomeSection, NewRelease, Slider, WeekChart, ZingChart } from '../../components';
import { useSelector } from 'react-redux';

const Home = () => {

  const { 
    homeData
  } = useSelector(state => state.app);

  return (
    <div className='flex flex-col mb-36 gap-12 overflow-y-auto'>
      {/* <Slider /> */}

      <NewRelease data={homeData[2]}/>

      { homeData.filter((item, index) => index >= 3 && index <= 7).map((item, index) => (
        <HomeSection key={index} data={item} id={index} />
      ))}

      <ZingChart chartData={homeData[9]} />

      <div className='flex justify-between items-center'>
        {homeData[10]?.items?.map((item, index) => (
          <WeekChart key={index} data={item} />
        ))}
      </div>
      <HomeSection data={homeData[11]} id={11} />
      <HomeSection data={homeData[13]} id={13} />
    </div>
  )
}

export default Home