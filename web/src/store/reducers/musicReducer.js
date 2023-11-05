import actionTypes from "../actions/actionTypes";

const initState = {
    curSongId: null,
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