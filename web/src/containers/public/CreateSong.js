import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as apis from '../../apis';
import * as actions from '../../store/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import icons from '../../utils/icons';
import { Dropdown } from '../../components';
import moment from 'moment';

const { BsPlusLg, IoIosCloseCircleOutline } = icons;

const songsPerPage = 20;

const CreateSong = () => {
    const [pageId, setPageId] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [singerPage, setSingerPage] = useState(1);
    const [lastSingerPage, setLastSingerPage] = useState(1);
    const [singerData, setSingerData] = useState([]);
    const [singers, setSingers] = useState([]);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async() => {
            const res = await apis.apiGetAllSingers(singerPage);
            setSingerData(res?.data?.data?.data);
            setLastSingerPage(res?.data?.data?.last_page);
        }
        fetchData();
    }, [singerPage])

    useEffect(() => {
        const fetchData = async () => {
            const res = await apis.apiGetAllSongs(pageId, songsPerPage);
            if (res?.data?.success === false) {
                dispatch(actions.getLogin(false));
                toast.warn(res?.data?.message);
            } else {
                setData(res?.data?.data?.data);
                setLastPage(res?.data?.data?.last_page);
            }
        }
        fetchData();
    }, [pageId]);

    useEffect(() => {
        const released_at = moment().format("YYYY-MM-DD");
        //console.log(released_at);
        setFormData({
            ...formData,
            audio: selectedAudio,
            released_at: released_at,
        })
        
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

    const handleChangePageId = (e) => {
        setPageId(e.target.value);
    }

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
       // console.log(formData);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        singers.forEach((item, index) => {
            data.append(`singer_ids[${index}]`, item);
          });
        apis.apiCreateSong(data)
        .then(response => {
            console.log('Response from server:', response.data);
            setIsOpen(false);
            toast.success(response?.data?.message);
        })
        .catch(error => {
            console.error('Error creating song:', error);
        });
    }

    return (
        <div className='mb-36 relative flex flex-col gap-7'>
            <div className='flex justify-between items-center'>
                <span className='text-[40px] font-semibold'>Bài hát</span>
                <span className='mr-5 p-2 rounded-full bg-gray-300 cursor-pointer'
                    onClick={() => setIsOpen(true)}
                >
                    <BsPlusLg />
                </span>
            </div>
            {isOpen && 
            <div className='absolute w-full pb-36 bg-gray-400'>
                <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                        onClick={() => setIsOpen(false)}
                >
                    <IoIosCloseCircleOutline size={24} />
                </span>
                <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                    <label htmlFor="name" className='text-base font-semibold'>Tên bài hát</label>
                    <input type="text" id="name" name="name" onChange={handleInputChange} 
                        className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                    />  
                    <label htmlFor="singers" className='text-base font-semibold'>Danh sách ca sĩ:</label>
                    <Dropdown data={singerData} setSongs={setSingers} setSongPageId={setSingerPage} pageId={singerPage} lastPage={lastSingerPage} />
                    <label htmlFor="lyric" className='text-base font-semibold'>Lời tựa:</label>
                    <textarea id="lyric" name="lyric" onChange={handleInputChange} 
                        className='p-2 border-gray-300 h-[100px] border-[1px] rounded-sm mx-5'
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
                    {selectedImage && (
                        <div>
                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
                        </div>
                    )}
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
            </div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Tên bài hát</th>
                            <th className="py-2 px-4 border-b">Tên ca sĩ</th>
                            <th className="py-2 px-4 border-b">Ảnh bìa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map(item => (
                            <tr key={item?.id}>
                                <td className="py-2 px-4 border-b text-center">{item?.id}</td>
                                <td className="py-2 px-4 border-b text-center">{item?.name}</td>
                                <td className={`py-2 px-4 border-b text-center ${item?.singers?.length === 0 && 'text-gray-400'}`}>
                                    {item?.singers?.length > 0 ? item?.singers?.map((singer, index) => (index > 0 ? ', ' : '') + singer?.name) : 'Chưa có thông tin ca sĩ'}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <img src={item?.thumbnail} alt='thumbnail' className='w-[80px] h[80px]'/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex flex-row-reverse'>
                <div className='flex gap-7'>
                <span className={`py-2 px-8 ${pageId > 1 ? 'bg-[#9431C6] cursor-pointer text-white' : 'bg-[#8B668B] text-gray-600'} rounded-md `}
                    onClick={() => {pageId > 1 && setPageId(pageId - 1)}}
                >
                    Trang trước
                </span>
                <div className='flex justify-center items-center gap-2'>
                    <input type='text' value={pageId} onChange={handleChangePageId} className='w-[50px] p-2 border border-gray-500'/>
                    <span className='text-xl'>/ {lastPage}</span>
                </div>
                <span className={`py-2 px-8 ${pageId < lastPage ? 'bg-[#9431C6] cursor-pointer' : 'bg-[#8B668B] text-gray-600'} text-white rounded-md `}
                    onClick={() => {pageId < lastPage && setPageId(pageId + 1)}}
                >
                    Trang sau
                </span>
                </div>
            </div>
        </div>
    )
}

export default CreateSong