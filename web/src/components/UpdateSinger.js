import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import * as apis from '../apis'
import icons from '../utils/icons';
import ProgressBarLoading from './LoadingEffect/ProgressBarLoading';

const { IoIosCloseCircleOutline } = icons;

const UpdateSinger = ({ setIsUpdate, singerId, setUpdateId }) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [singerData, setSingerData] = useState({});
    const [loading, setLoading] = useState();

    useEffect(() => {
        const fetchSinger = async () => {
            setLoading(true);
            const res = await apis.apiGetSingerById(singerId);
            setSingerData(res?.data?.data);
            setLoading(false);
        }
        fetchSinger();
    }, []);
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
        data.append('id', singerData?.id);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        setLoading(true);
        apis.apiUpdateSinger(data)
            .then(response => {
                console.log('Response from server:', response.data);
                setIsUpdate(false);
                setUpdateId(singerData?.id);
                setLoading(false);
                toast.success(response?.data?.message);
            })
            .catch(error => {
                console.error('Error creating song:', error);
            });

    }
    return (
        <div className={`relative w-full ${loading && 'h-full'} bg-gray-200 pb-36`}>
            {loading && <div className='absolute top-0 bottom-0 right-0 left-0 z-10 h-full flex justify-center items-center bg-gray-200 rounded-md'>
                <ProgressBarLoading />
            </div>}
            {!loading && <div className='w-full bg-gray-200'>
                <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                    onClick={() => setIsUpdate(false)}
                >
                    <IoIosCloseCircleOutline size={24} />
                </span>
                <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                    <label htmlFor="name" className='text-base font-semibold'>Tên ca sĩ:</label>
                    <input type="text" id="name" name="name" defaultValue={singerData?.name} onChange={handleInputChange}
                        className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                    />
                    <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                    <div>
                        <img src={selectedImage ? URL.createObjectURL(selectedImage) : singerData?.thumbnail} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
                    </div>
                    <label htmlFor="bio" className='text-base font-semibold'>Tiểu sử:</label>
                    <textarea id="bio" name="bio" defaultValue={singerData?.bio} onChange={handleInputChange}
                        className='p-2 border-gray-300 h-[200px] border-[1px] rounded-sm mx-5'
                    />
                    <div className='flex flex-row-reverse mr-5'>
                        <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
                    </div>
                </form>
            </div>}
        </div>
    )
}

export default UpdateSinger