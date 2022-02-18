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
import {deleteTask, fetchTaskById, resetTask, setTask} from "../../store/actions/task";
import Loader from "../UI/Loader/Loader";
import Select from "../UI/Select/Select";


//Интерфейст создания нового ДЗ
function CreateTask (props){

    const [title, setTitle] = useState("");
    const [outputTitle, setOutputTitle] = useState("");
    const [initFetch, setInitFetch] = useState(true)
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [courseId, setCourseId] = useState("");
    const [taskId, setTaskId] = useState("");
    const [status, setStatus] = useState("OPEN");
    const [contentType, setContentType] = useState("TEXT");
    const [type, setType] = useState("HOMEWORK");
    const [lang, setLang] = useState("JS");
    const [isFrame, setIsFrame] = useState(true);
    const [frameOption, setFrameOption] = useState("");
    const [sent, setSent] = useState(false);
    const [resource, setResource] = useState(undefined);
    const [isExistTask, setIsExistTask] = useState(false);
    const [state, setState] = useState({
        title: "",
        outputTitle: "",
        initFetch: true,
        input: "",
        output: "",
        courseId: "",
        taskId: "",
        status: "OPEN",
        contentType: "TEXT",
        lang: "JS",
        isFrame: "TRUE",
        frameOption: "",
        sent: "false",
        resource: undefined,
        isExistTask: false,
    })

    let availableResources = [
        {title: "Google Docs", value: "GOOGLE", template: undefined,},
        {title: "JDoodle", value: "JDOODLE", template: undefined,},
        {title: "JSFiddle", value: "JSFIDDLE", template: "$/embedded/"},
        {title: "Моего варианта нет", value: "CUSTOM", template: undefined,}
    ]

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
            console.log("CreatTask props.task", props.task);
            setIsExistTask(true);
            // const {title, content, status, contentType, type, isFrame, frameOption}
            handleTitle(props.task.title)
            handleContent(props.task.content)
            handleStatus(props.task.status)
            handleContentType(props.task.contentType)
            handleType(props.task.type)
            //setType(props.task.type)
            // console.log("state", state);
            // let type = props.task.type;
            // setState({...state, type});

            setIsFrame(props.task.frame || false);
            setFrameOption(props.task.frameOption || "");
            setResource(props.task.resource);
            // setType(props.type)
            // setContentType(props.contentType)
            //setLang(props.lang || "JS")
            console.log("Title", title);
            console.log("Content", input);
            console.log("Status", status);
            console.log("ContentType", contentType, props.task.contentType);
            console.log("Type", type, props.task.type);
            console.log("frame", isFrame);
            console.log("frameOption", frameOption);
        }

    }, [props.task])

    useEffect(()=> {
        if(props.success && sent){
            handleTitle("")
            handleContent("")
            handleStatus("OPEN")
            handleType("HOMEWORK")
            setIsFrame(true);
            setFrameOption("");
            setContentType("TEXT");
            setResource("")
            if(props.task){
                setIsExistTask(true);
            } else {
                setIsExistTask(false);
            }
            props.history.push("/courses/" + courseId);
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
        let status = value;
        setStatus(status);
    }
    function handleType(value){
        setType(value);
    }

    function handleContentType(value){
        setContentType(value);
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
    function handleResource(e){
        setResource(e.target.value);
        let curResource = availableResources.filter(item => item.value === e.target.value.value);
        setFrameOption(curResource.template)
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
                        <hr/>

                        <p>Тип работы</p>
                        <select name="type" id="" value={type}
                                onChange={(e)=> handleType(e.target.value)}
                        >
                            <option value="HOMEWORK">Домашняя работа</option>
                            <option value="TASK">Задача</option>
                        </select>
                        <hr/>

                        <p>Статус работы</p>
                        <select name="status" id="" value={status}
                                onChange={(e)=> handleStatus(e.target.value)}
                        >
                            <option value="OPEN">Открыто</option>
                            <option value="CLOSE">Закрыто</option>
                        </select>
                        <hr/>
                        <p>Тип ответа</p>
                        <select name="contentType" id="" value={contentType}
                                onChange={(e)=> handleContentType(e.target.value)}
                        >
                            <option value="TEXT">текст</option>
                            <option value="LINK">ссылка на ресурс</option>
                            {/*<option value="CODE">код программы</option>*/}
                        </select>
                        {
                            contentType === "CODE" ?
                                <>
                                    <hr/>
                                    <p>Язык программирования </p>
                                    <select name="lang" id="" value={lang}
                                            onChange={(e)=> setLang(e.target.value)}
                                    >
                                        <option value="JS">JS</option>
                                    </select>
                                    <br/>
                                </> : null
                        }
                        {
                            contentType === "LINK" ?
                                <>
                                    <hr/>
                                    <label>Открыть содержимое как frame?
                                        <input type="checkbox" checked={isFrame}
                                               onChange={(e)=> {
                                                   setIsFrame(!isFrame);
                                               }}
                                        />
                                    </label>

                                </> : null
                        }
                        {
                            contentType === "LINK" && isFrame ?
                                <>
                                    <p>Выберите ресурс</p>
                                    <Select options={availableResources}
                                            value={resource}
                                            onChange={handleResource}
                                            defaultValue={"Выберите ресурс"}
                                    />
                                </> : null
                        }
                        {
                            contentType === "LINK" && isFrame && resource === "CUSTOM" ?
                                <>
                                    <hr/>
                                    <p>Укажите шаблон для открытия frame</p>
                                    <p>Пример: $/embedded/</p>
                                    <p>Вместо $ будет подставлена ссылка, отправленная учеником</p>
                                    <p><i>Если шаблонизация не требуется, оставьте строку пустой</i></p>
                                    <input type="text" value={frameOption} onInput={e => setFrameOption(e.target.value)}/>
                                </>
                            : null
                        }
                        <hr/>
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
                                    <>
                                        <Button type="primary" disabled={!title || !input}
                                                onClick={ () => {
                                                    props.setTask({
                                                        course_id: courseId,
                                                        title,
                                                        status,
                                                        task_id: taskId,
                                                        content: input,
                                                        lang: contentType === "CODE" ? lang : undefined,
                                                        type,
                                                        contentType,
                                                        isFrame: contentType === "LINK" ? isFrame : undefined,
                                                        resource: contentType === "LINK" && isFrame ? resource : undefined,
                                                        frameOption: contentType === "LINK" && isFrame ? frameOption : undefined,
                                                    });
                                                    setSent(true);
                                                }}
                                        >{taskId ? "Изменить" : "Задать"}</Button>
                                        {isExistTask ?
                                            <Button type="fail" onClick={()=> {
                                                props.deleteTask(taskId);
                                                setSent(true);
                                            }}>Удалить задачу</Button>
                                            : null
                                        }
                                    </>

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
        setTask: (config) => dispatch(setTask({...config})),
        resetTask: () => dispatch(resetTask()),
        deleteTask: (taskId) => dispatch(deleteTask(taskId)),
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