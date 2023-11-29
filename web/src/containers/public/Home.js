import { React, useEffect, useState } from 'react';
import { HomeSection, NewRelease, Slider, TriangleLoading } from '../../components';
import * as apis from '../../apis';

const Home = () => {

  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.apiGetTopNewReleaseSongs();
            setLoading(prev => prev + 1);
            const data = response?.data?.data?.slice(0, 8);
            setBanner([...data, ...data]);
        }
        fetchData();
    }, [])
    console.log(loading);
  return (
    <div className='relative w-full pb-36'>
      {loading < 5 && <div className='absolute top-0 right-0 left-0 bottom-0 z-20 bg-white '>
          <div className='ml-[500px] mt-[200px] w-fit h-fit'><TriangleLoading /></div>
      </div>}
      <div className='flex flex-col gap-12 overflow-y-auto'>
        <Slider banner={banner} />

        <NewRelease setLoading={setLoading}/>

        <HomeSection id={3} name='Album hot' setLoading={setLoading}/>
        <HomeSection id={2} name='Nghệ sĩ thịnh hành' setLoading={setLoading}/>
        <HomeSection id={1} name='Top 100' setLoading={setLoading}/>
      </div>
    </div>
  )
}

export default Home