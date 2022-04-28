import React from "react"
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import css from "./HomeworkStatus.module.css"



export default ({status, ...props})=> {
    let icon;
    let style = {};

    if(props.size){
        style.width = props.size;
        style.height = props.size;
    }
    if(props.color){
        style.color = props.color
    }

    if(status === "NOT_CHECKED"){
        icon = <AccessTimeIcon className={`${css.notCheckedIcon} ${css.icon}`} style={style}/>
    } else if(status === "PASSED"){
        icon = <DoneIcon className={`${css.passedIcon} ${css.icon}`} style={style}/>
    } else if(status === "FAILED"){
        icon = <CloseIcon className={`${css.failIcon} ${css.icon}`} style={style}/>
    }

    return (
        <>
            {icon}
        </>

    )
}
