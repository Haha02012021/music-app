import axios from "../axios";

export const apiGetAllSingers = (pageId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: '/singer/all',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {page: pageId}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiCreateSinger = (formData) => new Promise(async (resolve, reject) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const response = await axios.post(`/singer/create`, formData, config);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAllGenres = (pageId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: '/genre/all',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {page: pageId}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiCreateGenre = (formData) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: '/genre/create',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            },
            data: {
                'name': formData?.name,
                'title': formData?.title,
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetAllAlbums = (pageId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: '/albums',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {page: pageId}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetAllSongs = (pageId, limit) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: '/songs',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                limit: limit,
                page: pageId,
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiCreateAlbum = (formData) => new Promise(async (resolve, reject) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const response = await axios.post(`/album/create`, formData, config);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });