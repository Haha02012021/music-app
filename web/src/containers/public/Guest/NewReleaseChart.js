import React, { useEffect, useState } from 'react';
import icons from '../../../utils/icons';
import * as apis from '../../../apis';
import ListSong from '../../../components/ListSong';
import * as actions from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { TriangleLoading } from '../../../components';

const { TbPlayerPlayFilled } = icons;
const NewReleaseChart = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apis.apiGetTopNewReleaseSongs();
            setLoading(false);
            if (response?.status === 200) {
                dispatch(actions.setSong(response?.data?.data));
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            {loading && <div className='w-full h-screen mt-[200px] ml-[500px]'><TriangleLoading /></div>}
            {loading === false && <div>
                <div className='flex items-center gap-4'>
                    <span className='text-[40px] font-bold'>BXH Nhạc Mới</span>
                    <span className='p-2 rounded-full cursor-pointer border-[1px] border-black border-opacity-10 hover:bg-gray-200'>
                        <TbPlayerPlayFilled color='black' size={24} />
                    </span>
                </div>
                <div>
                    <ListSong release={true} />
                </div>
            </div>}
        </div>
    )
}

export default NewReleaseChart