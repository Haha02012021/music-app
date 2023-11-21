import { React, memo } from 'react';
import icons from '../utils/icons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import * as actions from '../store/actions';

const { PiMusicNotesSimpleLight, IoRemoveOutline } = icons;

const ListItem = ({songData, index, release}) => {

    const dispatch = useDispatch();
    console.log(songData);

    return (
        <div className='cursor-pointer flex justify-between items-center p-[10px] border-t border-gray-300 hover:bg-gray-100'
            onClick={() => {
                dispatch(actions.setCurSongId(songData?.id));
                dispatch(actions.playSong(true));
                {!release && dispatch(actions.getSongId(index))};
            }}
        >
            <div className='flex flex-1 justify-start items-center gap-2'>
                {!release && <PiMusicNotesSimpleLight size={14} />}
                { release && 
                    <div className='flex justify-center items-center mr-5'>
                        <span className={`text-white text-[32px] font-bold m-4
                            ${index === 0 ? 'text-shadow-no1' : index === 1 ? 'text-shadow-no2' : index === 2 ? 'text-shadow-no3' : 'text-shadow-no4'}`
                        }>
                            {index + 1}
                        </span>
                        <span><IoRemoveOutline size={16} /></span>
                    </div>
                }
                <img src={songData?.thumbnail} alt='thumbnail'
                    className='w-10 h-10 object-cover rounded-md'
                />
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-500 font-semibold'>
                        {songData?.name?.length > 30 ? `${songData?.name?.slice(0, 30)}...` : songData?.name}
                    </span>
                    <span className='text-xs text-gray-400'>{songData?.singers?.[0]?.name}</span>
                </div>
            </div>
            <div className='flex-1 flex justify-end'>
                {moment.utc(songData?.duration * 1000).format("mm:ss")}
            </div>
        </div>
    )
}

export default memo(ListItem);