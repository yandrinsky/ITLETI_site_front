import React from "react"
import css from "./CourseBackground.module.css"
import {server} from "../../../axios/server";

export default (props)=> {
    return (
        <div className={css.header} style={{backgroundImage: `url("${server}${props.preview}")`}}>
            <h1>{props.title}</h1>
        </div>
    )
}
