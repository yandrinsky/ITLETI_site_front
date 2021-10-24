import {
    HOMEWORK_COURSE_ID,
    HOMEWORK_OVER,
    HOMEWORK_RESET,
    HOMEWORK_SET,
    HOMEWORK_USER_STATUS
} from "../actions/actionTypes";

const initialState = {
    course_id: null,
    user_status: null,
    homework: null,
    finish: false,
    loading: false,
    createHomework: false,
}

export default function homeworkReducer(state = initialState, action){
    switch (action.type){
        case HOMEWORK_SET:
            return {
                ...state,
                homework: action.homework,
                finish: false,
            }
        case HOMEWORK_RESET:
            return {
                ...state,
                homework: null,
                finish: false,
            }
        case HOMEWORK_OVER:
            return {
                ...state,
                finish: true,
            }
        case HOMEWORK_USER_STATUS:
            return {
                ...state,
                user_status: action.userStatus,
                finish: false,
            }
        case HOMEWORK_COURSE_ID:
            return {
                ...state,
                course_id: action.courseId,
                finish: false,
            }
        default:
            return state
    }
}