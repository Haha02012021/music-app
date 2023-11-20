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