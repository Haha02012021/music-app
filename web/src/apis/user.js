import axios from '../axios';

export const apiGetInfo = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: '/auth/user',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetLatestListenedSong = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/action/listen/lastest-song`,
            method: 'get',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'application/json',
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiListenMusic = (songId, album_id) => new Promise(async (resolve, reject) => {
    try {
        if (album_id) {
            const response = await axios({
                url: '/action/listen',
                method: 'post',
                data: {
                    'song_id': songId,
                    'album_id': album_id
                }
            });
            resolve(response);
        } else {
            const response = await axios({
                url: '/action/listen',
                method: 'post',
                data: {
                    'song_id': songId,
                }
            });
            resolve(response);
        }
    } catch (error) {
        reject(error);
    }
})

export const apiFollowSinger = (sId) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/follow/singer/${sId}`,
            method: 'post',
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

export const apiLikeSong = (sId, type) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/action/like`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                'item_id': sId,
                'item': type,
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetLikedAlbums = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/action/like/albums`,
            method: 'get',
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

export const apiGetLikedSongs = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/action/like/songs`,
            method: 'get',
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

export const apiCreatePlaylist = (title) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: '/playlist/create',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                'title': title
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetPlaylist = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/playlist/all`,
            method: 'get',
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

export const apiCreateSong = (formData) => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axios.post(`/song/create`, formData, config);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});


export const apiGetUploadedSongs = () => new Promise(async (resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios({
            url: `/song/uploaded`,
            method: 'get',
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

export const apiSearch = (searchText) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            url: '/search',
            method: 'get',
            params: {keyword: searchText}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})