import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';
import { HomeSection, TriangleLoading } from '../../components';

const GenreTopic = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [pageId, setPageId] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apis.apiGenre(pageId);
            setLoading(false);
            console.log(response);
            setData(response?.data?.data?.data);
            setLastPage(response?.data?.data?.last_page)
        }
        fetchData();
    }, [pageId])

    const handleChangePageId = (e) => {
        if (e.key === 'Enter') setPageId(e.target.value);
    }

    return (
        <div className='mb-36 relative'>
            {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
                <TriangleLoading />
            </div>}
            {!loading && <div>
                <div className='flex flex-col gap-7'>
                    {data?.map(item => (
                        item?.albums_slice?.length > 0 && <HomeSection key={item?.id} name={item?.name} gid={item?.albums_slice} />
                    ))}
                </div>
                <div className='flex flex-row-reverse mt-5'>
                    <div className='flex gap-7'>
                        <span className={`py-2 px-8 ${pageId > 1 ? 'bg-[#9431C6] cursor-pointer text-white' : 'bg-[#8B668B] text-gray-600'} rounded-md `}
                            onClick={() => { pageId > 1 && setPageId(+pageId - 1) }}
                        >
                            Trang trước
                        </span>
                        <div className='flex justify-center items-center gap-2'>
                            <input type='text' defaultValue={pageId} onKeyDown={handleChangePageId} className='w-[50px] p-2 border border-gray-500' />
                            <span className='text-xl'>/ {lastPage}</span>
                        </div>
                        <span className={`py-2 px-8 ${pageId < lastPage ? 'bg-[#9431C6] cursor-pointer' : 'bg-[#8B668B] text-gray-600'} text-white rounded-md `}
                            onClick={() => { pageId < lastPage && setPageId(+pageId + 1) }}
                        >
                            Trang sau
                        </span>
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default GenreTopic