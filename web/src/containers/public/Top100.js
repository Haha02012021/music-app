import React, { useEffect, useState } from 'react';
import top100Src from '../../assets/top100.svg';
import * as apis from '../../apis';
import HomeSection from '../../components/HomeSection';

const Top100 = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.getTop100();
            setData(response?.data?.data);
        }
        fetchData();
    }, [])

    return (
        <div>
            <span className='w-full flex items-center justify-center'>
                <img src={top100Src} />
            </span>
            <div className='mt-10'>
                {data?.map((item, index) => (
                    <div key={index} className='my-20'>
                        <HomeSection hdata={item} id={5}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Top100