import React, { useEffect, useState } from 'react';
import * as apis from '../../../apis';
import icons from '../../../utils/icons';
import { toast } from 'react-toastify';
import { ProgressBarLoading, TriangleLoading } from '../../../components';

const { BsPlusLg, IoIosCloseCircleOutline, AiOutlineDelete, CiEdit } = icons;

const CreateGenre = () => {
    const [loading, setLoading] = useState();
    const [createLoading, setCreateLoading] = useState();
    const [pageId, setPageId] = useState(1);
    const [deleteId, setDeleteId] = useState(0);
    const [updateItem, setUpdateItem] = useState({});
    const [deleteItem, setDeleteItem] = useState({});
    const [openPopup, setOpenPopup] = useState();
    const [data, setData] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apis.apiGetAllGenres(pageId);
            console.log(response);
            setLoading(false);
            setData(response?.data?.data?.data);
            setLastPage(response?.data?.data?.last_page);
        }
        fetchData();
    }, [pageId, deleteId])

    const handleChangePageId = (e) => {
        if (e.key === 'Enter') {
            if (e.target.value < 1) setPageId(1);
            else if (e.target.value > lastPage) setPageId(lastPage);
            else setPageId(e.target.value);
        }
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
        if (isOpen) {
            const createGenre = async () => {
                setCreateLoading(true);
                const res = await apis.apiCreateGenre(formData);
                console.log(res);
                setCreateLoading(false);
                if (res?.data?.success === true) {
                    setIsOpen(false);
                    toast.success(res?.data?.message);
                }
            }
            createGenre();
        }
        if (isUpdate) {
            const updateGenre = async () => {
                setCreateLoading(true);
                const res = await apis.apiUpdateGenre(formData);
                console.log(res);
                setCreateLoading(false);
                if (res?.data?.success === true) {
                    setIsUpdate(false);
                    toast.success(res?.data?.message);
                }
            }
            updateGenre();
        }
    }

    const handleDelete = (e, item) => {
        e.stopPropagation();
        setOpenPopup(false);
        const deleteModel = async () => {
            setLoading(true);
            const res = await apis.apiDelete('genre', item?.id);
            if (res?.data?.success === true) {
                toast.success(res?.data?.message);
                if (data?.length === 1) setPageId(pageId - 1);
                else setDeleteId(item?.id);
            }
        }
        deleteModel();
    }

    console.log(formData);
    return (
        <div className='w-full relative'>
            {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
                <TriangleLoading />
            </div>}
            {!loading && <div className='relative flex flex-col gap-7'>
                <div className='flex justify-between items-center'>
                    <span className='text-[40px] font-semibold'>Thể loại</span>
                    <span className='mr-5 p-2 rounded-full bg-gray-300 cursor-pointer'
                        onClick={() => {
                            setIsOpen(true);
                            setIsUpdate(false);
                        }}
                    >
                        <BsPlusLg />
                    </span>
                </div>
                {(isOpen || isUpdate) && !createLoading &&
                    <div className='absolute w-full pb-36 bg-gray-200'>
                        <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                            onClick={() => isOpen ? setIsOpen(false) : setIsUpdate(false)}
                        >
                            <IoIosCloseCircleOutline size={24} />
                        </span>
                        <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
                            <label htmlFor="name" className='text-base font-semibold'>Tên thể loại:</label>
                            <input type="text" id="name" name="name" onChange={handleInputChange} defaultValue={isUpdate ? updateItem?.name : ''}
                                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                            />
                            <label htmlFor="title" className='text-base font-semibold'>Tiêu đề:</label>
                            <input type="text" id="title" name="title" onChange={handleInputChange} defaultValue={isUpdate ? updateItem?.title : ''}
                                className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                            />
                            <div className='flex flex-row-reverse mr-5'>
                                <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
                            </div>
                        </form>
                    </div>}
                {(isOpen || isUpdate) && createLoading && <div className='absolute top-0 bottom-0 right-0 left-0 z-10 pb-36 flex justify-center items-center bg-gray-200 rounded-md'>
                    <ProgressBarLoading />
                </div>}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Thể loại</th>
                                <th className="py-2 px-4 border-b">Số album</th>
                                <th className="py-2 px-4 border-b">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr key={item?.id}>
                                    <td className="py-2 px-4 border-b text-center">{8 * (pageId - 1) + index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center">{item?.title}</td>
                                    <td className="py-2 px-4 border-b text-center">{item?.albums_slice?.length}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <div className='w-full flex gap-7 justify-center items-center cursor-pointer'>
                                            <CiEdit size={16} onClick={() => {
                                                setIsUpdate(true);
                                                setIsOpen(false)
                                                setUpdateItem(item);
                                                setFormData({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    title: item?.title,
                                                })
                                            }} />
                                            <AiOutlineDelete size={16} onClick={(event) => {
                                                event.stopPropagation();
                                                setDeleteItem(item);
                                                setOpenPopup(true);
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
            </div>}
            {openPopup && <div className='absolute bottom-0 top-0 right-0 left-0 z-20 h-screen rounded-lg bg-overlay-80 flex items-center justify-center'>
                <div className='w-[280px] h-[120px] border bg-white rounded-md flex flex-col gap-4 p-4'>
                    <span>Bạn có chắc chắn muốn xóa thể loại này ?</span>
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

export default CreateGenre