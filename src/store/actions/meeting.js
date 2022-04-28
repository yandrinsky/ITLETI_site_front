import axios from "../../axios/courses";
import {
    FETCH_MEETING,
    FETCH_MEETING_ATTENDANCE,
    FETCH_MEETING_ERROR,
    MEETING_SET_ERROR,
    RESET_MEETING
} from "./actionTypes";

function getConfig(state){
    return {
        headers: {
            authorization: state.auth.token,
        }
    }
}

export function fetchMeetingInfo(meeting_id){
    return async (dispatch, getState) => {
        try{
            const response = await axios.post("/getMeeting", {
                meeting_id,
            }, getConfig(getState()));
            dispatch(setMeetingInfo(response.data));
        } catch (e) {
            dispatch(setError());
        }

    }
}

export function fetchMeeting(meeting_id){
    return async (dispatch, getState) => {
        try{
            const response = await axios.post("/getMeeting", {
                meeting_id,
            }, getConfig(getState()));
            dispatch(setMeetingInfo(response.data));
        } catch (e) {
            dispatch(setError());
        }

    }
}

export function fetchMeetingAttendance(meeting_id){
    return async (dispatch, getState) => {
        try{
            const response = await axios.post("/getMeetingAttendance", {
                meeting_id,
            }, getConfig(getState()));
            dispatch(setMeetingAttendance(response.data));
        } catch (e) {
            dispatch(setError());
        }

    }
}

function setMeetingInfo(info){
    return {
        type: FETCH_MEETING,
        info,
    }
}

function setMeetingAttendance(attendance){
    return {
        type: FETCH_MEETING_ATTENDANCE,
        attendance,
    }
}

export function resetMeeting(){
    return {
        type: RESET_MEETING
    }
}


function setError(){
    return {
        type: FETCH_MEETING_ERROR,
    }
}

export function setMeetingError(code){
    return{
        type: MEETING_SET_ERROR,
        code,
    }
}