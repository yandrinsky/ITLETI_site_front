import {
    COURSE_UPDATE_MEETING,
    COURSES_RESET_COURSE,
    COURSES_RESET_ERROR,
    COURSES_RESET_REDIRECT,
    COURSES_RESET_TASK,
    FETCH_COURSE_SUCCESS,
    FETCH_COURSES_ERROR,
    FETCH_COURSES_START,
    FETCH_COURSES_SUCCESS, FETCH_MEETING_START,
    FETCH_TASK,
    FETCH_TASK_START,
    FETCH_TASKS,
    JOIN_COURSE_SUCCESS, SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS,
} from "../actions/actionTypes";
import {logout} from "../actions/auth";

const initialState = {
    courses: [],
    course: null,
    loading: true,
    error: null,
    redirectTo: null,
    tasks: null,
    task: null,
    homeworkError: null,
    homeworkSending: false,
    homeworkSuccess: false,
}

export default function coursesReducer(state = initialState, action){
    switch (action.type){
        case FETCH_COURSES_START:
            return  {
                ...state,
                loading: true,
            }
        case FETCH_COURSES_ERROR:
            return  {
                ...state,
                loading: false,
                error: action.error,
            }
        case FETCH_COURSES_SUCCESS:
            return  {
                ...state,
                loading: false,
                tasks: null,
                courses: action.courses,
            }
        case FETCH_COURSE_SUCCESS:
            return  {
                ...state,
                loading: false,
                tasks: null,
                course: action.course,
            }
        case FETCH_TASKS:
            return {
                ...state,
                tasks: action.tasks,
            }
        case FETCH_TASK_START:
            return {
                ...state,
                task: null,
            }
        case FETCH_TASK:
            return {
                ...state,
                task: action.task,
                homeworkError: null,
            }
        case JOIN_COURSE_SUCCESS:
            return {
                ...state,
                redirectTo: "/courses/" + action.id,
            }
        case COURSES_RESET_REDIRECT:
            return {
                ...state,
                redirectTo: null,
            }
        case COURSES_RESET_TASK:
            return {
                ...state,
                task: null,
            }
        case SEND_HOMEWORK_START:
            return {
                ...state,
                homeworkSending: true,
                homeworkError: null,
                homeworkSuccess: false,
            }
        case SEND_HOMEWORK_SUCCESS:
            return {
                ...state,
                homeworkSending: false,
                homeworkError: null,
                homeworkSuccess: true,
            }
        case SEND_HOMEWORK_ERROR:
            return {
                ...state,
                homeworkError: "Ошибка отправки ДЗ",
                homeworkSending: false,
                homeworkSuccess: false,
            }
        case COURSES_RESET_ERROR:
            return {
                ...state,
                error: null,
            }
        case COURSES_RESET_COURSE:
            return {
                ...state,
                course: null
            }
        case FETCH_MEETING_START:
            return {
                ...state,
                loading: true
            }
        case COURSE_UPDATE_MEETING:
            const course = {...state.course};
            course.meeting = action.meeting;
            return {
                ...state,
                loading: false,
                course,
            }
        default:
            return state
    }
}