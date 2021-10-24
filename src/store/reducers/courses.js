import {
    COURSE_UPDATE_MEETING,
    COURSES_RESET_COURSE,
    COURSES_RESET_ERROR,
    COURSES_RESET_REDIRECT,
    FETCH_COURSE_SUCCESS,
    FETCH_COURSES_ERROR,
    FETCH_COURSES_START,
    FETCH_COURSES_SUCCESS, FETCH_MEETING_START,
    FETCH_TASK,
    FETCH_TASK_START,
    FETCH_TASKS, GRADE_MEETING_START, GRADE_MEETING_SUCCESS,
    JOIN_COURSE_SUCCESS, SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS, SET_GRADE_MEETING,
} from "../actions/actionTypes";
import {logout} from "../actions/auth";

const initialState = {
    courses: [],
    course: null,
    loading: true,
    error: null,
    redirectTo: null,
    tasks: null,
    grade: null,
    gradeLoading: false,
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

        case COURSES_RESET_ERROR:
            return {
                ...state,
                error: null,
            }
        case COURSES_RESET_COURSE:
            return {
                ...state,
                course: null,
                grade: null,
                gradeLoading: false,
                tasks: null,
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
        case SET_GRADE_MEETING:
            return {
                ...state,
                grade: action.grade,
            }
        case GRADE_MEETING_START:
            return {
                ...state,
                gradeLoading: true,
            }
        case GRADE_MEETING_SUCCESS:
            return {
                ...state,
                grade: null,
                gradeLoading: false,
            }
        default:
            return state
    }
}