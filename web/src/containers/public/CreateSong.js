import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';
import * as actions from '../../store/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const CreateSong = () => {
    const [pageId, setPageId] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const res = await apis.apiGetAllSongs(pageId, 10);
            console.log(res);
            if (res?.data?.success === false) {
                dispatch(actions.getLogin(false));
                toast.warn(res?.data?.message);
            }
        }
        fetchData();
    }, [pageId]);

    return (
        <div>
            
        </div>
    )
}

export default CreateSong