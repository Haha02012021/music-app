import React, { useEffect, useState } from 'react';
import * as apis from '../../apis';
import icons from '../../utils/icons';
import { toast } from 'react-toastify';

const { BsPlusLg, IoIosCloseCircleOutline, AiOutlineDelete, CiEdit } = icons;

const CreateGenre = () => {
    const [pageId, setPageId] = useState(1);
    const [deleteId, setDeleteId] = useState(0);
    const [data, setData] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await apis.apiGetAllGenres(pageId);
            console.log(response);
            setData(response?.data?.data?.data);
            setLastPage(response?.data?.data?.last_page);
        }
        fetchData();
    }, [pageId, deleteId])

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
        const createGenre = async () => {
            const res = await apis.apiCreateGenre(formData);
            console.log(res);
            if (res?.data?.success === true) {
                setIsOpen(false);
                toast.warn(res?.success?.message);
            }
        }
       createGenre();
    }

    const handleDelete = (e, item) => {
        e.stopPropagation();
        const deleteModel = async () => {
          const res = await apis.apiDelete('genre', item?.id);
          if (res?.data?.success === true) {
            toast.success(res?.data?.message);
            if (data?.length === 1) setPageId(pageId - 1);
            else setDeleteId(item?.id);
          }
        }
        deleteModel();
      }

    return (
        <div className='relative flex flex-col gap-7'>
            <div className='flex justify-between items-center'>
                <span className='text-[40px] font-semibold'>Thể loại</span>
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
                    <label htmlFor="name" className='text-base font-semibold'>Tên thể loại:</label>
                    <input type="text" id="name" name="name" onChange={handleInputChange} 
                    className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                    />  
                    <label htmlFor="title" className='text-base font-semibold'>Tiêu đề:</label>
                    <input type="text" id="title" name="title" onChange={handleInputChange} 
                    className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
                    />
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
                        <th className="py-2 px-4 border-b">Thể loại</th>
                        <th className="py-2 px-4 border-b">Số album</th>
                        <th className="py-2 px-4 border-b">Số bài hát</th>
                        <th className="py-2 px-4 border-b">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                        {data?.map(item => (
                            <tr key={item?.id}>
                                <td className="py-2 px-4 border-b text-center">{item?.id}</td>
                                <td className="py-2 px-4 border-b text-center">{item?.title}</td>
                                <td className="py-2 px-4 border-b text-center">{item?.albums_count}</td>
                                <td className="py-2 px-4 border-b text-center">{item?.songs_count}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className='w-full flex gap-7 justify-center items-center cursor-pointer'>
                                        <CiEdit size={16}/>
                                        <AiOutlineDelete size={16} onClick={(event) => handleDelete(event, item)} />
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

export default CreateGenre