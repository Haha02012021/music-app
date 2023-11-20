import actionTypes from "../actions/actionTypes";

const initState = {
    curSongId: null,
    curSongData: null,
    curPlaylistId: null,
    isPlaying: false,
    id: null,
    songs: [],
}

const musicReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_CUR_SONG_ID:
            return {
                ...state,
                curSongId: action.songId || null,
            }
        case actionTypes.SET_CUR_SONG_DATA:
            return {
                ...state,
                curSongData: action.songData || null,
            }
        case actionTypes.SET_CUR_PLAYLIST_ID:
            return {
                ...state,
                curPlaylistId: action.pid || null,
            }
        case actionTypes.PLAY_SONG:
            return {
                ...state,
                isPlaying: action.flag,
            }
        case actionTypes.SET_SONGS:
            return {
                ...state,
                songs: action.songs,
            }
        case actionTypes.SONG_ID: 
            return {
                ...state,
                id: action.id,
            }
        default:
            return state;
    }
}

export default musicReducer;