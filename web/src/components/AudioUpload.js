import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as apis from '../apis';
import icons from '../utils/icons';
import moment from 'moment';
import { toast } from 'react-toastify';
import defaultThumbnail from '../assets/songDefaultThumbnail.jpg';

const { IoIosCloseCircleOutline } = icons;

const AudioUpload = ({setIsCreate, setAddSongLoad}) => {

    const [formData, setFormData] = useState({});
    const [selectedAudio, setSelectedAudio] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

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
        console.log(e);
        setFormData({
        ...formData,
        [name]: value,
        })
    }

    useEffect(() => {
        const released_at = moment().format("YYYY-MM-DD");
        //console.log(released_at);
        setFormData({
            ...formData,
            audio: selectedAudio,
            released_at: released_at,
        })
        
    }, [selectedAudio])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
       // console.log(formData);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        setAddSongLoad(true);
        apis.apiCreateSong(data)
        .then(response => {
            console.log('Response from server:', response.data);
            setIsCreate(false);
            setAddSongLoad(false);
            toast.success(response?.data?.message);
        })
        .catch(error => {
            console.error('Error creating song:', error);
        });
    }

    return (
        <div className='w-full bg-gray-200 p-3 rounded-2xl'>
            <span className='w-full flex flex-row-reverse cursor-pointer'
                onClick={() => setIsCreate(false)}
            >
                <IoIosCloseCircleOutline size={24} />
            </span>
            <form onSubmit={handleSubmit} className='w-[80%] rounded-2xl flex flex-col gap-4 my-10 p-5 mx-auto text-base bg-white'>
                <label htmlFor="name" className='text-base font-semibold'>Tên bài hát:</label>
                <input type="text" id="name" name="name" onChange={handleInputChange} 
                className='p-1 border-gray-300 border-[2px] rounded-sm mx-5'
                />  
                <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
                <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                {selectedImage && (
                    <div>
                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
                    </div>
                )}
                <div {...getRootProps()} className="w-full flex flex-col items-start border-dashed border-2 p-4 rounded-md text-center">
                    <input {...getInputProps()} className='w-[80%]' />
                    <p className='cursor-pointer'>Kéo và thả file âm thanh hoặc nhấp để chọn.</p>
                    {selectedAudio && (
                        <div className='w-[50%] h-[75px] rounded-lg py-2 px-4 flex items-center justify-between gap-7 bg-purple-100 mt-5'>
                            <div className='flex items-center gap-7'>
                                <img src={defaultThumbnail} alt='defaultThumbnail' className='w-[60px] h-[60px] rounded-full'/>
                                <span className='flex flex-col'>
                                    <span className='text-sm font-semibold'>{selectedAudio.name}</span>
                                    <span className='text-xs text-gray-400'>{Math.round(selectedAudio.size / 1024)} KB</span>
                                </span>
                            </div>
                            <span className='cursor-pointer' onClick={(event) => {
                                event.stopPropagation();
                                setSelectedAudio(null)
                            }}>
                                <IoIosCloseCircleOutline size={16}/>
                            </span>
                        </div>
                    )}
                </div>
                <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>

            </form>
        </div>
    );
};

export default AudioUpload;
