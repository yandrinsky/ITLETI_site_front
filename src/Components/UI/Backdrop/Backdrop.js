import React from "react"
import css from "./Backdrop.module.css"

const Backdrop = props => <div className={css.Backdrop} onClick={props.onClick}></div>

export default Backdrop

