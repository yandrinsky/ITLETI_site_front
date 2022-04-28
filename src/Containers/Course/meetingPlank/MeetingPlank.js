import React, {useEffect, useState} from "react"
import Button from "../../../Components/UI/Button/Button";
import css from "./Meeting.module.css";
import Loader from "../../../Components/UI/Loader/Loader";
import {TextField} from "@mui/material";
export default ({loading, title, content, signup, checkIn, controlQuestion, controlQuestionAnswer, error, vk_link, ...props})=> {
    const [answer, setAnswer] = useState("");
    const [e, setE] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const answerHandler = (answer) => {
        setAnswer(answer);
        setE(false);
    }

    useEffect(() => {
        setE(!!error);
    }, [loading, title, content, signup, checkIn, controlQuestion, error])

    const checkInForm = () => {
        let form = "";
        console.log("controlQuestionAnswer && showAnswer", controlQuestionAnswer, showAnswer);
        if(controlQuestion){
            return <>
                <hr/>
                <h4>Чтобы отметиться, ответьте на следующий вопрос: </h4>
                <p className={css.inputLabel} style={{marginBottom: 10}}>{controlQuestion}</p>
                {controlQuestionAnswer ?
                    <Button type="primary" onClick={()=> setShowAnswer(!showAnswer)}>{!showAnswer ? "Показать ответ" : "Скрыть ответ"}</Button> : null
                }
                {controlQuestionAnswer && showAnswer ? <p>Ответ: {controlQuestionAnswer}</p> : null}



                {/*<TextField id="standard-basic" label="Standard" variant="standard" />*/}
                <div className={css.input_wrapper}>
                    <TextField type="text" value={answer} className={css.input} error={e}
                               onInput={(e) => answerHandler(e.target.value)}
                               label={!error ? "Ответ" : "Ответ неверный"} variant="standard"
                    />
                </div>
                <Button type="primary" onClick={()=> props.onClick(answer)} disabled={answer.length === 0}>Отметиться</Button>
            </>
        } else {
            return <Button type="primary" onClick={()=> props.onClick(answer)}>Отметиться</Button>
        }

    }

    return (
        <div className={css.Meeting}>
            <h2>Прямо сейчас проходит занятие</h2>
            <hr/>
            <h3>{title}</h3>
            <p>{content}</p>
            {loading ?
                <Loader/> :
                <>
                    {signup ?
                        <p className={css.success}>Вы успешно отметились</p> :
                        checkIn ? checkInForm() : <p>Чтобы отметиться, обратитесь к <a href={vk_link} target="_blank">преподавателю</a> для получения ссылки</p>
                    }
                </>

            }
        </div>
    )
}
