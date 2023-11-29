import { React, memo, useEffect, useState } from 'react';
import ListItem from './ListItem';
import icons from '../utils/icons';
import { useSelector } from 'react-redux';
import * as apis from '../apis';

const { LuDot, IoIosCloseCircleOutline } = icons;

const ListSong = ({release}) => {
    const { songs } = useSelector(state => state.music);
    const [isAdd, setIsAdd] = useState(false);
    const [addItem, setAddItem] = useState({});
    const [playlist, setPlaylist] = useState([]);
    var totalDuration = 0;
    songs.map(item => {
        totalDuration +=  item?.duration;
    })
    const hour = Math.floor(totalDuration / 3600);
    const minute = Math.floor((totalDuration - hour * 3600) / 60);
    const second = totalDuration - hour * 3600 - minute * 60; 

    useEffect(() => {
        const fetchPlaylistData = async () => {
            const resPlaylist = await apis.apiGetPlaylist();
            setPlaylist(resPlaylist?.data?.data);
            console.log(resPlaylist?.data?.data);
        }
        fetchPlaylistData();
    }, [isAdd])

    const handleAddPlaylist = (playlistData) => {
        const formData = new FormData();
        var songs = [];
        songs = [...songs, addItem?.id]
        songs.forEach((item, index) => {
            formData.append(`song_ids[${index}]`, item);
          });
        formData.append('id', playlistData?.id);
        const updateAlbum = async () => {
            const res = await apis.apiUpdateAlbum(formData);
            if(res?.data?.success === true) {
                console.log(res);
                setIsAdd(false);
            }
        }
        updateAlbum();
    }
    //console.log(songs);
    return (
        <div className='relative w-full h-screen flex flex-col text-xs overflow-y-auto mb-36'>
            {!release && <div className='flex justify-between items-center font-semibold text-gray-600 p-[10px]'>
                <span>BÀI HÁT</span>
                <span>THỜI GIAN</span>
            </div> }
            <div className='p-[10px] flex flex-col'>
                {songs?.map((item, index) => (
                    <ListItem key={item.id} songData={item} is_liked={item?.is_liked} index={index} release={release}
                    setIsAdd={setIsAdd} setAddItem={setAddItem}
                />
                ))}
            </div>
            <div className='border-t border-gray-300'>
                <div className='flex gap-1 justify-start items-center text-sm text-gray-500 mt-4'>
                    <span>{songs.length} bài hát</span>
                    <span className='flex justify-center items-center'><LuDot /></span>
                    { hour > 0 && <span> { hour } giờ </span>}
                    <span>{ minute } phút </span>
                    <span>{ second } giây</span>
                </div>
            </div>
            {isAdd && 
                <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
                    <div className='w-[30%] rounded-md p-4 shadow-md bg-white'>
                        <div className='flex flex-row-reverse cursor-pointer' onClick={() => setIsAdd(false)}>
                            <IoIosCloseCircleOutline size={24} />
                        </div>
                        {playlist ? playlist?.map(item => (
                            <div key={item?.id} className='w-[80%] cursor-pointer' onClick={() => handleAddPlaylist(item)}>
                                <span className='w-full p-2 border-t-2 border-gray-300'>{item?.title}</span>
                            </div>
                        )) : <div>Hiện chưa có playlist</div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(ListSong);