import axios from '../axios';

export const getTop100 = () => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/album/top-100',
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

export const getTopSinger = () => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/singer/top',
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

export const getAlbumTop = () => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/album/top',
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

export const getNewRelease = (id) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios ({
            url: '/song/lastest',
            method: 'get',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'application/json',
            },
            params: {isVietNamese: id},
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})