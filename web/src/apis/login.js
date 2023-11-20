import axios from '../axios';

export const getLogin = () => new Promise (async( resolve, reject) => {
    try {
        const response = await axios ({
            url: '/login-social',
            method: 'get',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})