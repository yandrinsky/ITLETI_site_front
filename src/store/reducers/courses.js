import {
    COURSE_UPDATE_MEETING,
    COURSES_RESET_COURSE,
    COURSES_RESET_COURSES,
    COURSES_RESET_ERROR,
    COURSES_RESET_REDIRECT,
    FETCH_COURSE_SUCCESS,
    FETCH_COURSES_ERROR,
    FETCH_COURSES_START,
    FETCH_COURSES_SUCCESS, FETCH_MEETING_END,
    FETCH_MEETING_START,
    FETCH_TASK,
    FETCH_TASK_START,
    FETCH_TASKS,
    GRADE_MEETING_START,
    GRADE_MEETING_SUCCESS,
    JOIN_COURSE_SUCCESS,
    RESET_COURSE_AUTH_ERROR,
    RESET_COURSE_MEETING, RESET_COURSE_STATS,
    SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS,
    SET_COURSE_AUTH_ERROR,
    SET_COURSE_MEETING,
    SET_COURSE_MEETINGS,
    SET_COURSE_STATS,
    SET_GRADE_MEETING,
} from "../actions/actionTypes";
import {logout} from "../actions/auth";

const initialState = {
    courses: null,
    course: null,
    loading: false,
    error: null,
    authError: null,
    redirectTo: null,
    tasks: null,
    meetings: null,
    meeting: null,
    grade: null,
    gradeLoading: false,
    courseStats: null,
}

export default function coursesReducer(state = initialState, action){
    switch (action.type){
        case FETCH_COURSES_START:
            return  {
                ...state,
                loading: false,
                error: false,
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
                meetings: null,
                meeting: null,
                error: null,
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
                meetings: null,
                meeting: null,
            }
        case COURSES_RESET_COURSES:
            return {
                ...state,
                courses: null,
            }
        case FETCH_MEETING_START:
            return {
                ...state,
                loading: true
            }
        case FETCH_MEETING_END:
            return {
                ...state,
                loading: false,
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
        case SET_COURSE_MEETINGS:
            return {
                ...state,
                meetings: action.meetings,
            }
        case SET_COURSE_MEETING:
            return {
                ...state,
                meeting: action.meeting,
            }
        case RESET_COURSE_MEETING:
            return {
                ...state,
                meeting: null,
            }
        case SET_COURSE_AUTH_ERROR:
            return {
                ...state,
                authError: true,
            }
        case RESET_COURSE_AUTH_ERROR:
            return {
                ...state,
                authError: false,
            }
        case SET_COURSE_STATS:
            return {
                ...state,
                courseStats: action.courseStats,
            }
        case RESET_COURSE_STATS:
            return {
                ...state,
                courseStats: null,
            }

        default:
            return state
    }
}