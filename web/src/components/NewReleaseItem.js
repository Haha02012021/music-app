import { React, memo} from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import * as actions from '../store/actions';
import { useDispatch } from 'react-redux';

const NewReleaseItem = ({data, id}) => {
    const dispatch = useDispatch();
  return (
    <div onClick={() => {
        dispatch(actions.setCurSongId(data?.encodeId));
        dispatch(actions.playSong(true));
        dispatch(actions.getSongId(null));
    }}
        className='w-[300px] min-[1024px]:w-[30%] flex-auto flex justify-start gap-[10px] hover:bg-main-100 p-[10px] rounded-md cursor-pointer'>
        <img src={data.thumbnail} alt='thumbnail'
            className='w-[60px] h-[60px] rounded-sm'
        />
        <div className='flex flex-col'>
            <span className='text-md font-semibold'>
                {data?.title.length > 23 ? `${data?.title.slice(0, 23)}...` : data?.title}
            </span>
            <span className='text-xs text-gray-500'>{data?.artistsNames}</span>
            <span className='text-xs text-gray-500'>
                {moment(data?.releaseDate * 1000).fromNow()}
            </span>
        </div>
    </div>
  )
}

export default memo(NewReleaseItem)