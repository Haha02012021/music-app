import axios from '../axios';

export const apiGetSingerById = (sId) => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: `/singer/${sId}`,
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})