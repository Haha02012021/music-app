import actionTypes from "./actionTypes";

export const getAccessToken = (token) => ({
    type: actionTypes.ACCESS_TOKEN,
    token,
});

export const getUserInfo = (info) => ({
    type: actionTypes.INFO,
    info,
})