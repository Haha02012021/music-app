import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as apis from '../apis';

const AudioUpload = () => {

    const [formData, setFormData] = useState({});
    const [selectedAudio, setSelectedAudio] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

  // Xử lý khi người dùng chọn một file
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Kiểm tra nếu file được chọn
        if (file) {
        setSelectedImage(file);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        // Xử lý các tệp tin đã chấp nhận ở đây
        console.log('Accepted files:', acceptedFiles?.[0]);
        setSelectedAudio(acceptedFiles?.[0]);
        setFormData({
            ...formData,
            audio: acceptedFiles?.[0]
        })
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

    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        apis.apiCreateSong(data)
        .then(response => {
            console.log('Response from server:', response.data);
        })
        .catch(error => {
            console.error('Error creating song:', error);
        });
    }

    return (
        <div className='w-full bg-gray-400 p-3'>
            <form onSubmit={handleSubmit} className=' w-[80%] flex flex-col gap-4 my-10 p-5 mx-auto text-base bg-white'>
                <label htmlFor="name" className='text-base font-semibold'>Tên bài hát:</label>
                <input type="text" id="name" name="name" onChange={handleInputChange} 
                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />  
                <label htmlFor="album_id" className='text-base font-semibold'>ID Album:</label>
                <input type="text" id="album_id" name="album_id" onChange={handleInputChange} 
                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />
                <label htmlFor="singer_ids" className='text-base font-semibold'>ID Ca sĩ: </label>
                <input type="text" id="singer_ids" name="singer_ids" onChange={handleInputChange} 
                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />
                <label htmlFor="lyric" className='text-base font-semibold'>Lyric: </label>
                <input type="text" id="lyric" name="lyric" onChange={handleInputChange} 
                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                />
                <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
                <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                {selectedImage && (
                    <div>
                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className='w-[300px] h-[300px] rounded-md' />
                    </div>
                )}
                <div {...getRootProps()} className="w-full flex flex-col items-start border-dashed border-2 p-4 rounded-md text-center cursor-pointer">
                    <input {...getInputProps()} className='w-[80%]' />
                    <p>Kéo và thả file âm thanh hoặc nhấp để chọn.</p>
                    {selectedAudio && (
                        <div className='w-[70%] h-[60px] flex gap-7 border-[2px] border-black text-sm mt-5'>
                            <span className='text-base font-semibold'>Thông tin file âm thanh</span>
                            <span>
                                <p>File Name: {selectedAudio.name}</p>
                                <p>File Size: {Math.round(selectedAudio.size / 1024)} KB</p>
                                <p>Type: {selectedAudio.type}</p>
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
