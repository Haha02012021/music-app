import { React, memo, useEffect} from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import * as actions from '../store/actions';
import { useDispatch } from 'react-redux';

const NewReleaseItem = ({data, order, percent, style, sm, time}) => {
    const dispatch = useDispatch();
    console.log(data);
  return (
    <div onClick={() => {
        dispatch(actions.setCurSongId(data?.id));
        dispatch(actions.playSong(true));
        dispatch(actions.getSongId(null));
    }}
        className={`flex-auto flex justify-between p-[10px] rounded-md cursor-pointer 
            ${style ? style : 'hover:bg-white-30 w-full'}`
        }>
        <div className='flex justify-start gap-[10px]'>
            { order && <span className={`text-[#3F1859] text-[32px] font-bold 
                ${order === 1 ? 'text-shadow-no1' : order === 2 ? 'text-shadow-no2' : 'text-shadow-no3'}`
            }>
                {order}
            </span> }
            <img src={data.thumbnail} alt='thumbnail'
                className={`${sm  ? 'w-[40px] h-[40px]' : 'w-[60px] h-[60px]'} rounded-sm`}
            />
            <div className='flex flex-col'>
                <span className='text-md font-semibold'>
                    {data?.name?.length > 23 ? `${data?.name?.slice(0, 23)}...` : data?.name}
                </span>
                <span className={`text-xs ${sm ? 'text-gray-300' : 'text-gray-500'}`}>{data?.singers[0]?.name}</span>
                { !order && time && <span className='text-xs text-gray-500'>
                    {moment(data?.released_at).fromNow()}
                    </span>
                }
            </div>
        </div>
        { percent && <span className='text-lg font-bold'>
            {percent}%
        </span> }
    </div>
  )
}

export default memo(NewReleaseItem)