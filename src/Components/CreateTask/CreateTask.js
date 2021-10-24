import React, {useState, useEffect} from "react"
import {markdown} from "markdown";
import css from "./CreateTask.module.css"
import markCss from "../../markdown/Markdown.module.css"
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchCourseById} from "../../store/actions/courses";
import {setError} from "../../store/actions/error";
import CourseBackground from "../../Containers/Course/CourseBackground/CourseBackground";
import Button from "../UI/Button/Button";
import {fetchTaskById, resetTask, setTask} from "../../store/actions/task";
import Loader from "../UI/Loader/Loader";

function CreateTask (props){

    const [title, setTitle] = useState("");
    const [outputTitle, setOutputTitle] = useState("");
    const [initFetch, setInitFetch] = useState(true)
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [courseId, setCourseId] = useState("");
    const [taskId, setTaskId] = useState("");
    const [status, setStatus] = useState("OPEN");
    const [sent, setSent] = useState(false);

    useEffect(()=> {
        if(props.readyStage && initFetch){
            setInitFetch(false);
            const course_id = props.match.params.id.split("_")[0];
            const task_id = props.match.params.id.split("_")[1];
            setCourseId(course_id)
            setTaskId(task_id !== "new" ? task_id : null);
            props.fetchCourseById(course_id);
            if(task_id !== "new") {
                props.fetchTaskById(task_id);
            }
        }
        return () => {
            props.resetTask();
        }
    })

    useEffect(()=> {
        props.setError(props.error)
        if(props.error){
            props.history.push("/error/");
        }
    })

    useEffect(()=> {
        if(props.task){
            handleTitle(props.task.title)
            handleContent(props.task.content)
            handleStatus(props.task.status)
        }

    }, [props.task])

    useEffect(()=> {
        if(props.success && sent){
            handleTitle("")
            handleContent("")
            handleStatus("OPEN")
        }
    }, [props.success])

    function handleContent(value){
        const input = value
        setInput(input);
        setOutput(markdown.toHTML(input));
    }

    function handleTitle(value){
        setTitle(value);
        let output = value;
        if(output[0] !== "#") output = "#" + output;
        setOutputTitle(markdown.toHTML(output));
    }

    function handleStatus(value){
        setStatus(value);
    }


    function handleTab(e) {
        if (e.key === "Tab") {
            e.preventDefault();
            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            // console.log("start, end", start, end)
            // console.log("1 part, 2 part", e.target.value.substring(0, start), e.target.value.substring(end))
            const input = e.target.value.substring(0, start) + "\t" + e.target.value.substring(end);
            setInput(input)
            setOutput(markdown.toHTML(input))

            e.target.selectionStart = e.target.selectionEnd = start + 1;

        }
    }

    return (
        <>
            {
                props.loading && !sent ? <Loader type="page"/> :
                <div className={css.CreateHomework}>
                    <CourseBackground title={"Задать ДЗ для курса " + props.title}
                                      preview={props.preview}
                    />
                    <form className={css.wrapper} onSubmit={(e)=> e.preventDefault()}>
                        <p>Назание работы</p>
                        <input type="text" placeholder="title" value={title}
                               onInput={(e)=> handleTitle(e.target.value)}
                        />
                        <p>Статус работы</p>
                        <select name="status" id="" value={status}
                                onChange={(e)=> handleStatus(e.target.value)}
                        >
                            <option value="OPEN">Открыто</option>
                            <option value="CLOSE">Закрыто</option>
                        </select>
                        <p>Описание работы</p>
                        <textarea name="" id="textarea" cols="30" rows="10"
                                  value={input} onKeyDown={handleTab}
                                  onInput={(e) => handleContent(e.target.value)}/>
                        <hr/>
                        {/*<div className={css.final} >{this.state.output}</div>*/}
                        <div className={`${css.final} ${markCss["markdown-body"]}`}
                             dangerouslySetInnerHTML={{__html: outputTitle}}
                        />
                        <div className={`${css.final} ${markCss["markdown-body"]}`}
                             dangerouslySetInnerHTML={{__html: output}}
                        />
                        <div className={css.btnWrapper}>
                            {
                                props.sent && props.loading ? <Loader/> :
                                <Button type="primary" disabled={!title || !input}
                                        onClick={taskId ?
                                            ()=> {props.setTask(courseId, title, input, status, taskId); setSent(true)} :
                                            ()=> {props.setTask(courseId, title, input, status,null); setSent(true)}
                                        }
                                >{taskId ? "Изменить" : "Задать"}</Button>
                            }

                        </div>
                    </form>
                </div>
            }

        </>

    )
}

function mapDispatchToProps(dispatch){
    return {
        fetchCourseById: (id) => dispatch(fetchCourseById(id)),
        fetchTaskById: (id) => dispatch(fetchTaskById(id)),
        setError: (error) => dispatch(setError(error)),
        setTask: (course_id, title, content, status, task_id) => dispatch(setTask(course_id, title, content, status, task_id)),
        resetTask: () => dispatch(resetTask()),
    }
}

function mapStateToProps(state){
    return {
        title: state.courses.course?.title,
        id: state.courses.courses?.id,
        preview: state.courses.course?.preview,
        task: state.task.task,
        loading: state.task.loading || state.courses.loading,
        error: state.courses.error || state.task.error,
        success: state.task?.success,
        readyStage: state.auth.readyStage,

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTask))