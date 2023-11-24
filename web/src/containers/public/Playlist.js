import React, { useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import * as apis from '../../apis';
import moment from 'moment';
import { ListSong, AudioSpinner } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import icons from '../../utils/icons';

const { TbPlayerPlayFilled } = icons;

const Playlist = () => {
    const { pid } = useParams();
    const { isPlaying } = useSelector(state => state.music);
    const [playlistData, setPlaylistData] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchDataDetailPlaylist = async () => {
            const response = await apis.apiGetDetailPlaylist(pid);
            if (response?.status === 200) {
                setPlaylistData(response.data.data);
                dispatch(actions.setCurPlaylistId(pid));
                dispatch(actions.setSong(response?.data?.data?.songs));
            }
        }

        fetchDataDetailPlaylist();
    }, [])

    return (
        <div className='h-full flex gap-8 mb-36'>
            <div className='flex-none w-1/4 flex flex-col items-center gap-2'>
                <div className='w-full relative overflow-hidden'>
                    <img src={playlistData?.thumbnail} alt='Thumbnail' 
                        className='w-full object-contain rounded-md shadow-md' 
                    />
                    <div className='absolute top-0 left-0 bottom-0 right-0 hover:bg-black hover:opacity-30 text-white flex items-center justify-center '>
                        <span className='p-2 border border-white rounded-full'>
                            {isPlaying ? <AudioSpinner /> : <TbPlayerPlayFilled size={20}/>}
                        </span>
                    </div>
                </div>
                <h3 className='text-xl font-bold text-[#32323D]'>{playlistData?.title}</h3>
                <div className='flex flex-col gap-1 text-xs text-gray-500 text-center'>
                    <span>
                        Cập nhật: {moment.unix(playlistData?.contentLastUpdate).format("DD/MM/YYYY")}
                    </span>
                    <span>
                        {playlistData?.artistsNames}
                    </span>
                    <span>{playlistData?.like} người yêu thích</span>
                </div>
            </div>
            <div className='flex-auto'>
                <div className='text-sm'>
                    <span className='text-gray-600'>Lời tựa </span>
                    <span>{playlistData?.sortDescription}</span>
                </div>
                <div className='mb-10'>
                    <ListSong />
                </div>
            </div>
        </div>
    )
}

export default memo(Playlist)