import {NavLink} from "react-router-dom";
import css from "./NLink.module.css"

export function NLink (props){
    return(
        <NavLink to={props.to} className={css.NLink}>{props.children}</NavLink>
    )
}