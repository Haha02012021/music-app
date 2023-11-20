import axios from '../axios';

export const apiGetSong = (songId) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `/song/${songId}`,
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetInfoSong = (songId) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/infosong',
            method: 'get',
            params: { id: songId },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetDetailPlaylist = (pid) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `/album/${pid}`,
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})