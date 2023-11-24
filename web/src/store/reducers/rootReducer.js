import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import musicReducer from "./musicReducer";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import userReducer from "./userReducer";

const commonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
}

const musicConfig = {
    ...commonConfig,
    key: 'music',
    whiteList: ['curSongId', 'curSongData', 'curPlaylistId']
}

const userConfig = {
    ...commonConfig,
    key: 'user',
    whiteList: ['login', 'info', 'followSingers'],
}

const rootReducer = combineReducers({
    music: persistReducer(musicConfig, musicReducer),
    user: persistReducer(userConfig, userReducer),
})

export default rootReducer;