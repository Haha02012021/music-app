import actionTypes from "../actions/actionTypes";

const initState = {
    login: false,
    info: {},
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
        default:
            return state;
    }
}

export default userReducer;