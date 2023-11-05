import { React, memo } from 'react';
import icons from '../utils/icons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import * as actions from '../store/actions';

const { PiMusicNotesSimpleLight } = icons;

const ListItem = ({songData, id}) => {

    const dispatch = useDispatch();

    return (
        <div className='cursor-pointer flex justify-between items-center p-[10px] border-t border-gray-300 hover:bg-gray-100'
            onClick={() => {
                dispatch(actions.setCurSongId(songData?.encodeId));
                dispatch(actions.playSong(true));
                dispatch(actions.getSongId(id));
            }}
        >
            <div className='flex flex-1 justify-start items-center gap-2'>
                <PiMusicNotesSimpleLight size={14} />
                <img src={songData?.thumbnail} alt='thumbnail'
                    className='w-10 h-10 object-cover rounded-md'
                />
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-500 font-semibold'>
                        {songData?.title.length > 30 ? `${songData?.title.slice(0, 30)}...` : songData?.title}
                    </span>
                    <span className='text-xs text-gray-400'>{songData?.artistsNames}</span>
                </div>
            </div>
            <div className='flex-1 flex justify-center items-center text-center'>{songData?.album?.title}</div>
            <div className='flex-1 flex justify-end'>
                {moment.utc(songData?.duration * 1000).format("mm:ss")}
            </div>
        </div>
    )
}

export default memo(ListItem);