import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as apis from '../../../apis';
import * as actions from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import icons from '../../../utils/icons';
import { Dropdown, ProgressBarLoading, TriangleLoading, UpdateSong } from '../../../components';
import defaultThumbnail from '../../../assets/songDefaultThumbnail.jpg';
import moment from 'moment';

const { BsPlusLg, IoIosCloseCircleOutline, AiOutlineDelete, CiEdit } = icons;

const songsPerPage = 20;

const CreateSong = () => {

    const [openPopup, setOpenPopup] = useState(false);
    const [deleteItem, setDeleteItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [singerLoading, setSingerLoading] = useState(false);
    const [genreLoading, setGenreLoading] = useState(false);
    const [pageId, setPageId] = useState(1);
    const [deleteId, setDeleteId] = useState(0);
    const [updateId, setUpdateId] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [singerPage, setSingerPage] = useState(1);
    const [lastSingerPage, setLastSingerPage] = useState(1);
    const [singerData, setSingerData] = useState([]);
    const [singers, setSingers] = useState([]);
    const [genrePage, setGenrePage] = useState(1);
    const [lastGenrePage, setLastGenrePage] = useState(1);
    const [genreData, setGenreData] = useState([]);
    const [genres, setGenres] = useState([]);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [createSong, setCreateSong] = useState(false);
    const [updateItem, setUpdateItem] = useState({});
    const [formData, setFormData] = useState({});
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setSingerLoading(true);
            const res = await apis.apiGetAllSingers(singerPage);
            setSingerLoading(false);
            setSingerData(res?.data?.data?.data);
            setLastSingerPage(res?.data?.data?.last_page);
        }
        fetchData();
    }, [singerPage])

    useEffect(() => {
        const fetchData = async () => {
            setGenreLoading(true);
            const response = await apis.apiGetAllGenres(genrePage);
            setGenreLoading(false);
            console.log(response);
            setGenreData(response?.data?.data?.data);
            setLastGenrePage(response?.data?.data?.last_page);
        }
        fetchData();
    }, [genrePage])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await apis.apiGetAllSongs(pageId, songsPerPage);
            console.log(res);
            setLoading(false);
            if (res?.data?.success === false) {
                dispatch(actions.getLogin(false));
                toast.warn(res?.data?.message);
            } else {
                setData(res?.data?.data?.data);
                setLastPage(res?.data?.data?.last_page);
            }
        }
        fetchData();
    }, [pageId, deleteId, updateId, createSong]);

    useEffect(() => {
        const released_at = moment().format("YYYY-MM-DD");
        //console.log(released_at);
        setFormData({
            ...formData,
            audio: selectedAudio,
            released_at: released_at,
        })

    }, [selectedAudio])

    const handleChangePageId = (e) => {
        if (e.key === 'Enter') {
            const newId = e.target.value < 1 ? 1 : e.target.value > lastPage ? lastPage : e.target.value;
            setPageId(newId);
        }
    }

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
        // console.log(formData);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        singers.forEach((item, index) => {
            data.append(`singer_ids[${index}]`, item);
        });
        genres.forEach((item, index) => {
            data.append(`genre_ids[${index}]`, item);
        });
        setCreateLoading(true);
        apis.apiCreateSong(data)
            .then(response => {
                console.log('Response from server:', response.data);
                setIsOpen(false);
                setCreateLoading(false);
                setCreateSong(prev => !prev);
                toast.success(response?.data?.message);
            })
            .catch(error => {
                console.error('Error creating song:', error);
            });
    }

    const handleDelete = (e, item) => {
        e.stopPropagation();
        setOpenPopup(false);
        setLoading(true);
        const deleteModel = async () => {
            const res = await apis.apiDelete('song', item?.id);
            if (res?.data?.success === true) {
                toast.success(res?.data?.message);
                if (data?.length === 1) setPageId(pageId - 1);
                else setDeleteId(item?.id);
            }
        }
        deleteModel();
    }

    return (
        <div className='mb-36 relative'>
            {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
                <TriangleLoading />
            </div>}
            {!loading && <div className='relative flex flex-col gap-7'>
                <div className='flex justify-between items-center'>
                    <span className='text-[40px] font-semibold'>Bài hát</span>
                    <span className='mr-5 p-2 rounded-full bg-gray-300 cursor-pointer'
                        onClick={() => setIsOpen(true)}
                    >
                        <BsPlusLg />
                    </span>
                </div>
                {isOpen && !createLoading &&
                    <div className='absolute w-full pb-36 bg-gray-400'>
                        <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                            onClick={() => setIsOpen(false)}
                        >
                            <IoIosCloseCircleOutline size={24} />
                        </span>
                        <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                            <label htmlFor="name" className='text-base font-semibold'>Tên bài hát</label>
                            <input type="text" id="name" name="name" onChange={handleInputChange}
                                className='p-2 w-1/2 h-[32px] border-gray-300 border-[2px] rounded-sm'
                            />
                            <div className='flex justify-between items-center'>
                                <div className='w-[48%] flex flex-col'>
                                    <label htmlFor="singers" className='text-base font-semibold mb-5'>Danh sách ca sĩ:</label>
                                    <Dropdown data={singerData} setSongs={setSingers} setSongPageId={setSingerPage} pageId={singerPage}
                                        lastPage={lastSingerPage} loading={singerLoading}
                                    />
                                </div>
                                <div className='w-[48%] flex flex-col'>
                                    <label htmlFor="genres" className='text-base font-semibold mb-5'>Danh sách thể loại:</label>
                                    <Dropdown data={genreData} setSongs={setGenres} setSongPageId={setGenrePage} pageId={genrePage}
                                        lastPage={lastGenrePage} loading={genreLoading}
                                    />
                                </div>
                            </div>
                            <label htmlFor="lyric" className='text-base font-semibold'>Lời tựa:</label>
                            <textarea id="lyric" name="lyric" onChange={handleInputChange}
                                className='p-2 border-gray-300 h-[100px] border-[1px] rounded-sm'
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
                                    <div className='w-[50%] h-[75px] rounded-lg py-2 px-4 flex items-center justify-between gap-7 bg-purple-100 mt-5'>
                                        <div className='flex items-center gap-7'>
                                            <img src={defaultThumbnail} alt='defaultThumbnail' className='w-[60px] h-[60px] rounded-full' />
                                            <span className='flex flex-col'>
                                                <span className='text-sm font-semibold'>{selectedAudio.name}</span>
                                                <span className='text-xs text-gray-400'>{Math.round(selectedAudio.size / 1024)} KB</span>
                                            </span>
                                        </div>
                                        <span className='cursor-pointer' onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedAudio(null)
                                        }}>
                                            <IoIosCloseCircleOutline size={16} />
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-row-reverse mr-5'>
                                <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
                            </div>
                        </form>
                    </div>}
                {isOpen && createLoading &&
                    <div className='absolute top-0 bottom-0 right-0 left-0 z-10 pb-36 flex justify-center items-center bg-gray-200 rounded-md'>
                        <ProgressBarLoading />
                    </div>}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Tên bài hát</th>
                                <th className="py-2 px-4 border-b">Tên ca sĩ</th>
                                <th className="py-2 px-4 border-b">Ảnh bìa</th>
                                <th className="py-2 px-4 border-b">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={item?.id}>
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center">{item?.name}</td>
                                    <td className={`py-2 px-4 border-b text-center ${item?.singers?.length === 0 && 'text-gray-400'}`}>
                                        {item?.singers?.length > 0 ? item?.singers?.map((singer, index) => (index > 0 ? ', ' : '') + singer?.name) : 'Chưa có thông tin ca sĩ'}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <img src={item?.thumbnail} alt='thumbnail' className='w-[80px] h[80px]' />
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className='w-full flex gap-7 justify-center items-center cursor-pointer'>
                                            <CiEdit size={16} onClick={() => {
                                                setIsUpdate(true);
                                                setUpdateItem(item?.id);
                                            }} />
                                            <AiOutlineDelete size={16} onClick={(event) => {
                                                event.stopPropagation();
                                                setOpenPopup(true);
                                                setDeleteItem(item);
                                            }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-row-reverse'>
                    <div className='flex gap-7'>
                        <span className={`py-2 px-8 ${pageId > 1 ? 'bg-[#9431C6] cursor-pointer text-white' : 'bg-[#8B668B] text-gray-600'} rounded-md `}
                            onClick={() => { pageId > 1 && setPageId(pageId - 1) }}
                        >
                            Trang trước
                        </span>
                        <div className='flex justify-center items-center gap-2'>
                            <input type='text' defaultValue={pageId} onKeyDown={handleChangePageId} className='w-[50px] p-2 border border-gray-500' />
                            <span className='text-xl'>/ {lastPage}</span>
                        </div>
                        <span className={`py-2 px-8 ${pageId < lastPage ? 'bg-[#9431C6] cursor-pointer' : 'bg-[#8B668B] text-gray-600'} text-white rounded-md `}
                            onClick={() => { pageId < lastPage && setPageId(pageId + 1) }}
                        >
                            Trang sau
                        </span>
                    </div>
                </div>
                {isUpdate && <div className='absolute top-0 bottom-0 left-0 right-0'>
                    <UpdateSong setIsUpdate={setIsUpdate} songId={updateItem} setUpdateId={setUpdateId} />
                </div>}
            </div>}

            {openPopup && <div className='absolute bottom-0 top-0 right-0 left-0 h-screen z-20 rounded-lg bg-overlay-80 flex items-center justify-center'>
                <div className='w-[280px] h-[120px] border bg-white rounded-md flex flex-col gap-4 p-4'>
                    <span>Bạn có chắc chắn muốn xóa bài hát này ?</span>
                    <div className='flex justify-between items-center px-6 text-sm font-medium'>
                        <span onClick={() => setOpenPopup(false)} className='cursor-pointer hover:text-blue-600'>Hủy</span>
                        <span className='h-[14px] w-[2px] bg-black'></span>
                        <span className='cursor-pointer hover:text-red-600' onClick={(event) => { handleDelete(event, deleteItem) }}>Xóa</span>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default CreateSong