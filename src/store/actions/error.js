import {ERROR_RESET, ERROR_SET} from "./actionTypes";
import axios from "../../axios/auth";
import {logout} from "./auth";
import {resetCoursesError} from "./courses";
import {resetTaskError} from "./task";

export function setError(error){
    return {
        type: ERROR_SET,
        error,
    }
}
export function resetError(){
    return async dispatch => {
            dispatch(resetInnerError());
            dispatch(resetCoursesError());
            dispatch(resetTaskError());
    }
}

function resetInnerError(){
    return {
        type: ERROR_RESET,
    }
}