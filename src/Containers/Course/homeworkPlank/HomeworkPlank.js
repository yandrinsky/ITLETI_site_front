import React, {useState} from "react"
import css from "./homeworkPlank.module.css"
import {withRouter} from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import {markdown} from 'markdown'
import markCss from "../../../markdown/Markdown.module.css"
export default withRouter((props)=> {

    const [edit, setEdit] = useState(false);

    const cls = [css.HomeworkPlank];
    if(props.status === "CLOSE"){
        cls.push(css.close)
    }

    let  mainClick = () =>  props.history.push("/tasks/" + props.id)

    function handlerEditEnter(){
        setEdit(true)
    }
    function handlerEditLever(){
        setEdit(false)
    }

    return (
        <div className={cls.join(" ")} onClick={!edit ? mainClick: () => {}}>
            {props.editable ? <EditIcon className={css.editBtn}
                                        onClick={props.onEdit}
                                        onMouseEnter={handlerEditEnter}
                                        onMouseLeave={handlerEditLever}
            /> : null}
            <div className={css.title}>
                {props.title}
            </div>
            <div className={css.description}
                dangerouslySetInnerHTML={{
                    __html: markdown.toHTML(props.description).slice(0, 100) + "..."
                }}
            />
        </div>
    )
})
