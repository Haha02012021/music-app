import { React, memo } from 'react';
import ListItem from './ListItem';
import moment from 'moment';
import icons from '../utils/icons';
import { useSelector } from 'react-redux';

const { LuDot } = icons;

const ListSong = ({release}) => {
    const { songs } = useSelector(state => state.music);
    var totalDuration = 0;
    songs.map(item => {
        totalDuration +=  item?.duration;
    })
    
    return (
        <div className='w-full h-screen flex flex-col text-xs overflow-y-auto mb-36'>
            {!release && <div className='flex justify-between items-center font-semibold text-gray-600 p-[10px]'>
                <span>BÀI HÁT</span>
                <span>THỜI GIAN</span>
            </div> }
            <div className='p-[10px] flex flex-col'>
                {songs?.map((item, index) => (
                    <ListItem key={item.id} songData={item} index={index} release={release}/>
                ))}
            </div>
            <div className='border-t border-gray-300'>
                <div className='flex gap-1 justify-start items-center text-sm text-gray-500 mt-4'>
                    <span>{songs.length} bài hát</span>
                    <span className='flex justify-center items-center'><LuDot /></span>
                    <span>{moment.utc(totalDuration * 1000).format("hh")} giờ </span>
                    <span>{moment.utc(totalDuration * 1000).format("mm")} phút</span>
                </div>
            </div>
        </div>
    )
}

export default memo(ListSong);