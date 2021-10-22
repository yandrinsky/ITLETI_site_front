import React from "react"
import css from "./Comment.module.css"
export default (props)=> {

    const roleCls = [css.role];
    props.role === "STUDENT" ? roleCls.push(css.student) : roleCls.push(css.teacher)

    const textareaCls = props.role === "TEACHER" ? [css.teacherStyle] : []
    return (
        <div className={css.Comment}>
            <p>
                <span className={roleCls.join(" ")}>{props.role}</span><br/>
                <span className={css.name}>{props.name} </span>
                <span className={css.date}>{props.date}</span>
            </p>
            <textarea name="" id="" cols="30" rows="10"
                      disabled={!!props.disabled}
                      onChange={props.onChange || function (){}}
                      value={props.content}
                      className={textareaCls.join(" ")}
                      placeholder={props.placeholder}
            >
            </textarea>
        </div>
    )
}
