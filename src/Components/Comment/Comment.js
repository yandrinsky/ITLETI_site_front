import React, {useEffect, useRef} from "react"
import css from "./Comment.module.css"
import Textarea from "../UI/Textarea/Textarea";
export default (props)=> {

    const roleCls = [css.role];
    const textareaRef = useRef(null);
    props.role === "STUDENT" ? roleCls.push(css.student) : roleCls.push(css.teacher)

    const textareaCls = props.role === "TEACHER" ? [css.teacherStyle] : []

    function auto_grow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";
    }

    // useEffect(()=> {
    //     auto_grow(textareaRef.current);
    // }, [props.content])

    return (
        <div className={css.Comment}>
            <div>
                <span className={roleCls.join(" ")}>{props.role}</span><br/>
                { props.name ?  <span className={css.name}>{props.name} </span> : null }
                { props.date ?  <span className={css.date}>{props.date}</span> : null }
            </div>
            {/*<textarea name="" id="" ref={textareaRef}*/}
            {/*          disabled={!!props.disabled}*/}
            {/*          onChange={props.onChange || function (){} }*/}
            {/*          value={props.content}*/}
            {/*          className={textareaCls.join(" ")}*/}
            {/*          placeholder={props.placeholder}*/}
            {/*>*/}
            {/*</textarea>*/}
            <Textarea name="" id="" ref={textareaRef}
                      disabled={!!props.disabled}
                      onChange={props.onChange || function (){} }
                      className={textareaCls.join(" ")}
                      placeholder={props.placeholder}
                      autoHeight
                      value={props.content}
            >  </Textarea>

        </div>
    )
}
