import React, {Component} from "react"
import {connect} from "react-redux";
import Loader from "../../Components/UI/Loader/Loader";
import Button from "../../Components/UI/Button/Button";
import css from "./Task.module.css"
import {markdown} from "markdown"
import markCss from "./../../markdown/Markdown.module.css"

import AddCommentIcon from '@material-ui/icons/AddComment'
import ClearIcon from '@material-ui/icons/Clear'

import Comment from "../../Components/Comment/Comment";
import HomeworkStatus from "../../Components/UI/HomeworkStatus/HomeworkStatus";
import {setError} from "../../store/actions/error";
import {withRouter} from "react-router-dom";
import {fetchTaskById, resetTask, sendHomework} from "../../store/actions/task";
import {logout, setAuthRedirectTo} from "../../store/actions/auth";
import {resetAuthError} from "../../store/actions/courses";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Textarea from "../../Components/UI/Textarea/Textarea";


//Интерфейс отправки дз учеником

class Task extends Component{


    state = {
        homeworkText: "",
        commentExist: false,
        commentText: this.props.task?.homework,
        date: null,
        error: null,
        start: true,
        status: null,
        initialLoad: true,
    }

    componentWillUnmount() {
        this.props.resetTask();
    }

    async initialLoad(){
        this.props.fetchTaskById(this.props.match.params.id);
        this.setState({
            ...this.setState({
                initialLoad: false,
            })
        })
    }
    componentDidMount() {
        if(this.props.readyStage){
            this.initialLoad();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.task && this.state.start){
            this.setState({
                homeworkText: nextProps.task.homework,
                start: false,
                status: nextProps.task.type,
                comments: nextProps.task.comments,
            })
        }

        if(nextProps.task){
            if(nextProps.task !== this.props.task){
                this.setState({
                    //status: nextProps.task.type,
                    status: nextProps.task.status,
                    comments: nextProps.task.comments,
                })
            }
        }

        if(nextProps.authError){
            this.props.setAuthRedirectTo("/tasks/" + this.props.match.params.id);
            this.props.resetAuthError();
            this.props.history.push("/signin");
        }

        if(nextProps.error){
            this.props.setError(nextProps.error);
            this.props.history.push("/error");
        }



        if(nextProps.readyStage && this.state.initialLoad){
            this.initialLoad();
        }
    }

    addComment() {
        this.setState({
            ...this.state,
            commentExist: true,
            date: this.createTimestamp()
        })
    }

    removeComment() {
        this.setState({
            ...this.state,
            commentExist: false,
            date: null,
            commentText: "",
            error: this.state.error === "Комментарий не может быть пустым" ? null : this.state.error,
        })
    }

    commentHandler(value){
        this.setState({
            ...this.state,
            commentText: value,
            error: null,
        })
    }

    createTimestamp(){
        const MYDate = new Date();
        const date = MYDate.getDate();
        const month = MYDate.getMonth() + 1;
        const hours = MYDate.getHours();
        const minutes = String(MYDate.getMinutes()).length < 2 ? "0" + MYDate.getMinutes() : MYDate.getMinutes();
        const seconds = MYDate.getSeconds();
        return {
            date: date + "." + month + " " + hours + ":" + minutes + ":" + seconds,
            timestamp: MYDate.getTime(),
        }
    }

    homeworkHandle(value){
        this.setState({
            ...this.state,
            error: null,
            homeworkText: value,
        })

    }

    send() {
        if(this.state.homeworkText) {
            if(this.state.commentExist && this.state.commentText === ""){
                this.setState({
                    ...this.state,
                    error: "Комментарий не может быть пустым",
                })
            } else {
                this.setState({
                    ...this.state,
                    sent: true,
                })

                this.props.sendHomework(this.props.match.params.id, this.state.homeworkText,
                    this.state.commentText || null)
            }

        } else {
            this.setState({
                ...this.state,
                error: "Ответ не может быть пустым",
            })
        }
    }

    render(){
        return (
            <>
                {!this.props.task ? <Loader type="page"/> :
                    <div className={css.Task}>
                        <div className={css.data}>
                            <div className={markCss["markdown-body"]}
                               dangerouslySetInnerHTML={{__html: markdown.toHTML("#" + this.props.task.title)}}
                            />
                            <div className={css.hmwStatus}>
                                <HomeworkStatus status={this.props.task.homeworkStatus}/>
                            </div>

                            <ReactMarkdown children={this.props.task.content} className={markCss["markdown-body"]} remarkPlugins={[remarkGfm]}/>
                        </div>

                        <div className={css.form}>
                            <h2>Ваш ответ: </h2>
                            {
                                this.props.task.contentType === "LINK" ?
                                    <>
                                        <p>Ожидается ссылка на ресурс {this.props.task.resource}</p>
                                        <input type="text" disabled={!this.props.task.ableToSend}
                                               value={this.state.homeworkText}
                                               onChange={(e)=> this.homeworkHandle.call(this, e.target.value)}
                                        />
                                    </> : null
                            }
                            {
                                this.props.task.contentType === "TEXT" ?
                                    <Textarea name="" id="" cols="30" rows="10"
                                              disabled={!this.props.task.ableToSend}
                                              value={this.state.homeworkText}
                                              onChange={this.homeworkHandle.bind(this)}
                                              className={css.Textarea}
                                    >        </Textarea>
                                    : null
                            }


                            {
                                !this.state.commentExist && this.props.task.ableToSend?
                                    <AddCommentIcon className={css.addComment}
                                        onClick={this.addComment.bind(this)}
                                    /> :
                                    null
                            }

                            {
                                this.state.commentExist && this.props.task && this.props.task.ableToSend?
                                        <div className={css.currentComment}>
                                            <Comment
                                                name="Я"
                                                date={this.state.date.date}
                                                role="STUDENT"
                                                content={this.state.commentText}
                                                className={css.currentComment}
                                                onChange={(e)=> {this.commentHandler(e)}}
                                                placeholder={"Ваш комментарий"}
                                            />
                                            <div className={css.deleteComment}>
                                                <ClearIcon onClick={this.removeComment.bind(this)}/>
                                            </div>

                                        </div>
                                     :
                                    null
                            }

                            {
                                this.props.sending ?
                                    <Loader /> : this.props.task.ableToSend ?
                                    <Button type="primary"
                                            disabled={!this.props.task.ableToSend}
                                            onClick={this.send.bind(this)}
                                    >Отправить</Button> : null

                            }

                            { this.state.error ? <div className={css.error}>{this.state.error}</div> : null}
                            { this.props.sendingError ? <div className={css.error}>{this.props.sendingError}</div> : null}

                            <hr/>

                        </div>

                        <div className={css.comments}>
                            {
                                this.state.comments.map((comment, index) => {
                                    return <Comment disabled
                                                    content={comment.content}
                                                    name={comment.name}
                                                    role={comment.type}
                                                    key={index}
                                            />
                                })
                            }
                        </div>
                    </div>

                }
            </>
        )
    }
}


function mapDispatchToProps(dispatch){
    return {
        fetchTaskById: (id) => {dispatch(fetchTaskById(id))},
        resetTask: () => {dispatch(resetTask())},
        sendHomework: (task_id, homework, comment) => {dispatch(sendHomework(task_id, homework, comment))},
        setError: (error) => {dispatch(setError(error))},
        setAuthRedirectTo: (to) => {dispatch(setAuthRedirectTo(to))},
        resetAuthError: (to) => {dispatch(resetAuthError())}
    }
}

function mapStateToProps(state){
    return {
        task: state.task.task,
        sending: state.task.loading,
        sendingError: state.task.error,
        sendingSuccess: state.task.homeworkSuccess,
        error: state.task.error,
        authError: state.courses.authError,
        readyStage: state.auth.readyStage,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Task))