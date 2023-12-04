import React, { useEffect, useState, memo } from 'react';
import top100Src from '../../../assets/top100.svg';
import * as apis from '../../../apis';
import HomeSectionItem from '../../../components/HomeSectionItem';
import { useNavigate } from 'react-router-dom';
import { TriangleLoading } from '../../../components';

const Top100 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apis.getTop100();
            console.log(response);
            setLoading(false);
            setData(response?.data?.data);
        }
        fetchData();
    }, [])

    return (
        <div className='mb-36 relative'>
            {loading && <div className='absolute top-0 bottom-0 left-0 right-0 z-20 bg-white'>
                <div className='ml-[500px] mt-[200px]'>
                    <TriangleLoading />
                </div>
            </div>}
            <span className='w-full flex items-center justify-center'>
                <img src={top100Src} alt='thumbnailTop100' />
            </span>
            <div className='mt-10 flex flex-col gap-10'>
                {data?.map(top100Item => (
                    <div key={top100Item?.title}>
                        <span className='text-xl font-bold'>{top100Item?.title}</span>
                        <div className='flex flex-wrap gap-8 items-start mt-5'>
                            {top100Item?.albums?.map(item => (
                                <div key={item.id}
                                    className='w-[18%] flex flex-col gap-2 items-center justify-center cursor-pointer'
                                    onClick={() => {
                                        const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                                        const newLink = `/album/${link}/${item?.id}`;
                                        navigate(newLink);
                                    }}
                                >
                                    <HomeSectionItem thumbnail={item?.thumbnail}/>
                                    <span className='text-gray-400 text-sm'>
                                       {item?.description?.length > 50 ? `${item?.description?.slice(0, 50)}...` : item?.description}
                                    </span>
                                        
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(Top100)