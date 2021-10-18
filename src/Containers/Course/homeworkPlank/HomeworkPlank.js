import React from "react"
import css from "./homeworkPlank.module.css"
import {withRouter} from "react-router-dom";
export default withRouter((props)=> {

    const cls = [css.HomeworkPlank];
    if(props.status === "CLOSE"){
        cls.push(css.close)
    }

    return (
        <div className={cls.join(" ")} onClick={()=> {props.history.push("/tasks/" + props.id)}}>
            <div className={css.title}>
                {props.title}
            </div>
            <div className={css.description}>
                {props.description.length > 100 ? props.description.slice(0, 110) + "..." : props.description}
            </div>
        </div>
    )
})
