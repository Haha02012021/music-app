import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';

const CreateSong = () => {
    const [pageId, setPageId] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const res = await apis.apiGetAllSongs(pageId, 10);
            console.log(res);
        }
        fetchData();
    }, [pageId]);

    return (
        <div>CreateSong</div>
    )
}

export default CreateSong