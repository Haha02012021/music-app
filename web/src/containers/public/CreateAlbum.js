import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';

const CreateAlbum = () => {

    const [pageId, setPageId] = useState(1);
    const [data, setData] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await apis.apiGetAllAlbums(pageId);
            console.log(res);
        }
        fetchData();
    }, [pageId])

    return (
        <div>CreateAlbum</div>
    )
}

export default CreateAlbum