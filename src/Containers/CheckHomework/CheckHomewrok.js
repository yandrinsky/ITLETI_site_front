import React, {Component, useEffect, useRef, useState} from "react"
import css from "./CheckHomework.module.css"
import {connect} from "react-redux";
import {getHomework, gradeHomework} from "../../store/actions/homework";
import Loader from "../../Components/UI/Loader/Loader";
import Comment from "../../Components/Comment/Comment";
import HomeworkStatus from "../../Components/UI/HomeworkStatus/HomeworkStatus";
import markCss from "../../markdown/Markdown.module.css";
import {markdown} from "markdown";
import Button from "../../Components/UI/Button/Button";
import Textarea from "../../Components/UI/Textarea/Textarea";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";


const localKey = "IT-LETI_check_comment"

const saveComment = (comment) => {
    localStorage.setItem(localKey, comment);
}
let saveCommentTimeout;

function patternAnalysis(props){
    let pattern = props.task.frameOption.split("");
    let dollarIndexes = [];
    let commands = {
        REPLACE: (arg1, arg2) => {
            return props.homework.content.replace(arg1, arg2);;
        },
        INDEX_OF: (arg) => {
            return props.homework.content.indexOf(arg);
        },
        LAST_INDEX_OF: (arg) => {
            return props.homework.content.lastIndexOf(arg);
        },
        SLICE: (arg1, arg2) => {
            return props.homework.content.slice(arg1, arg2);
        }
    }
    // https:/codepen$.SLICE($.LAST_INDEX_OF(/))$.REPLACE(pen, embed)



    pattern.forEach((letter, index) => {
        if(letter === "$"){
            // dollarIndexes
        }
    })
    let iframeSrc;
    if(props.task.frame){
        if(props.task.frameOption){

            if(props.task.frameOption.indexOf("$.REPLACE") !== -1){
                let replaceStart = props.task.frameOption.indexOf("$.REPLACE");
                let i = replaceStart;
                let openedCount = null
                let argsIndexes = [];
                let isError = false;
                //Пробегаемся по строке, чтобы найти границы функции, то есть ковычки.
                while (i < pattern.length || openedCount !== 0){
                    if(pattern[i] === "("){
                        if(openedCount !== null){
                            openedCount += 1;
                        } else {
                            openedCount = 1;
                            argsIndexes.push(i + 1);
                        }
                    } else if(pattern[i] === ")"){
                        if(openedCount !== null){
                            openedCount -= 1;
                        } else {
                            isError = true;
                            //Тут нужно как-то выбросить ошибку;
                            break
                        }
                    }
                    if(openedCount === 0){
                        argsIndexes.push( i - 1);
                        break
                    }
                    i += 1;
                }

                if(!isError || argsIndexes.length === 2){
                    let args =  props.task.frameOption
                        .slice(argsIndexes[0], argsIndexes[1] + 1)
                        .replaceAll(" ", "")
                        .split(",")

                    let replaceRes = commands.REPLACE(...args);
                    pattern.splice(replaceStart, argsIndexes[1] + 2, replaceRes);
                }
            }
            iframeSrc = pattern.join("").replace("$", props.homework.content);
        } else {
            iframeSrc = props.homework.content;
        }
    }
    return iframeSrc;
}


//Интерфейс проверки дз преподавателем
function Homework(props){
    const [state, setState] = useState({
        showComments: false,
        commentText: localStorage.getItem(localKey),
        finish: false,
        clickGradeBtn: false,
        showDescription: true,
    })

    //didMount
    useEffect(()=> {
        props.getHomework();
        setState({
            ...state,
            clickGradeBtn: false,
        })

    }, []);

    //fetch new homework
    useEffect(()=> {
        setState({
            ...state,
            clickGradeBtn: false,
        })
    }, [props.homework])



    function commentHandler(value){
        setState({
            ...state,
            commentText: value,
        })
        clearTimeout(saveCommentTimeout)
        saveCommentTimeout = setTimeout(()=> saveComment(value), 500);
    }

    function formComments(){
        const comments = props.homework.comments.map(comment => {
            return <Comment role={comment.type}
                            content={comment.content}
                            name={""}
                            disabled
            />
        })
        comments.unshift(
            <>
                <Comment role={"TEACHER"} name={"Я"}
                         content={state.commentText}
                         onChange={commentHandler.bind(this)}
                />
                <hr/>
            </>

        )

        return comments;
    }

    function gradeHandler(status){


        setState({
            ...state,
            clickGradeBtn: true,
        })
        saveComment("");

        props.gradeHomework(props.id, status, state.commentText || null);
    }



    function innerRender(){
        if(props.courseId){
            if(props.finish){
                return <h1 className={css.message}>Проверять больше нечего</h1>
            } else {
                if(props.homework){
                    return (
                        <div className={css.Homework}>
                            <div className={css.wrapper}>
                                <div className={css.task}>
                                    <h1>{props.task.title}</h1>
                                    {
                                        state.showDescription ?
                                            <>
                                                <Button onClick={()=>{setState({...state, showDescription: false})}}
                                                        type="primary"
                                                >
                                                    Скрыть описание
                                                </Button>
                                                <ReactMarkdown children={props.task.content} className={markCss["markdown-body"]} remarkPlugins={[remarkGfm]}/>
                                            </>
                                            : <Button onClick={()=>{setState({...state, showDescription: true})}}
                                                      type="primary"
                                            >Показать описание</Button>
                                    }

                                </div>

                                <div className={css.homeworkItems}>
                                    <p>Осталось работ: {props.needToCheck}</p>
                                    <p>Student work</p>

                                    {props.task.frame ? <p>{props.homework.content}</p> : null}

                                    <Button onClick={() => {
                                        setState({showComments: !state.showComments})
                                    }} type="primary">
                                        Комментарии: {props.homework.comments.length}
                                    </Button>
                                    <br/>
                                    {!state.clickGradeBtn ? <div className={css.check_btn_wrapper}>

                                        <div className={css.check_btn} onClick={() => {
                                            gradeHandler("PASSED")
                                        }}>
                                            <HomeworkStatus status={"PASSED"}/>
                                        </div>

                                        <div className={css.check_btn} onClick={() => {
                                            gradeHandler("FAILED")
                                        }}>
                                            <HomeworkStatus status={"FAILED"}/>
                                        </div>
                                    </div> : <Loader/>}
                                </div>

                            </div>

                            {
                                state.showComments ?
                                    <>
                                        {formComments()}
                                    </>
                                    : null
                            }

                            {
                                props.task.frame ?
                                    <iframe src={patternAnalysis.call(this, props)}
                                            allowFullScreen="allowfullscreen" frameBorder="0"
                                            className={css.iframe}
                                    />
                                    : <Textarea className={css.text_homework} disabled autoHeight>{props.homework.content}</Textarea>
                            }

                        </div>
                    )
                } else {
                    return <Loader type="page"/>
                }
            }

        } else {
            return <h1 className={css.message}>Недостаточно прав</h1>
        }
    }
    return innerRender();

}

function mapDispatchToProps(dispatch){
    return {
        getHomework: () => {dispatch(getHomework())},
        gradeHomework: (id, status, comment) => {dispatch(gradeHomework(id, status, comment))}
    }
}

function mapStateToProps(state){
    return {
        courseId: state.homework.course_id,
        homework: state.homework?.homework?.homework,
        task: state.homework?.homework?.task,
        id: state.homework?.homework?.homework.id,
        full: state.homework?.homework,
        finish: state.homework?.finish,
        needToCheck: state.homework?.homework?.needToCheck,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homework)
