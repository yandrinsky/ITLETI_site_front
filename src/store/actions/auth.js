import axios from "../../axios/auth"
import {
    AUTH_ACTIVE_REDIRECT,
    AUTH_LOGOUT, AUTH_RESET_LACK_OF_USERNAME,
    AUTH_RESET_REDIRECT, AUTH_RESET_REDIRECT_TO, AUTH_SET_LACK_OF_USERNAME,
    AUTH_SET_READY_STAGE, AUTH_SET_REDIRECT_TO, AUTH_SET_VK, AUTH_SET_VK_SESSION,
    RESET_REDIRECT, RESET_SIGNIN_ERROR,
    SIGNIN_ERROR,
    SIGNIN_SUCCESS, TEST_MESSAGE_FAIL, TEST_MESSAGE_SUCCESS
} from "./actionTypes";

import React from "react";
import getCookie from "../../cookie/getCookie";
import {vk_id} from "../../VK/vk";
import {resetCourses} from "./courses";

export function signIn(props){
    return async dispatch => {
        try{
            const {data} = await axios.post("login", {
                ...props
            })


            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

            localStorage.setItem('token', data.token)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('roles', data.roles)
            localStorage.setItem('name', data.name)
            localStorage.setItem('username', data.username)

            dispatch(signInSuccess(data.token, data.roles, data.name, data.group))
            dispatch(resetCourses());
            dispatch(autoLogout(data.expiresIn));

            if(!data.username){
                //console.log("Перенаправить на страницу с логином и паролем");
                dispatch({type: AUTH_SET_LACK_OF_USERNAME});
            } else {
                dispatch({type: AUTH_ACTIVE_REDIRECT});

            }

        } catch (e){
            dispatch(signInError(e.response.data.message))
        }
    }
}



export function registration(props){
    return async (dispatch, getState) => {
        let vk = getState().auth.vk;
        try {
            const {data} = await axios.post("registration", {
                group: props.group,
                name: props.name,
                surname: props.surname,
                vk_id: props.vk_id,
                vk_link: props.vk_link,
                username: props.username,
                password: props.password,
            })

            if(data === true){
                dispatch(signIn({
                        vk_id: vk.id,
                        expire: vk.session.expire,
                        sig: vk.session.sig,
                        sid: vk.session.sid,
                        mid: vk.session.mid,
                        secret: vk.session.secret,
                    }
                ));
                dispatch({type: AUTH_RESET_LACK_OF_USERNAME});
            } else if(data === false){
                dispatch(testMessageFail());
            } else {
                dispatch(signInError("Ошибка регистрации"));
            }

        } catch (e){
            dispatch(signInError(e.response.data.message))
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
                dispatch(logout());
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
            dispatch(resetCourses());
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
function signInSuccess(token, roles, name, group){
    console.log("signInSuccess group", group);
    return {
        type: SIGNIN_SUCCESS,
        token,
        name,
        roles,
        group
    }
}

function testMessageSuccess(){
    return {
        type: TEST_MESSAGE_SUCCESS,
    }
}

function testMessageFail(){
    return {
        type: TEST_MESSAGE_FAIL,
    }
}

function signInError(error){
    return {
        type: SIGNIN_ERROR,
        error,
    }
}

export function resetSignInError(){
    return {
        type: RESET_SIGNIN_ERROR,
    }
}

export function setVk(vk){
    return {
        type: AUTH_SET_VK,
        vk,
    }
}

export function setAuthRedirectTo(redirectTo){
    return {
        type: AUTH_SET_REDIRECT_TO,
        redirectTo,
    }
}
export function resetAuthRedirectTo(){
    return {
        type: AUTH_RESET_REDIRECT_TO,
    }
}

export function setVkSession(vk_session){
    return {
        type: AUTH_SET_VK_SESSION,
        vk_session,
    }
}


