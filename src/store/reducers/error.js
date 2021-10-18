import {
    ERROR_RESET, ERROR_SET,
} from "../actions/actionTypes";

const initialState = {
    error: null
}

export default function errorReducer(state = initialState, action){
    switch (action.type){
        case ERROR_SET:
            return  {
                error: action.error,
            }
        case ERROR_RESET:
            return {
                error: null
            }
        default:
            return state
    }
}