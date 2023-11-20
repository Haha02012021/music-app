import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import musicReducer from "./musicReducer";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const commonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
}

const musicConfig = {
    ...commonConfig,
    key: 'music',
    whiteList: ['curSongId', 'curSongData', 'curPlaylistId']
}

const rootReducer = combineReducers({
    music: persistReducer(musicConfig, musicReducer),
})

export default rootReducer;