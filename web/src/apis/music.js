import axios from '../axios';

export const apiGetSong = (songId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: `/song/${songId}`,
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

export const apiGetDetailPlaylist = (pid) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: `/album/${pid}`,
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

export const apiGetTopNewReleaseSongs = () => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: `/song/top`,
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

export const apiGenre = (pid) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: `/genre/all`,
            method: 'get',
            params: {page: pid},
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

export const apiGetGenreAlbum = (gid) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: `album/genre/${gid}`,
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

