import axios from "../../axios/auth"
import {
    AUTH_LOGOUT,
    AUTH_RESET_REDIRECT,
    AUTH_SET_READY_STAGE,
    RESET_REDIRECT,
    SIGNIN_ERROR,
    SIGNIN_SUCCESS
} from "./actionTypes";

import React from "react";

export function signIn(username, password){
    return async dispatch => {
        try{
            const {data} = await axios.post("login", {
                username,
                password
            })


            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

            localStorage.setItem('token', data.token)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('roles', data.roles)
            localStorage.setItem('name', data.name)


            dispatch(signInSuccess(data.token, data.roles, data.name))
            dispatch(autoLogout(data.expiresIn));

        } catch (e){
            dispatch(signInError(e))
        }
    }
}

export function registration(username, password, group, vk, name, surname){
    return async (dispatch) => {
        try {
            const {data} = await axios.post("registration", {
                username,
                password,
                group,
                name,
                surname,
                vk,
            })

            dispatch(signIn(username, password));
        } catch (e){
            dispatch(signInError(e))
        }

    }

}

export function autoLogin(){
    return async dispatch => {
        const token = localStorage.getItem('token');

        if(!token){
            dispatch(logout())
        } else {
            try{
                const response = await axios.post('/validToken', {
                    token,
                })

                const expirationDate = new Date(localStorage.getItem('expirationDate'))
                if(expirationDate <= new Date()){
                    dispatch(logout())
                } else {
                    const name = localStorage.getItem('name')
                    const roles = localStorage.getItem('roles')
                    dispatch(signInSuccess(token, roles, name));
                    //dispatch(autoLogout((expirationDate.getTime() - new Date().getTime())/ 1000))
                }
            } catch (e) {
                dispatch(logout())
            }

        }
    }
}

export function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationDate')
    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, time * 1000)
    }
}

export function resetRedirect(){
    return {
        type: AUTH_RESET_REDIRECT
    }
}
export function setReadyStage(){
    return {
        type: AUTH_SET_READY_STAGE,
    }
}
function signInSuccess(token, roles, name){
    return {
        type: SIGNIN_SUCCESS,
        token,
        name,
        roles
    }
}

function signInError(error){
    return {
        type: SIGNIN_ERROR,
        error,
    }
}



