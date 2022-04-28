import axios from "../../axios/courses";
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
    FETCH_TASKS,
    GRADE_MEETING_START,
    GRADE_MEETING_SUCCESS,
    JOIN_COURSE_SUCCESS,
    RESET_COURSE_AUTH_ERROR,
    RESET_COURSE_MEETING, RESET_COURSE_STATS,
    SET_COURSE_AUTH_ERROR,
    SET_COURSE_MEETING,
    SET_COURSE_MEETINGS, SET_COURSE_STATS,
    SET_GRADE_MEETING
} from "./actionTypes";
import {resetError, setError} from "./error";
import {setMeetingError} from "./meeting";


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
            dispatch(fetchCoursesError(e.response.data))
        }
    }
}

export function fetchCourseMeetings(course_id){
    return async (dispatch, getState)=> {
        const config = getConfig(getState());
        try{
            const {data} = await axios.post(
                "/getMeetings",
                {course_id},
                config
            );
            dispatch(setCourseMeetings(data));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data))
        }
    }
}

export function fetchCourseMeeting(meeting_id, course_id){
    return async (dispatch, getState)=> {
        const config = getConfig(getState());
        try{
            dispatch(resetCourseMeeting());
            const {data} = await axios.post(
                "/getMeeting",
                {meeting_id, course_id},
                config
            );
            dispatch(setCourseMeeting(data));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data))
        }
    }
}

export function fetchCourseById(id){
    return async (dispatch, getState)=> {
        const config = getConfig(getState());
        dispatch(fetchCoursesStart());
        try{
            const course = await axios.get(`/${id}`, config);
            dispatch(fetchCourseSuccess(course.data));
        } catch (e) {
            console.log("fetchCourseById error", e);
            dispatch(fetchCoursesError(e.response.data))
        }

    }
}

export function fetchAboutCourseById(id){
    return async (dispatch, getState)=> {
        const config = getConfig(getState())
        dispatch(fetchCoursesStart());
        try{
            const course = await axios.get(`/about/${id}`, config);
            dispatch(fetchCourseSuccess(course.data));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data))
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

            dispatch(fetchCoursesError(e.response.data))
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
            dispatch(fetchCoursesError(e.response.data))
        }
    }
}

export function setMeeting(course_id, title, content, CQ, CQ_title, CQ_answer, link){
    return async (dispatch, getState) => {
        try {
            dispatch(fetchMeetingStart());
            const response = await axios.post('/setMeeting',
                {
                    course_id,
                    title,
                    content, CQ, CQ_title, CQ_answer, link
                },
                getConfig(getState()))
            dispatch(updateCourseMeeting(response.data.meeting))

        } catch (e){
            dispatch(fetchCoursesError(e.response.data))
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
            dispatch(fetchCoursesError(e.response.data))
        }
    }
}

export function signupForMeeting(course_id, answer){
    return async (dispatch, getState) => {
        try {
            dispatch(fetchMeetingStart());
            const response = await axios.post('/signupForMeeting',
                {
                    course_id,
                    answer,
                },
                getConfig(getState()))
            dispatch(updateCourseMeeting(response.data.meeting))

        } catch (e){
            console.log("error", e.response.data);
            if(e.response.data.code === 41){
                dispatch(fetchMeetingEnd());
                dispatch(setMeetingError(41));
            } else {
                dispatch(fetchCoursesError(e.response.data));
            }
        }
    }
}


// export function sendHomework(task_id, content, comment){
//     return async (dispatch, getState) => {
//         const token = getState().auth.token;
//         const config = {
//             headers: {
//                 authorization: token,
//             }
//         }
//         try{
//             dispatch(sendHomeworkStart());
//             const response = await axios.post("/sendHomework", {
//                 task_id, content, comment
//             }, config)
//             dispatch(sendHomeworkSuccess());
//             dispatch(resetTask());
//             dispatch(fetchTaskById(task_id));
//         } catch(e){
//             dispatch(sendHomeworkError());
//         }
//     }
// }

export function shouldGradeMeeting(course_id){
    return async (dispatch, getState) => {
        try{
            const response = await axios.post('/shouldGradeMeeting',
                {course_id},
                getConfig(getState()),
            )
            dispatch(setGradeMeeting(response.data.grade));
        } catch (e) {
            dispatch(fetchCoursesError(e.response.data))
        }

    }
}

export function gradeMeeting(course_id, mark, comment){
    return async (dispatch, getState) => {
        try{
            dispatch(gradeMeetingStart());
            const response = await axios.post('/gradeMeeting',
                {course_id, mark, comment},
                getConfig(getState()),
            )
            dispatch(gradeMeetingSuccess());
        } catch (e) {
            console.log("error", e)
            dispatch(fetchCoursesError(e.response.data))
        }

    }
}

export function fetchCourseStats(course_id){
    return async (dispatch, getState) => {
        try{
            const response = await axios.post('/courseStats',
                {course_id},
                getConfig(getState()),
            )
            console.log("stats: ", response.data.stats);
            dispatch(setCourseStats(response.data.stats));
        } catch (e) {
            if(e.response.data.code === 1){
                //dispatch(auth(e.response.data.message))
            }
            console.log("bad stats: ", e.response.data);
            dispatch(setError(e.response.data.message))
        }

    }
}

function setCourseStats(courseStats){
    return {
        type: SET_COURSE_STATS,
        courseStats,
    }
}

export function resetCourseStats(){
    return {
        type: RESET_COURSE_STATS,
    }
}

export function resetRedirect(){
    return {
        type: COURSES_RESET_REDIRECT
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

export function resetCourses(){
    return{
        type: COURSES_RESET_COURSES,
    }
}

function gradeMeetingStart(){
    return{
        type: GRADE_MEETING_START,
    }
}

function gradeMeetingSuccess(){
    return{
        type: GRADE_MEETING_SUCCESS,
    }
}

function setGradeMeeting(grade){
    return{
        type: SET_GRADE_MEETING,
        grade,
    }
}


function fetchCoursesStart(){
    return {
        type: FETCH_COURSES_START,
    }
}

export function resetAuthError(){
    return {
        type: RESET_COURSE_AUTH_ERROR,
    }
}

function fetchCoursesError(error){
    if(error.code === 1){
        return {
            type: SET_COURSE_AUTH_ERROR,
        }
    } else {
        return {
            type: FETCH_COURSES_ERROR,
            error: error.message,
        }
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

// function fetchTask(task){
//     return{
//         type: FETCH_TASK,
//         task,
//     }
// }
//
// function sendHomeworkStart(){
//     return {
//         type: SEND_HOMEWORK_START,
//     }
// }
//
// function sendHomeworkSuccess(){
//     return {
//         type: SEND_HOMEWORK_SUCCESS,
//     }
// }
//
// function sendHomeworkError(){
//     return {
//         type: SEND_HOMEWORK_ERROR,
//     }
// }

function setCourseMeetings(meetings){
    return {
        type: SET_COURSE_MEETINGS,
        meetings,
    }
}

function setCourseMeeting(meeting){
    return {
        type: SET_COURSE_MEETING,
        meeting,
    }
}

function resetCourseMeeting(){
    return {
        type: RESET_COURSE_MEETING,
    }
}

function updateCourseMeeting(meeting){
    return {
        type: COURSE_UPDATE_MEETING,
        meeting,
    }
}

function fetchMeetingStart(){
    return {
        type: FETCH_MEETING_START,
    }
}
function fetchMeetingEnd(){
    return {
        type: FETCH_MEETING_END,
    }
}
