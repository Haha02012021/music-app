import { React, memo, useEffect, useState } from 'react';
import icons from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import HomeSectionItem from './HomeSectionItem';
import * as apis from '../apis';

const { BsChevronRight } = icons;

const HomeSection = ({id, name, gid, hdata}) => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (id === 1) {
                const response = await apis.getTop100();
                const dataTop100 = response?.data?.data;
                var index = 0;
                const dataFake = [];
                var nho = [];
                dataTop100?.map(dataItem => (dataItem?.albums?.map(item => {
                    if (index < 5 && !nho[item.id]) {
                        dataFake.push(item);
                        nho[item.id] = 1;
                        index++;
                    }
                })));
                setData(dataFake);
            } else if (id === 2) {
                const response = await apis.getTopSinger();
                setData(response?.data?.data);
            } else if (id === 3) {
                const response = await apis.getAlbumTop();
                setData(response?.data?.data);
            } else if (id === 4) {
                const response = await apis.apiGetGenreAlbum(gid);
                if (response?.data?.data?.length > 4) setData(response?.data?.data);
            } else if (id === 5) {
                setData(hdata?.albums);
            }
            
        }
        fetchData();
    }, [id]);

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-bold'>{id === 5 ? hdata?.title : name}</h3>
                <div className='flex text-gray-500 justify-center items-center gap-2'>
                    <span className='text-xs'>TẤT CẢ</span>
                    <BsChevronRight size={16} />
                </div>
            </div>
            <div className='flex gap-7 justify-between items-start '>
                {data?.filter((item, index) => index < 5)?.map(item => (
                    <div key={item.id}
                        className='w-1/5 flex flex-col gap-2 items-center justify-center cursor-pointer'
                        onClick={() => {
                            const link = item.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                            navigate(`album/${link}/${item.id}`)
                        }}
                    >
                        <HomeSectionItem thumbnail={item.thumbnail}/>
                        <span className={`${id === 3 ? 'text-gray-800 text-base font-semibold' : 'text-gray-400 text-sm'}`}>
                            {id ===3 ? item.title : id === 2 ? item.name 
                            : item?.description?.length > 50 ? `${item?.description?.slice(0, 50)}...` : item?.description}
                        </span>
                            
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(HomeSection);