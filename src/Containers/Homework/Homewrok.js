import React, {Component} from "react"
import css from "./Homework.module.css"
import {connect} from "react-redux";
import {getHomework, gradeHomework} from "../../store/actions/homework";
import Loader from "../../Components/UI/Loader/Loader";
import Comment from "../../Components/Comment/Comment";
import HomeworkStatus from "../../Components/UI/HomeworkStatus/HomeworkStatus";

//Интерфейс проверки дз преподавателем

class Homework extends Component{

    componentDidMount() {
        this.props.getHomework();

        this.setState({
            ...this.state,
            clickGradeBtn: false,
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            ...this.state,
            clickGradeBtn: false,
        });
    }


    state = {
        showComments: false,
        commentText: "",
        finish: false,
        clickGradeBtn: false,
    }

    commentHandler(e){
        this.setState({
            ...this.state,
            commentText: e.target.value,
        })
    }

    formComments(){
        const comments = this.props.homework.comments.map(comment => {
            return <Comment role={comment.type}
                            content={comment.content}
                            name={""}
                            disabled
            />
        })
        comments.unshift(
            <>
                <Comment role={"TEACHER"} name={"Я"}
                         content={this.state.commentText}
                         onChange={this.commentHandler.bind(this)}
                />
                <hr/>
            </>

        )

        return comments;
    }

    gradeHandler(status){
        const commentText = this.state.commentText;
        this.setState({
            ...this.state,
            commentText: "",
            clickGradeBtn: true,
        })

        this.props.gradeHomework(this.props.id, status, commentText || null);
    }



    innerRender(){
        function getFrameSrc(){
            let iframeSrc;

            if(this.props.task.frame){
                if(this.props.task.frameOption){
                    iframeSrc = this.props.task.frameOption.replace("$", this.props.homework.content);
                } else {
                    iframeSrc = this.props.homework.content;
                }
            }
            console.log("getFrameSrc", this.props);
            return iframeSrc;
        }


        if(this.props.courseId){
            if(this.props.finish){
                return <h1>Проверять больше нечего</h1>
            } else {
                if(this.props.homework){
                    return (
                        <div className={css.Homework}>
                            <div className={css.wrapper}>
                                <div className={css.task}>
                                    <h1>{this.props.task.title}</h1>
                                    <p>{this.props.task.content}</p>
                                </div>

                                <div className={css.homeworkItems}>
                                    <p>Осталось работ: {this.props.needToCheck}</p>
                                    <p>Student work</p>

                                    {this.props.task.frame ? <p>{this.props.homework.content}</p> : null}

                                    <button onClick={() => {
                                        this.setState({showComments: !this.state.showComments})
                                    }}>
                                        Комментарии: {this.props.homework.comments.length}
                                    </button>
                                    <br/>
                                    {!this.state.clickGradeBtn ? <>
                                        <div className={css.check_btn} onClick={() => {
                                            this.gradeHandler("PASSED")
                                        }}>
                                            <HomeworkStatus status={"PASSED"}/>
                                        </div>

                                        <div className={css.check_btn} onClick={() => {
                                            this.gradeHandler("FAILED")
                                        }}>
                                            <HomeworkStatus status={"FAILED"}/>
                                        </div>
                                    </> : <Loader/>}
                                </div>

                            </div>

                            {
                                this.state.showComments ?
                                    <>
                                        {this.formComments()}
                                    </>
                                    : null
                            }

                            {
                                this.props.task.frame ?
                                    <iframe src={getFrameSrc.call(this)}
                                            allowFullScreen="allowfullscreen" frameBorder="0"
                                            className={css.iframe}
                                    />
                                : <div className={css.text_homework}>{this.props.homework.content}</div>
                            }

                        </div>
                    )
                } else {
                    return <Loader type="page"/>
                }
            }

        } else {
            return <h1>Недостаточно прав</h1>
        }
    }

    render() {
        return this.innerRender();
    }
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
