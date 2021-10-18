import React from "react"
import Button from "../../../Components/UI/Button/Button";
import css from "./Meeting.module.css";
import Loader from "../../../Components/UI/Loader/Loader";
export default (props)=> {
    return (
        <div className={css.Meeting}>
            <h2>Прямо сейчас походит занятие</h2>
            <hr/>
            <h3>{props.title}</h3>
            <p>{props.content}</p>
            {props.loading ?
                <Loader/> :
                <>
                    {props.signup ?
                        <p className={css.success}>Вы успешно отметились</p> :
                        <Button type="primary" onClick={()=> props.onClick()}>Отметиться</Button>
                    }
                </>

            }
        </div>
    )
}
