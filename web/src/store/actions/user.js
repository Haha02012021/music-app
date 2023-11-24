import actionTypes from "./actionTypes";

export const getUserInfo = (info) => ({
    type: actionTypes.INFO,
    info,
})

export const getFollowSingers = (followSingers) => ({
    type: actionTypes.FOLLOW_SINGERS,
    followSingers,
})

export const getLogin = (login) => ({
    type: actionTypes.LOGIN,
    login,
})