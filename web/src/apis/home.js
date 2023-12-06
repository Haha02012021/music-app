import axios from '../axios';

export const getTop100 = (onlyOutstanding) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/album/top-100',
            method: 'get',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'application/json',
            },
            params: {onlyOutstanding: onlyOutstanding ? true : ''}
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const getTopSinger = (limitSinger) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/singer/top',
            method: 'get',
            params: {limit: limitSinger ? limitSinger : ''},
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

export const getAlbumTop = (limitAlbum) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/album/top',
            method: 'get',
            params: {
                limit: limitAlbum ? limitAlbum : ''
            },
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

export const getNewRelease = (id, limitSong) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/song/lastest',
            method: 'get',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'application/json',
            },
            params: {
                isVietNamese: id,
                limit: limitSong ? limitSong : '',
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})