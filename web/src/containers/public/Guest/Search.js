import React, { useEffect, useState } from 'react';
import * as apis from '../../../apis';
import * as actions from '../../../store/actions';
import { useNavigate, useParams } from 'react-router-dom';
import icons from '../../../utils/icons';
import { TriangleLoading } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';

const { BsChevronRight } = icons;
const Search = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { searchText } = useParams();
    const { nearlyListenSongs } = useSelector(state => state.music);
    const [songData, setSongData] = useState([]);
    const [singerData, setSingerData] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    const [maxSinger, setMaxSinger] = useState(10);
    const [maxSong, setMaxSong] = useState(10);
    const [maxAlbum, setMaxAlbum] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await apis.apiSearch(searchText);
            setLoading(false);
            console.log(res);
            setSongData(res?.data?.data?.songs);
            setSingerData(res?.data?.data?.singers);
            setAlbumData(res?.data?.data?.albums);
        }
        fetchData();
    }, [searchText])
    return (
        <div className='mb-36 relative'>
            {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
                <TriangleLoading />
            </div>}
            {!loading && <div>
                <span className='text-[40px] font-semibold'>Kết quả tìm kiếm</span>
                {singerData.length > 0 && <div className='mt-10'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl font-medium'>Nghệ sĩ</span>
                    </div>
                    <div className='flex flex-wrap gap-7 mt-7'>
                        {singerData?.map((item, index) => (index < maxSinger &&
                            <div className='p-2 flex flex-col items-center w-[18%] shadow-lg border border-gray-200 rounded-md cursor-pointer'
                                onClick={() => {
                                    const link = item?.name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                                    const newLink = `/singer/${link}/${item?.id}`;
                                    navigate(newLink);
                                }}
                            >
                                <img src={item?.thumbnail} className='h-[100px] w-[100px] rounded-full' />
                                <span className='font-medium text-base'>{item?.name}</span>
                            </div>
                        ))}
                    </div>
                    {singerData.length > 10 && <span className='flex justify-center items-center'>
                        <button type='button' className='bg-[#9431C6] py-2 px-4 text-white rounded-lg mt-7'
                            onClick={() => {
                                maxSinger === 10 ? setMaxSinger(singerData?.length) : setMaxSinger(10);
                            }}>
                            {maxSinger === 10 ? 'Xem thêm' : 'Rút gọn'}
                        </button>
                    </span>}
                </div>}
                {songData.length > 0 && <div className='mt-10'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl font-medium'>Bài hát</span>
                    </div>
                    <div className='flex flex-wrap gap-7 mt-7'>
                        {songData?.map((item, index) => (index < maxSong &&
                            <div className='p-2 flex flex-col items-center w-[18%] shadow-lg border border-gray-200 rounded-md cursor-pointer'
                                onClick={() => {
                                    dispatch(actions.setCurSongId(item?.id));
                                    dispatch(actions.playSong(true));
                                    dispatch(actions.setNearlyListenSongs([...nearlyListenSongs, item]));
                                    dispatch(actions.getSongId(null));
                                }}
                            >
                                <img src={item?.thumbnail} className='h-[100px] w-[100px] rounded-full' />
                                <span className='font-medium text-base'>{item?.name}</span>
                            </div>
                        ))}
                    </div>
                    {songData.length > 10 && <span className='flex justify-center items-center'>
                        <button type='button' className='bg-[#9431C6] py-2 px-4 text-white rounded-lg mt-7'
                            onClick={() => {
                                maxSong === 10 ? setMaxSong(songData?.length) : setMaxSong(10);
                            }}>
                            {maxSong === 10 ? 'Xem thêm' : 'Rút gọn'}
                        </button>
                    </span>}
                </div>}
                {albumData.length > 0 && <div className='mt-10'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl font-medium'>Album</span>
                    </div>
                    <div className='flex flex-wrap gap-7 mt-7'>
                        {albumData?.map((item, index) => (index < maxAlbum &&
                            <div className='p-2 flex flex-col items-center w-[18%] shadow-lg border border-gray-200 rounded-md cursor-pointer'
                                onClick={() => {
                                    const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                                    const newLink = '/album/'+link+'/'+item?.id;
                                    navigate(newLink);
                                }}
                            >
                                <img src={item?.thumbnail} className='h-[100px] w-[100px] rounded-full' />
                                <span className='font-medium text-base'>{item?.title}</span>
                            </div>
                        ))}
                    </div>
                    {albumData.length > 10 && <span className='flex justify-center items-center'>
                        <button type='button' className='bg-[#9431C6] py-2 px-4 text-white rounded-lg mt-7'
                            onClick={() => {
                                maxAlbum === 10 ? setMaxAlbum(albumData?.length) : setMaxAlbum(10);
                            }}>
                            {maxAlbum === 10 ? 'Xem thêm' : 'Rút gọn'}
                        </button>
                    </span>}
                </div>}
            </div>}
        </div>
    )
}

export default Search