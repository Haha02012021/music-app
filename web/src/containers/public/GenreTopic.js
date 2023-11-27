import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';
import { HomeSection } from '../../components';

const GenreTopic = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.apiGenre();
            setData(response?.data?.data?.data);
        }
        fetchData();
    }, [])

    return (
        <div>
            {data?.map(item => (
                <HomeSection key={item?.id} name={item?.name} gid={item?.id} />
            ))}
        </div>
    )
}

export default GenreTopic