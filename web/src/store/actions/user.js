import actionTypes from "./actionTypes";

export const getUserInfo = (info) => ({
    type: actionTypes.INFO,
    info,
})

export const getLogin = (login) => ({
    type: actionTypes.LOGIN,
    login,
})