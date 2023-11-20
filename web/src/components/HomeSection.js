import { React, memo, useEffect, useState } from 'react';
import icons from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import HomeSectionItem from './HomeSectionItem';
import * as apis from '../apis';

const { BsChevronRight } = icons;

const HomeSection = ({name}) => {

    const navigate = useNavigate();
    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if (name === 'Top 100') {
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
            }
            
        }
        fetchData();
    }, []);
    console.log(data);

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-bold'>{name}</h3>
                <div className='flex text-gray-500 justify-center items-center gap-2'>
                    <span className='text-xs'>TẤT CẢ</span>
                    <BsChevronRight size={16} />
                </div>
            </div>
            <div className='flex gap-7 justify-between items-start '>
                {data?.map(item => (
                    <div key={item.id}
                        className='w-1/5 flex flex-col gap-2 items-center justify-center cursor-pointer'
                        onClick={() => {
                            const link = item.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            console.log(link);
                        }}
                    >
                        <HomeSectionItem thumbnail={item.thumbnail}/>
                        <span className='text-gray-400 text-sm'>
                            {item?.description?.length > 50 ? `${item?.description?.slice(0, 50)}...` : item?.description}
                        </span>
                            
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(HomeSection);