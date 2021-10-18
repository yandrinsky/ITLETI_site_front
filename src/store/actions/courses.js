import axios from "../../axios/courses";
import {
    AUTH_RESET_REDIRECT,
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
    FETCH_TASKS,
    JOIN_COURSE_SUCCESS,
    SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS
} from "./actionTypes";
import {resetError} from "./error";


function getConfig(state){
    return {
        headers: {
            authorization: state.auth.token,
        }
    }
}

export function fetchCourses(){
    return async (dispatch, getState)=> {
        dispatch(fetchCoursesStart());
        let state = getState().auth;
        try{
            const courses = await axios.get("", {
                headers: {
                    authorization: state.token,
                }
            });
            dispatch(fetchCoursesSuccess(courses.data));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function fetchCourseById(id){
    return async (dispatch, getState)=> {
        const auth = getState().auth
        const token = auth.token;
        const config = {
            headers: {
                authorization: token,
            }
        }
        dispatch(fetchCoursesStart());
        try{
            const course = await axios.get(`/${id}`, config);
            dispatch(fetchCourseSuccess(course.data));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data.message))
        }

    }
}

export function fetchCourseTasksById(id){
    return async (dispatch)=> {
        try{
            const tasks = await axios.post(`/getTasks`, {
                course_id: id,
            });
            dispatch(fetchTasks(tasks.data.tasks))
        } catch (e) {

            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}


export function fetchTaskById(id){
    return async (dispatch, getState)=> {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                    authorization: token,
                }
            }
            const tasks = await axios.post(`/getTask`, {
                task_id: id,
            }, config)
            dispatch(fetchTask(tasks.data))
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function joinCourse(id){
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const config = {
            headers: {
                authorization: token,
            }
        }
        try {
            const response = await axios.post('/joinCourse',
                {
                    course_id: id,
                },
                config)
            dispatch(joinSuccess(id));
        } catch (e){
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function setMeeting(course_id, title, content){
    return async (dispatch, getState) => {
        try {
            dispatch(fetchMeetingStart());
            const response = await axios.post('/setMeeting',
                {
                    course_id,
                    title,
                    content

                },
                getConfig(getState()))
            dispatch(updateCourseMeeting(response.data.meeting))

        } catch (e){
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function stopMeeting(course_id){
    return async (dispatch, getState) => {
        try {
            dispatch(fetchMeetingStart());
            const response = await axios.post('/stopMeeting',
                {
                    course_id: course_id,
                },
                getConfig(getState()))
            dispatch(updateCourseMeeting(response.data.meeting))

        } catch (e){
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function signupForMeeting(course_id){
    return async (dispatch, getState) => {
        try {
            dispatch(fetchMeetingStart());
            const response = await axios.post('/signupForMeeting',
                {
                    course_id: course_id,
                },
                getConfig(getState()))
            dispatch(updateCourseMeeting(response.data.meeting))

        } catch (e){
            dispatch(fetchCoursesError(e.response.data.message))
        }
    }
}

export function resetRedirect(){
    return {
        type: COURSES_RESET_REDIRECT
    }
}
export function resetTask(){
    return{
        type: COURSES_RESET_TASK
    }
}

export function resetCourse(){
    return {
        type: COURSES_RESET_COURSE,
    }
}

export function resetCoursesError(){
    return{
        type: COURSES_RESET_ERROR,
    }
}

export function sendHomework(task_id, content, comment){
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const config = {
            headers: {
                authorization: token,
            }
        }
        try{
            dispatch(sendHomeworkStart());
            const response = await axios.post("/sendHomework", {
                task_id, content, comment
            }, config)
            dispatch(sendHomeworkSuccess());
            dispatch(resetTask());
            dispatch(fetchTaskById(task_id));
        } catch(e){
            dispatch(sendHomeworkError());
        }
    }
}

function fetchCoursesStart(){
    return {
        type: FETCH_COURSES_START,
    }
}

function fetchCoursesError(error){
    return {
        type: FETCH_COURSES_ERROR,
        error,
    }
}

function fetchCoursesSuccess(courses){
    return {
        type: FETCH_COURSES_SUCCESS,
        courses,
    }
}

function fetchCourseSuccess(course){
    return {
        type: FETCH_COURSE_SUCCESS,
        course,
    }
}

function joinSuccess(id){
    return{
        type: JOIN_COURSE_SUCCESS,
        id,
    }
}

function fetchTasks(tasks){
    return{
        type: FETCH_TASKS,
        tasks,
    }
}

function fetchTask(task){
    return{
        type: FETCH_TASK,
        task,
    }
}

function sendHomeworkStart(){
    return {
        type: SEND_HOMEWORK_START,
    }
}

function sendHomeworkSuccess(){
    return {
        type: SEND_HOMEWORK_SUCCESS,
    }
}

function sendHomeworkError(){
    return {
        type: SEND_HOMEWORK_ERROR,
    }
}

function updateCourseMeeting(meeting){
    return {
        type: COURSE_UPDATE_MEETING,
        meeting,
    }
}

function fetchMeetingStart(){
    console.log("fetchMeetingStart")
    return {
        type: FETCH_MEETING_START,
    }
}