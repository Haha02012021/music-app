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

export const apiGetTopNewReleaseSongs = () => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `/song/top`,
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGenre = (pid) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `/genre/all`,
            method: 'get',
            params: {page: pid}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const apiGetGenreAlbum = (gid) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `album/genre/${gid}`,
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

