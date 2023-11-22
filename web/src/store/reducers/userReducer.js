import actionTypes from "../actions/actionTypes";

const initState = {
    token: '',
    info: {},
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.ACCESS_TOKEN: 
            return {
                ...state,
                token: action.token || '',
            }
        case actionTypes.INFO: 
            return {
                ...state,
                info: action.info || {},
            }
        default:
            return state;
    }
}

export default userReducer;