import React, { useEffect, useState } from 'react';
import * as apis from '../../../apis';
import icons from '../../../utils/icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Dropdown, ProgressBarLoading, TriangleLoading, UpdateAlbum } from '../../../components';

const { BsPlusLg, IoIosCloseCircleOutline, AiOutlineDelete, CiEdit } = icons;

const CreateAlbum = () => {

  const [loading, setLoading] = useState();
  const [loadingSong, setLoadingSong] = useState();
  const [createLoading, setCreateLoading] = useState();
  const [pageId, setPageId] = useState(1);
  const [deleteItem, setDeleteItem] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [updateId, setUpdateId] = useState(0);
  const [songPageId, setSongPageId] = useState(1);
  const [lastSongPage, setLastSongPage] = useState(1);
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateAlbumId, setUpdateAlbumId] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongData = async () => {
      setLoadingSong(true);
      const res = await apis.apiGetAllSongs(songPageId, 20);
      setLoadingSong(false);
      setAllSongs(res?.data?.data?.data);
      setLastSongPage(res?.data?.data?.last_page);
    }
    fetchSongData();
  }, [songPageId])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await apis.apiGetAllAlbums(pageId);
      setLoading(false);
      setLastPage(res?.data?.data?.last_page);
      setData(res?.data?.data?.data);
    }
    fetchData();
  }, [pageId, deleteId, updateId])

  const handleChangePageId = (e) => {
    if (e.key === 'Enter') {
      const newId = e.target.value < 1 ? 1 : e.target.value > lastPage ? lastPage : e.target.value;
      setPageId(newId);
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
    songs.forEach((item, index) => {
      data.append(`song_ids[${index}]`, item);
    });
    setCreateLoading(true);
    apis.apiCreateAlbum(data)
      .then(response => {
        console.log('Response from server:', response.data);
        setIsOpen(false);
        setCreateLoading(false);
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
      const res = await apis.apiDelete('album', item?.id);
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        if (data?.length === 1) setPageId(pageId - 1);
        else setDeleteId(item?.id);
      }
    }
    deleteModel();
  }

  return (
    <div className='w-full mb-36 relative'>
      {loading && <div className='absolute bg-white right-0 left-0 top-0 bottom-0 z-20 ml-[500px] mt-[200px]'>
        <TriangleLoading />
      </div>}
      {!loading && <div className='relative w-full'>
        <div className='flex justify-between items-center'>
          <span className='text-[40px] font-semibold'>Album</span>
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
            <form className='w-[75%] bg-white rounded-md flex flex-col justify-start p-6 gap-5 mx-auto' onSubmit={handleSubmit}>
              <label htmlFor="title" className='text-base font-semibold'>Tên Album:</label>
              <input type="text" id="title" name="title" onChange={handleInputChange}
                className='p-2 h-[32px] w-[50%] border-gray-300 border-[2px] rounded-sm'
              />
              <label htmlFor="thumbnail" className='text-base font-semibold'>Ảnh: </label>
              <input type="file" accept="image/*" onChange={handleImageChange} id="thumbnail" name="thumbnail" />
              {selectedImage && (
                <div>
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview"
                    className='w-[200px] h-[200px] rounded-md' />
                </div>
              )}
              <label htmlFor="song_ids" className='text-base font-semibold'>Danh sách bài hát:</label>
              <Dropdown setSongs={setSongs} data={allSongs} setSongPageId={setSongPageId}
                pageId={songPageId} lastPage={lastSongPage} loading={loadingSong}
              />
              <label htmlFor="description" className='text-base font-semibold'>Lời tựa:</label>
              <textarea id="description" name="description" onChange={handleInputChange}
                className='p-2 border-gray-300 h-[150px] border-[1px] rounded-md'
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
                const link = item?.title?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-');
                navigate(`/album/${link}/${item?.id}`)
              }}
            >
              <img src={item?.thumbnail} alt='thumbnail' className='rounded-full w-[150px]'></img>
              <span className='text-lg font-semibold'>
                {item?.title?.length > 18 ? `${item?.title?.slice(0, 18)}...` : item?.title}
              </span>
              <span className='text-sm text-gray-500'>{item?.songs_count} bài hát</span>
              <span className='flex justify-between w-[60%]'>
                <CiEdit size={16} onClick={(event) => {
                  event.stopPropagation();
                  setIsUpdate(true);
                  setUpdateAlbumId(item?.id);
                }} />
                <AiOutlineDelete size={16} onClick={(event) => {
                  event.stopPropagation();
                  setOpenPopup(true);
                  setDeleteItem(item);
                }} />
              </span>
            </div>
          ))}
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
        {isUpdate && <div className='absolute top-0 right-0 left-0 bottom-0'>
          <UpdateAlbum setIsUpdate={setIsUpdate} albumId={updateAlbumId} setUpdateId={setUpdateId} />
        </div>}
      </div>}
      {openPopup && <div className='absolute bottom-0 top-0 right-0 left-0 h-screen z-20 rounded-lg bg-overlay-80 flex items-center justify-center'>
        <div className='w-[280px] h-[120px] border bg-white rounded-md flex flex-col gap-4 p-4'>
          <span>Bạn có chắc chắn muốn xóa album này ?</span>
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

export default CreateAlbum