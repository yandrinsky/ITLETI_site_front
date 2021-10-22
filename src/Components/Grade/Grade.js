import React, {useState} from "react"
import css from "./Grade.module.css"
import Comment from "../Comment/Comment";
import Button from "../UI/Button/Button";
import CloseIcon from '@material-ui/icons/Close';

//onSend - func, title, date, anonymous - bool
function Grade (props){
    const [comment, updateComment] = useState("");
    const [mark, updateMark] = useState("");


    function updMark(e){
        updateMark(e.target.value)
    }

    function updComment(e){
        updateComment(e.target.value)
    }
    return (
        <div className={css.Grade}>
            <div className={css.title}>Пожалуйста, оцени <em>{props.title}</em> <span>{props.date}</span> {props.anonymous ? "(Анонимно)" : ""}</div>
            <form className={css.grade_area} onSubmit={(e)=> e.preventDefault()}>
                <CloseIcon className={css.refuse} onClick={()=> {props.onSend(null, null)}}/>
                <div className={css.wrapper}>
                    <div className={css.marks}>
                        <label><input onClick={updMark} name="mark" type="radio" value="5"/>5</label>
                        <label><input onClick={updMark} name="mark" type="radio" value="4"/>4</label>
                        <label><input onClick={updMark} name="mark" type="radio" value="3"/>3</label>
                        <label><input onClick={updMark} name="mark" type="radio" value="2"/>2</label>
                        <label><input onClick={updMark} name="mark" type="radio" value="1"/>1</label>
                    </div>
                    <div className={css.comment}>
                        {<Comment
                            name={props.anonymous ? "Аноним" : "Я"}
                            role="STUDENT"
                            onChange={(e)=>{updComment(e)}}
                            content={comment}
                            placeholder="Есть что сказать?.."
                        />}
                    </div>
                </div>
                <div className={css.button}>
                    <Button type="primary" disabled={!mark} onClick={()=> {props.onSend(mark, comment ? comment : null)}}>Отправить</Button>
                </div>

            </form>
        </div>
    )
}


export default Grade;
