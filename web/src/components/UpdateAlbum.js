import { React, useEffect, useState } from 'react';
import * as apis from '../apis';
import icons from '../utils/icons';
import { toast } from 'react-toastify';
import Dropdown from './Dropdown';

const { IoIosCloseCircleOutline } = icons;

const UpdateAlbum = ({ setIsUpdate, albumId, setUpdateId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [songPageId, setSongPageId] = useState(1);
    const [lastSongPage, setLastSongPage] = useState(1);
    const [nameSongs, setNameSongs] = useState([]);
    const [songs, setSongs] = useState([]);
    const [allSongs, setAllSongs] = useState([]);
    const [albumData, setAlbumData] = useState([]);

    useEffect(() => {
        const fetchSongData = async () => {
            const res = await apis.apiGetAllSongs(songPageId, 20);
            setAllSongs(res?.data?.data?.data);
            setLastSongPage(res?.data?.data?.last_page);
        }
        fetchSongData();
    }, [songPageId])

    useEffect(() => {
        const fetchAlbum = async () => {
            const res = await apis.apiGetDetailPlaylist(albumId);
            console.log(res);
            setAlbumData(res?.data?.data);
            const albumSongs = [];
            const songsName = []
            res?.data?.data?.songs?.map(item => {
                albumSongs.push(item?.id);
                songsName.push(item?.name);
            });
            setSongs(albumSongs);
            setNameSongs(songsName);

        }
        fetchAlbum();
    }, [])


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
            setFormData({
                ...formData,
                thumbnail: file,
            })
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        data.append('id', albumData?.id);
        songs.forEach((item, index) => {
            data.append(`song_ids[${index}]`, item);
        });

        apis.apiUpdateAlbum(data)
            .then(response => {
                console.log('Response from server:', response.data);
                setIsUpdate(false);
                setUpdateId(albumData?.id);
                toast.success(response?.data?.message);
            })
            .catch(error => {
                console.error('Error creating song:', error);
            });

    }
    return (
        <div className='absolute w-full pb-36 bg-gray-400'>
            <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                onClick={() => setIsUpdate(false)}
            >
                <IoIosCloseCircleOutline size={24} />
            </span>
            <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                <label htmlFor="title" className='text-base font-semibold'>Tên Album:</label>
                <input type="text" id="title" name="title" onChange={handleInputChange} defaultValue={albumData?.title}
                    className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />
                <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
                <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                <div>
                    <img src={selectedImage ? URL.createObjectURL(selectedImage) : albumData?.thumbnail} alt="Preview"
                        className='w-[200px] h-[200px] rounded-md' />
                </div>
                <label htmlFor="song_ids" className='text-base font-semibold'>Danh sách bài hát:</label>
                <Dropdown setSongs={setSongs} data={allSongs} setSongPageId={setSongPageId}
                    pageId={songPageId} lastPage={lastSongPage} songNames={nameSongs} songIds={songs}
                />
                <label htmlFor="description" className='text-base font-semibold'>Lời tựa:</label>
                <textarea id="description" name="description" onChange={handleInputChange} defaultValue={albumData?.description}
                    className='p-2 border-gray-300 h-[200px] border-[1px] rounded-sm mx-5'
                />
                <div className='flex flex-row-reverse mr-5'>
                    <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateAlbum