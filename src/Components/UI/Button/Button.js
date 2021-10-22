import React from "react"
import css from './Button.module.css'

const Button = props => {
    const cls = [
        css.Button,
        css[props.type]
    ]

    if(props.marginReset){
        cls.push(css["margin_reset"]);
    }

    if(props.disabled){
        cls.push(css.disabled);
    }

    return(
        <button
            onClick={props.onClick}
            className={cls.join(' ')}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )

}

export default Button
