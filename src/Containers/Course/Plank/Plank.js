import React, {useState} from 'react';
import css from "./Plank.module.css";
import {withRouter} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";


const Plank = ({editable, onClick, onEdit, title, body, date, className, children}) => {
    const [edit, setEdit] = useState(false);

    //let prepDate = date.split("T")[0].split("-").reverse().join(".");
    date = new Date(date);
    let prepDate = String(date.getDate()).padStart(2, "0") + "." + String(date.getMonth() + 1).padStart(2, "0") + "." + String(date.getFullYear());
    const cls = [css.Plank, className];

    function handlerEditEnter(){
        setEdit(true)
    }
    function handlerEditLever(){
        setEdit(false)
    }
    return (
        <div className={cls.join(" ")} onClick={!edit ? onClick: () => {}}>
            {editable ? <EditIcon className={css.editBtn}
                                  onClick={onEdit}
                                  onMouseEnter={handlerEditEnter}
                                  onMouseLeave={handlerEditLever}
            /> : null}
            <div className={css.title}>{title}</div>
            <div className={css.description}>{body}</div>
            <div className={css.date}>{prepDate}</div>
            {children}
        </div>
    )
};



export default withRouter(Plank);
