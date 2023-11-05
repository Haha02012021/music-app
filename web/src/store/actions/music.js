import actionTypes from "./actionTypes";

export const setCurSongId = (songId) => ({
    type: actionTypes.SET_CUR_SONG_ID,
    songId,
});

export const playSong = (flag) => ({
    type: actionTypes.PLAY_SONG,
    flag,
});

export const setSong = (songs) => ({
    type: actionTypes.SET_SONGS,
    songs,
});

export const getSongId = (id) => ({
    type: actionTypes.SONG_ID,
    id,
})