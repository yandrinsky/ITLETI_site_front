import React from "react";
import css from "./Loader.module.css"

const Loader = props => {

    const classes = [css.center];

    if(props.type === "page"){
        classes.push(css.page_center)
    }

    return(
        <div className={classes.join(" ")}>
            <div className={css["lds-roller"]}>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    )
}

export default Loader;