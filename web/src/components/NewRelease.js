import React, { useEffect, useState } from 'react';
import icons from '../utils/icons';
import NewReleaseItem from './NewReleaseItem';
import * as apis from '../apis';
import path from '../utils/path';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RotateLine } from '../components';

const { BsChevronRight, IoIosCloseCircleOutline } = icons;

const NewRelease = ({setLoading, loading}) => {

    const [playlistLoading, setPlaylistLoading] = useState();
    const [releaseLoading, setReleaseLoading] = useState(false);
    const [type, setType] = useState(1);
    const [songData, setSongData] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [addItem, setAddItem] = useState({});
    const [playlist, setPlaylist] = useState([]);
    const navigate = useNavigate();
    console.log(loading);

    useEffect(() => {
        const fetchData = async () => {
            setReleaseLoading(true);
            const response = await apis.getNewRelease(type, 12);
            setReleaseLoading(false);
            setLoading(prev => prev + 1);
            setSongData(response?.data?.data);
            console.log(response);
        }
        fetchData();
    }, [type]);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            setPlaylistLoading(true);
            const resPlaylist = await apis.apiGetPlaylist();
            setPlaylistLoading(false);
            setPlaylist(resPlaylist?.data?.data);
            console.log(resPlaylist?.data?.data);
        }
        fetchPlaylistData();
    }, [isAdd])

    const handleAddPlaylist = (playlistData) => {
        const formData = new FormData();
        formData.append(`song_ids[0]`, addItem?.id);
        formData.append('id', playlistData?.id);
        const updateAlbum = async () => {
            setPlaylistLoading(true);
            const res = await apis.apiUpdateAlbum(formData);
            setPlaylistLoading(false);
            if(res?.data?.success === true) {
                console.log(res);
                setIsAdd(false);
                toast.success('Thêm vào playlist thành công');
            }
        }
        updateAlbum();
    }

    return (
        <div className='relative'>
            <div className='flex flex-col gap-5'>
                <h3 className='text-xl font-bold'>Mới phát hành</h3>
                <div className='flex justify-between items-center'>
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
                    <div className='flex text-gray-500 justify-center items-center gap-2 cursor-pointer' onClick={() => {
                        navigate(path.NEWRELEASE);
                    }}>
                        <span className='text-xs'>TẤT CẢ</span>
                        <BsChevronRight size={16} />
                    </div>
                </div>
                <div className={`relative flex flex-wrap w-full ${releaseLoading && 'h-[320px]'}`}>
                    {loading >= 5 && releaseLoading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 flex justify-center items-center'>
                        <RotateLine width={40} />
                    </div>}
                    {!releaseLoading && songData?.filter((item, index) => index < 12)?.map((item) => (
                        <div key={item.id}  className='w-[300px] min-[1024px]:w-[30%]'>
                            <NewReleaseItem data={item} time={true} setIsAdd={setIsAdd} setAddItem={setAddItem} />
                        </div>
                    ))}
                </div>
            </div>
            {isAdd && !playlistLoading &&
            <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
                <div className='w-[30%] rounded-md p-4 border border-gray-200 shadow-lg bg-white flex flex-col'>
                    <div className='flex items-center justify-between mb-7' onClick={() => setIsAdd(false)}>
                        <span className='text-base font-semibold'>Thêm vào playlist</span>
                        <IoIosCloseCircleOutline size={24} className='cursor-pointer' />
                    </div>
                    {playlist ? playlist?.map(item => (
                        <div key={item?.id} className='w-[80%] cursor-pointer mb-3' onClick={() => handleAddPlaylist(item)}>
                            <span className='w-full p-2 border-t-2 border-gray-300'>{item?.title}</span>
                        </div>
                    )) : <div>Hiện chưa có playlist</div>}
                </div>
            </div>}
            {isAdd && playlistLoading && 
            <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center '>
                <div className='w-[30%] rounded-md p-4 border border-gray-200 shadow-lg bg-white flex justify-center items-center'>
                    <RotateLine width={30} />
                </div>
            </div>}
        </div>
  )
}

export default NewRelease