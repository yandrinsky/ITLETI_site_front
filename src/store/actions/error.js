import {ERROR_RESET, ERROR_SET} from "./actionTypes";

export function setError(error){
    return {
        type: ERROR_SET,
        error,
    }
}

export function resetError(){
    return {
        type: ERROR_RESET,
    }
}