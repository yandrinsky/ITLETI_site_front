import {
    FETCH_MEETING, FETCH_MEETING_ATTENDANCE, FETCH_MEETING_ERROR, MEETING_SET_ERROR,
    RESET_MEETING, RESET_MEETING_ERROR
} from "../actions/actionTypes";

const initialState = {
    error: null,
    attendance: null,
    info: false,
    success: false,
    signUpError: false,
    errorCode: null,
}

export default function meetingReducer(state = initialState, action){
    switch (action.type){
        case FETCH_MEETING:
            return {
                ...state,
                info: action.info,
                error: null,
                success: true,
                loading: false
            }

        case FETCH_MEETING_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                success: false,
                info: null,
            }
        case RESET_MEETING_ERROR:
            return {
                ...state,
                error: false,
            }
        case FETCH_MEETING_ATTENDANCE:
            return {
                ...state,
                attendance: action.attendance,
            }
        case RESET_MEETING:
            return {
                attendance: null,
                info: false,
                success: false,
                error: null,
            }
        case MEETING_SET_ERROR:
            return {
                code: action.code,
                error: true,
            }
        default:
            return state
    }
}