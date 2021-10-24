import {
    FETCH_TASK, FETCH_TASK_ERROR,
    FETCH_TASK_START, RESET_TASK,
    SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS, SET_TASK_START, SET_TASK_SUCCESS
} from "../actions/actionTypes";

const initialState = {
    error: null,
    task: null,
    loading: false,
    homeworkSuccess: false,
    success: false,
}

export default function taskReducer(state = initialState, action){
    switch (action.type){
        case FETCH_TASK_START:
            return {
                ...state,
                loading: true,
                task: null,
                success: false,
            }
        case FETCH_TASK:
            return {
                ...state,
                task: action.task,
                error: null,
                success: true,
                loading: false
            }
        case SEND_HOMEWORK_START:
            return {
                ...state,
                loading: true,
                error: null,
                success: false,
            }
        case SEND_HOMEWORK_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: true,
            }
        case SEND_HOMEWORK_ERROR:
            return {
                ...state,
                homeworkError: "Ошибка отправки ДЗ",
                loading: false,
                success: false,
            }
        case RESET_TASK:
            return {
                ...state,
                task: null,
                success: false,
            }
        case FETCH_TASK_ERROR:
            return {
                ...state,
                error: action.error,
                success: false,
            }
        case SET_TASK_START:
            return {
                ...state,
                loading: true,
                success: false,
            }
        case SET_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
            }
        default:
            return state
    }
}