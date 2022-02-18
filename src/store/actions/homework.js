import {HOMEWORK_COURSE_ID, HOMEWORK_OVER, HOMEWORK_RESET, HOMEWORK_SET, HOMEWORK_USER_STATUS} from "./actionTypes";
import axios from "../../axios/courses";

function getConfig(state){
    return {
        headers: {
            authorization: state.auth.token,
        }
    }
}

export function setHomeworkCourseId(courseId){
    return {
        type: HOMEWORK_COURSE_ID,
        courseId,
    }
}

export function setHomeworkUserStatus(userStatus){
    return {
        type: HOMEWORK_USER_STATUS,
        userStatus,
    }
}


export function getHomework(){
    return async (dispatch, getState) => {
        const state = getState();
        const courseId = state.homework.course_id;

        dispatch(resetHomework());

        try{
            const response = await axios.post("/getHomework", {
                course_id: courseId,
            }, getConfig(state));


            dispatch(setHomework(response.data));
        } catch (e) {
            console.log("getHomework e", e);
            if(e.response.status === 404){
                dispatch(overHomework());
            }
        }

    }
}

export function gradeHomework(id, status, comment){
    return async (dispatch, getState) => {
        const state = getState();

        try {
            const response = await axios.post("/gradeHomework", {
                homework_id: id,
                status,
                comment,
                course_id: state.homework.course_id,
            }, getConfig(state));
            dispatch(resetHomework());

            dispatch(getHomework());

        } catch (e) {
            if(e.response.data.status === 404){
                dispatch(overHomework());
            }
        }
    }
}

function setHomework(homework){
    return {
        type: HOMEWORK_SET,
        homework,
    }
}

function resetHomework(homework){
    return {
        type: HOMEWORK_RESET,
    }
}

function overHomework(){
    return {
        type: HOMEWORK_OVER,
    }
}
