import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apis from '../../../apis';
import icons from '../../../utils/icons';
import { toast } from 'react-toastify';
import { ProgressBarLoading, TriangleLoading, UpdateSinger } from '../../../components';

const { BsPlusLg, IoIosCloseCircleOutline, AiOutlineDelete, CiEdit } = icons;

const CreateSinger = () => {

  const [createLoading, setCreateLoading] = useState();
  const [loading, setLoading] = useState();
  const [pageId, setPageId] = useState(1);
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [deleteId, setDeleteId] = useState(0);
  const [createId, setCreateId] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [deleteItem, setDeleteItem] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateSingerId, setUpdateSingerId] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await apis.apiGetAllSingers(pageId);
      setLoading(false);
      setLastPage(res?.data?.data?.last_page);
      setData(res?.data?.data?.data);
    }
    fetchData();
  }, [pageId, deleteId, updateId, createId])

  const handleChangePageId = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value < 1) setPageId(1);
      else if (e.target.value > lastPage) setPageId(lastPage);
      else setPageId(e.target.value);
    }
  }

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
    setCreateLoading(true);
    apis.apiCreateSinger(data)
    .then(response => {
        console.log('Response from server:', response.data);
        setIsOpen(false);
        setCreateId(prev => !prev);
        setCreateLoading(false);
        toast.success(response?.data?.message);
    })
    .catch(error => {
        setCreateLoading(false);
        toast.error('Tiểu sử quá dài')
        console.error('Error creating song:', error);
    });
    
  }
  
  const handleDelete = (e, item) => {
    e.stopPropagation();
    setOpenPopup(false);
    const deleteModel = async () => {
      setLoading(true);
      const res = await apis.apiDelete('singer', item?.id);
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        if (data?.length === 1) setPageId(pageId - 1);
        else setDeleteId(item?.id);
      }
    }
    deleteModel();
  }

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setIsUpdate(true);
    setUpdateSingerId(item?.id)
  }

  return (
    <div className='w-full mb-36 relative'>
      {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
          <TriangleLoading />
      </div>}
      {!loading && <div className='relative w-full'>
        <div className='flex justify-between items-center'>
          <span className='text-[40px] font-semibold'>Ca Sĩ</span>
          <span className='mr-5 p-2 rounded-full bg-gray-300 cursor-pointer'
            onClick={() => setIsOpen(true)}
          >
            <BsPlusLg />
          </span>
        </div>
        {isOpen && !createLoading &&
        <div className='absolute w-full pb-36 bg-gray-200'>
          <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                  onClick={() => setIsOpen(false)}
          >
            <IoIosCloseCircleOutline size={24} />
          </span>
          <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
            <label htmlFor="name" className='text-base font-semibold'>Tên ca sĩ:</label>
            <input type="text" id="name" name="name" onChange={handleInputChange} value={formData?.name}
            className='p-2 border-gray-300 border-[2px] rounded-sm h-[32px]'
            />  
            <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
            {selectedImage && (
                <div>
                    <img src={URL.createObjectURL(selectedImage)} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
                </div>
            )}
            <label htmlFor="bio" className='text-base font-semibold'>Tiểu sử:</label>
            <textarea id="bio" name="bio" onChange={handleInputChange} value={formData?.bio}
            className='p-2 border-gray-300 h-[150px] border-[1px] rounded-sm'
            />
            <div className='flex flex-row-reverse mr-5'>
            <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
            </div>
          </form>
        </div>}
        {isOpen && createLoading && 
          <div className='absolute top-0 bottom-0 right-0 left-0 z-10 pb-36 flex justify-center items-center bg-gray-200 rounded-md'>
            <ProgressBarLoading />
          </div>}
        <div className='w-full flex flex-wrap justify-start items-center gap-7'>
          {data?.map(item => (
            <div key={item?.id} className='w-[20%] flex flex-col justify-center items-center px-4 py-6 m-5 shadow-md gap-4 rounded-md cursor-pointer'
              onClick={() => {
                const link = item?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                navigate(`/singer/${link}/${item?.id}`)
              }}
            >
              <img src={item?.thumbnail} alt='thumbnail' className='rounded-full w-[150px]'></img>
              <span className='text-lg font-semibold'>
                {item?.name?.length > 18 ? `${item?.name?.slice(0, 18)}...` : item?.name}  
              </span>
              <span className='flex justify-between w-[60%]'>
                <CiEdit size={16} onClick={(event) => handleEdit(event, item)}/>
                <AiOutlineDelete size={16} onClick={(event) => {
                  event.stopPropagation();
                  setOpenPopup(true)
                  setDeleteItem(item);
                }} />
              </span>
            </div>
          ))}
        </div>
        <div className='flex flex-row-reverse'>
          <div className='flex gap-7'>
            <span className={`py-2 px-8 ${pageId > 1 ? 'bg-[#9431C6] cursor-pointer text-white' : 'bg-[#8B668B] text-gray-600'} rounded-md `}
              onClick={() => {pageId > 1 && setPageId(pageId - 1)}}
            >
              Trang trước
            </span>
            <div className='flex justify-center items-center gap-2'>
              <input type='text' defaultValue={pageId} onKeyDown={handleChangePageId} className='w-[50px] p-2 border border-gray-500'/>
              <span className='text-xl'>/ {lastPage}</span>
            </div>
            <span className={`py-2 px-8 ${pageId < lastPage ? 'bg-[#9431C6] cursor-pointer' : 'bg-[#8B668B] text-gray-600'} text-white rounded-md `}
              onClick={() => {pageId < lastPage && setPageId(pageId + 1)}}
            >
              Trang sau
            </span>
          </div>
        </div>
        {isUpdate && <div className='absolute top-0 bottom-0 left-0 right-0'>
          <UpdateSinger setIsUpdate={setIsUpdate} singerId={updateSingerId} 
            setUpdateId={setUpdateId} />
        </div>}
      </div>}
      {openPopup && <div className='absolute bottom-0 top-0 right-0 left-0 z-20 h-screen rounded-lg bg-overlay-80 flex items-center justify-center'>
        <div className='w-[280px] h-[120px] border bg-white rounded-md flex flex-col gap-4 p-4'>
          <span>Bạn có chắc chắn muốn xóa ca sĩ này ?</span>
          <div className='flex justify-between items-center px-6 text-sm font-medium'>
            <span onClick={() => setOpenPopup(false)} className='cursor-pointer hover:text-blue-600'>Hủy</span>
            <span className='h-[14px] w-[2px] bg-black'></span>
            <span className='cursor-pointer hover:text-red-600' onClick={(event) => {handleDelete(event, deleteItem)}}>Xóa</span>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default CreateSinger