import actionTypes from "../actions/actionTypes";

const initState = {
    login: false,
    info: {},
    followSingers: [],
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.LOGIN: 
            return {
                ...state,
                login: action.login
            }
        case actionTypes.INFO: 
            return {
                ...state,
                info: action.info || {},
            }
        case actionTypes.FOLLOW_SINGERS: 
            return {
                ...state,
                followSingers: action.followSingers || [],
            }
        default:
            return state;
    }
}

export default userReducer;