import axios from "../../axios/courses";
import {
    FETCH_TASK, FETCH_TASK_ERROR,
    FETCH_TASK_START, RESET_TASK,
    SEND_HOMEWORK_ERROR,
    SEND_HOMEWORK_START,
    SEND_HOMEWORK_SUCCESS, SET_TASK_START, SET_TASK_SUCCESS
} from "./actionTypes";


function getConfig(state){
    return {
        headers: {
            authorization: state.auth.token,
        }
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

export function fetchTaskById(id){
    return async (dispatch, getState)=> {
        try{
            dispatch(fetchTaskStart())
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
            dispatch(fetchTaskError(e.response.data.message))
        }
    }
}

export function setTask(course_id, title, content, status, task_id){
    //task_id === null, если новое задание, иначе обновление задания
    return async (dispatch, getState) => {
        try{
            console.log("dispatch(setTaskStart())")
            dispatch(setTaskStart())
            const response = await axios.post('/setTask',
                {course_id, title, content, status, task_id},
                getConfig(getState()),
            )
            console.log("dispatch(setTaskSuccess());")
            dispatch(setTaskSuccess());

        } catch (e) {
            console.log("error", e)
            dispatch(fetchTaskError(e.response.data.message))
        }
    }
}

export function resetTask(){
    return{
        type: RESET_TASK
    }
}

function fetchTaskStart(){
    return{
        type: FETCH_TASK_START
    }
}
function fetchTaskError(error){
    return{
        type: FETCH_TASK_ERROR,
        error: error,
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

export function setTaskSuccess(){
    return{
        type: SET_TASK_SUCCESS
    }
}

export function setTaskStart(){
    return{
        type: SET_TASK_START    }
}

