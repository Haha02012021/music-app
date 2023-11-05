import actionTypes from "../actions/actionTypes";

const initState = {
    banner: [],
    homeData: [],
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_HOME: 
            return {
                ...state,
                banner: action.homeData[0]?.items,
                homeData: action.homeData,
            };
        default:
            return state;
    }
}

export default appReducer;