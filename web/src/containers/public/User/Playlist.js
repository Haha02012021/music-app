import React, { useEffect, useState, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as apis from '../../../apis';
import moment from 'moment';
import { ListSong, AudioSpinner, TriangleLoading } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions';
import icons from '../../../utils/icons';
import defaultBackground from '../../../assets/PlaylistDefaultBackground.png';

const { TbPlayerPlayFilled } = icons;

const Playlist = () => {
    const location = useLocation();
    const isPlaylist = location.state?.isPlaylist;
    const { pid } = useParams();
    const { isPlaying, curSongId } = useSelector(state => state.music);
    const [playlistData, setPlaylistData] = useState({});
    const [loading, setLoading] = useState();
    const [isDelete, setIsDelete] = useState(false);
    const [isPlaylistSong, setIsPlaylistSong] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDataDetailPlaylist = async () => {
            setLoading(true);
            const response = await apis.apiGetDetailPlaylist(pid);
            setLoading(false);
            if (response?.status === 200) {
                console.log(response);
                setPlaylistData(response.data.data);
                dispatch(actions.setCurPlaylistId(pid));
                dispatch(actions.setSong(response?.data?.data?.songs));
            }
        }

        fetchDataDetailPlaylist();
    }, [isDelete])

    useEffect(() => {
        setIsPlaylistSong(playlistData?.songs?.filter(item => item?.id === curSongId))
        //console.log(isPlaylistSong);
    }, [curSongId])

    return (
        <div className={`relative flex gap-8`}>
            {loading === true && <div className='absolute top-0 bottom-0 left-0 right-0 z-20 bg-white'>
                <div className='ml-[500px] mt-[200px]'>
                    <TriangleLoading />
                </div>
            </div>}
            {loading === false && <div className='flex-none w-1/4 flex flex-col items-center gap-2'>
                <div className='w-full relative overflow-hidden'>
                    <img src={playlistData?.thumbnail ? playlistData?.thumbnail : defaultBackground} alt='Thumbnail' 
                        className='w-full object-contain rounded-md shadow-md' 
                    />
                    <div className='absolute top-0 left-0 bottom-0 right-0 hover:bg-black hover:opacity-30 text-white flex items-center justify-center '>
                        <span className='p-2 border border-white rounded-full'>
                            {(isPlaying && isPlaylistSong) ? <AudioSpinner /> : <TbPlayerPlayFilled size={20}/>}
                        </span>
                    </div>
                </div>
                <h3 className='text-xl font-bold text-[#32323D]'>{playlistData?.title}</h3>
                <div className='flex flex-col gap-1 text-xs text-gray-500 text-center'>
                    <span>
                        Cập nhật: {moment(playlistData?.updated_at).format("DD/MM/YYYY")}
                    </span>
                    <span>
                        {playlistData?.artistsNames}
                    </span>
                    <span>{playlistData?.like} người yêu thích</span>
                </div>
            </div>}
            {loading === false && <div className='flex-auto'>
                <div className='text-sm'>
                    <span className='text-gray-600'>Lời tựa </span>
                    <span>{playlistData?.sortDescription}</span>
                </div>
                <div className='mb-10'>
                    <ListSong isPlaylist={isPlaylist} setIsDelete={setIsDelete} />
                </div>
            </div>}
        </div>
    )
}

export default memo(Playlist)