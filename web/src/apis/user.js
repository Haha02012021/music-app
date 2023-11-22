import axios from '../axios';

export const apiGetLatestListenedSong = (songId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
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

export const apiListenMusic = (songId, albumId) => new Promise (async( resolve, reject) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios ({
            url: `/listen`,
            method: 'post',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'Content-Type': 'application/json',
            },
            data: {
                'song_id': songId,
                'album_id': albumId,
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
})