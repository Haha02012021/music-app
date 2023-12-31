import axios from "../axios";

export const apiGetAllSingers = (pageId) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: '/singer/all',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: { page: pageId }
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

export const apiGetAllGenres = (pageId) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: '/genre/all',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: { page: pageId }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiCreateGenre = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
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

export const apiGetAllAlbums = (pageId) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: '/albums',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: { page: pageId }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetAllSongs = (pageId, limit) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
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

export const apiDelete = (model, id) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/${model}/${id}`,
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiUpdateSinger = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axios.post(`/singer/update`, formData, config);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiUpdateGenre = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: 'genre/update',
            method: 'put',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                'id': formData?.id,
                'name': formData?.name,
                'title': formData?.title,
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiUpdateAlbum = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axios.post(`/album/update`, formData, config);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiUpdateSong = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axios.post(`/song/update`, formData, config);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});