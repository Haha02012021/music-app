import React, { useEffect, useState } from 'react';
import icons from '../../../utils/icons';
import * as apis from '../../../apis';
import ListSong from '../../../components/ListSong';
import * as actions from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { TriangleLoading } from '../../../components';

const { TbPlayerPlayFilled } = icons;
const NewRelease = () => {

    const dispatch = useDispatch();
    const [type, setType] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apis.getNewRelease(type);
            setLoading(false);
            if (response?.status === 200) {
                dispatch(actions.setSong(response?.data?.data));
            }
        }
        fetchData();
    }, [type])

    return (
        <div className='flex flex-col gap-7'>
            <div className='flex items-center gap-4'>
                <span className='text-[40px] font-bold'>Mới Phát Hành</span>
                <span className='p-2 rounded-full cursor-pointer border-[1px] border-black border-opacity-10 hover:bg-gray-200'>
                    <TbPlayerPlayFilled color='black' size={24} />
                </span>
            </div>
            <div className='flex gap-4 text-xs'>
                <button type='button' 
                    onClick={() => setType(1)}
                    className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 1 && 'bg-main-500 text-white'}`}
                >
                    VIỆT NAM
                </button>
                <button type='button' 
                    onClick={() => setType(0)}
                    className={`border rounded-l-full rounded-r-full py-[6px] px-8 cursor-pointer ${type === 0 && 'bg-main-500 text-white'}`}
                >
                    QUỐC TẾ
                </button>
            </div>

            <div className='relative'>
                {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
                    <TriangleLoading />
                </div>}
                {!loading && <ListSong release={true} />}
            </div>
        </div>
    )
    }

export default NewRelease