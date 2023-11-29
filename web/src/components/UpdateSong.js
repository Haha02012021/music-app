import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as apis from '../apis';
import { toast } from 'react-toastify';
import icons from '../utils/icons';
import { Dropdown } from '../components';
import moment from 'moment';

const { IoIosCloseCircleOutline } = icons;

const UpdateSong = ({ setIsUpdate, songId, setUpdateId }) => {

    const [singerPage, setSingerPage] = useState(1);
    const [lastSingerPage, setLastSingerPage] = useState(1);
    const [singerData, setSingerData] = useState([]);
    const [singers, setSingers] = useState([]);
    const [genrePage, setGenrePage] = useState(1);
    const [lastGenrePage, setLastGenrePage] = useState(1);
    const [genreData, setGenreData] = useState([]);
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({});
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [songData, setSongData] = useState({});
    const [singerIds, setSingerIds] = useState([]);
    const [singerNames, setSingerNames] = useState([]);
    const [genreIds, setGenreIds] = useState([]);
    const [genreNames, setGenreNames] = useState([]);


    useEffect(() => {
        const fetchSong = async () => {
            const res = await apis.apiGetSong(songId);
            console.log(res);
            setSongData(res?.data?.data);
            const singerId = [];
            const singerName = []
            res?.data?.data?.singers?.map(item => {
                singerId.push(item?.id);
                singerName.push(item?.name);
            });
            setSingerIds(singerId);
            setSingerNames(singerName);
            
            const genreId = [];
            const genreName = []
            res?.data?.data?.genres?.map(item => {
                genreId.push(item?.id);
                genreName.push(item?.name);
            });
            setGenreIds(genreId);
            setGenreNames(genreName);
        }
        fetchSong();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.apiGetAllGenres(genrePage);
            console.log(response);
            setGenreData(response?.data?.data?.data);
            setLastGenrePage(response?.data?.data?.last_page);
        }
        fetchData();
    }, [genrePage])

    useEffect(() => {
        const fetchData = async() => {
            const res = await apis.apiGetAllSingers(singerPage);
            setSingerData(res?.data?.data?.data);
            setLastSingerPage(res?.data?.data?.last_page);
        }
        fetchData();
    }, [singerPage])

    useEffect(() => {
        if (selectedAudio !== null) {
            setFormData({
                ...formData,
                audio: selectedAudio,
            })
        }
        
    }, [selectedAudio])
     // Xử lý khi người dùng chọn một file
     const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Kiểm tra nếu file được chọn
        if (file) {
            setSelectedImage(file);
            setFormData({
                ...formData,
                thumbnail: file,
            })
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        // Xử lý các tệp tin đã chấp nhận ở đây
        console.log('Accepted files:', acceptedFiles?.[0]);
        setSelectedAudio(acceptedFiles?.[0]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'audio/*', // Chỉ chấp nhận các tệp âm thanh
    });

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
        data.append('id', songId);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        singers.forEach((item, index) => {
            data.append(`singer_ids[${index}]`, item);
          });
        genres.forEach((item, index) => {
        data.append(`genre_ids[${index}]`, item);
        });
        apis.apiUpdateSong(data)
        .then(response => {
            console.log('Response from server:', response.data);
            setIsUpdate(false);
            setUpdateId(songId);
            toast.success(response?.data?.message);
        })
        .catch(error => {
            console.error('Error creating song:', error);
        });
    }
    console.log(formData);

    return (
        <div className='absolute w-full pb-36 bg-gray-400'>
            <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                onClick={() => setIsUpdate(false)}
            >
                <IoIosCloseCircleOutline size={24} />
            </span>
            <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                <label htmlFor="name" className='text-base font-semibold'>Tên bài hát</label>
                <input type="text" id="name" name="name" onChange={handleInputChange} defaultValue={songData?.name}
                    className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />
                <div className='flex justify-between items-center'>
                <div className='w-[48%] flex flex-col'>
                <label htmlFor="singers" className='text-base font-semibold'>Danh sách ca sĩ:</label>
                <Dropdown data={singerData} setSongs={setSingers} setSongPageId={setSingerPage} pageId={singerPage} 
                    lastPage={lastSingerPage} songNames={singerNames} songIds={singerIds}
                />
                </div>
                <div className='w-[48%] flex flex-col'>
                <label htmlFor="genres" className='text-base font-semibold'>Danh sách thể loại:</label>
                <Dropdown data={genreData} setSongs={setGenres} setSongPageId={setGenrePage} pageId={genrePage} 
                    lastPage={lastGenrePage} songNames={genreNames} songIds={genreIds}
                />
                </div>
                </div>
                <label htmlFor="lyric" className='text-base font-semibold'>Lời bài hát:</label>
                <textarea id="lyric" name="lyric" onChange={handleInputChange} defaultValue={songData?.lyric}
                    className='p-2 border-gray-300 h-[100px] border-[1px] rounded-sm mx-5'
                />
                <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                <div>
                    <img src={selectedImage ? URL.createObjectURL(selectedImage) : songData?.thumbnail} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
                </div>
                <div {...getRootProps()} className="w-full flex flex-col items-start border-dashed border-2 p-4 rounded-md text-center cursor-pointer">
                    <input {...getInputProps()} className='w-[80%]' />
                    <p>Kéo và thả file âm thanh hoặc nhấp để chọn.</p>
                    {selectedAudio && (
                        <div className='w-full h-[75px] rounded-lg py-2 px-4 flex gap-7 border-[2px] border-black text-sm mt-5'>
                            <span className='text-base font-semibold'>Thông tin file âm thanh</span>
                            <span>
                                <p>File Name: {selectedAudio.name}</p>
                                <p>File Size: {Math.round(selectedAudio.size / 1024)} KB</p>
                                <p>Type: {selectedAudio.type}</p>
                            </span>
                        </div>
                    )}
                </div>
                <div className='flex flex-row-reverse mr-5'>
                    <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateSong