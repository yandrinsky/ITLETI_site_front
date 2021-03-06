import {combineReducers} from "redux";
import authReducer from "./auth";
import coursesReducer from "./courses";
import errorReducer from "./error";
import homeworkReducer from "./homework";
import taskReducer from "./task";
import meetingReducer from "./meeting";

export default combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    error: errorReducer,
    homework: homeworkReducer,
    task: taskReducer,
    meeting: meetingReducer,
})