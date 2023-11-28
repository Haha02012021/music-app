import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apis from '../../apis';
import icons from '../../utils/icons';

const { BsPlusLg, IoIosCloseCircleOutline } = icons;

const CreateSinger = () => {

  const [pageId, setPageId] = useState(1);
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await apis.apiGetAllSingers(pageId);
      setLastPage(res?.data?.data?.last_page);
      setData(res?.data?.data?.data);
    }
    fetchData();
  }, [pageId])

  const handleChangePageId = (e) => {
    setPageId(e.target.value);
  }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
    ...formData,
    [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const createSinger = async () => {
      const res = await apis.apiCreateSinger(formData);
      console.log(res);
      if (res?.data?.success) setIsOpen(false);
    }
    createSinger();
  }
  //console.log(formData);

  return (
    <div className='relative w-full mb-36'>
      <div className='flex justify-between items-center'>
        <span className='text-[40px] font-semibold'>Ca Sĩ</span>
        <span className='mr-5 p-2 rounded-full bg-gray-300 cursor-pointer'
          onClick={() => setIsOpen(true)}
        >
          <BsPlusLg />
        </span>
      </div>
      {isOpen && 
      <div className='absolute w-full h-full bg-gray-400'>
        <span className='w-full flex flex-row-reverse cursor-pointer p-4'
                onClick={() => setIsOpen(false)}
        >
          <IoIosCloseCircleOutline size={24} />
        </span>
        <form className='w-[75%] bg-white rounded-md flex flex-col p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
          <label htmlFor="name" className='text-base font-semibold'>Tên ca sĩ:</label>
          <input type="text" id="name" name="name" onChange={handleInputChange} 
          className='p-2 border-gray-300 border-[2px] rounded-sm mx-5'
          />  
          <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
          <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
          {selectedImage && (
              <div>
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview" className='w-[200px] h-[200px] rounded-md' />
              </div>
          )}
          <label htmlFor="bio" className='text-base font-semibold'>Tiểu sử:</label>
          <textarea id="bio" name="bio" onChange={handleInputChange} 
          className='p-2 border-gray-300 h-[200px] border-[1px] rounded-sm mx-5'
          />
          <div className='flex flex-row-reverse mr-5'>
          <button type="submit" className='bg-[#9431C6] rounded-md px-4 py-2 text-white'>Submit</button>
          </div>
        </form>
      </div>}
      <div className='w-full flex flex-wrap justify-between items-center'>
        {data?.map(item => (
          <div key={item?.id} className='w-[20%] flex flex-col justify-center items-center px-4 py-6 m-5 shadow-md gap-4 rounded-md cursor-pointer'
            onClick={() => {
              const link = item?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
              navigate(`/singer/${link}/${item?.id}`)
            }}
          >
            <img src={item?.thumbnail} alt='thumbnail' className='rounded-full'></img>
            <span className='text-lg font-semibold'>{item?.name}</span>
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

export default CreateSinger