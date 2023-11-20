import axios from '../axios';

export const getTop100 = () => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/album/top-100',
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const getTopSinger = () => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/singer/top',
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const getAlbumTop = () => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/album/top',
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})

export const getNewRelease = (id) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/song/lastest',
            method: 'get',
            params: {isVietNamese: id},
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})