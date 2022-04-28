import React, {Component} from "react"
import css from "./CourseAbout.module.css"
import {connect} from "react-redux";
import {
    fetchAboutCourseById,
    fetchCourseById,
    fetchCourseTasksById, gradeMeeting, joinCourse,
    resetCourse,
    resetCoursesError, resetRedirect,
    setMeeting, shouldGradeMeeting, signupForMeeting, stopMeeting
} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import {resetError, setError} from "../../store/actions/error";
import Button from "../../Components/UI/Button/Button";
import {setHomeworkCourseId, setHomeworkUserStatus} from "../../store/actions/homework";
import CourseBackground from "../../Containers/Course/CourseBackground/CourseBackground";
import {markdown} from "markdown";
import markCss from "../../markdown/Markdown.module.css";
import prepTeachersNames from "../../Containers/Course/auxiliary/prepTeachersNames";
import {setAuthRedirect, setAuthRedirectTo} from "../../store/actions/auth";

class CourseAbout extends Component{


    async initialLoad(){
        this.props.resetError(); //Убираем ошибки при загрузке курса. Мы её получим, если она будет в CWRP
        this.props.fetchCourseById(this.props.match.params.id); //Запрашиваем курс;
        this.setState({
            ...this.state,
            initialLoad: false,
        })
    }

    componentDidMount() {
        if(this.props.readyStage){
            this.initialLoad();
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.redirectTo){
            this.props.resetRedirect();
            this.props.history.push(nextProps.redirectTo);
        }
        if(nextProps.error){
            this.props.setError(nextProps.error);
            this.props.history.push("/error/")
        }
        if(nextProps.readyStage && this.state.initialLoad){
            this.initialLoad();
        }
    }

    componentWillUnmount() {
        this.props.resetCourse();
    }

    state = {
        value: 0,
        editMeeting: false,
        meetingTitle: "",
        meetingContent: "",
        initialLoad: true,
        getGrade: false,
        sendGrade: false,
    }


    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    button(){
        let onClick;
        let openLink = "/courses/about/" + this.props.match.params.id;

        if(!this.props.token){
            onClick = ()=> {
                this.props.setAuthRedirect(openLink);
                this.props.history.push("/signin")
            }
        } else {
            onClick = () => this.props.joinCourse(this.props.id);
        }

        if(this.props.isMine){
            openLink = "/courses/" + this.props.id;
        }

        function openMore(){
            this.props.history.push(openLink);
        }

        let button;
        if(this.props.isMine){
            button = <p className={css.student}>Вы участник курса</p>
        } else if(this.props.join){
            button = <Button type="primary" marginReset={true} onClick={onClick}>Записаться</Button>
        } else{
            button =  <p className={css.warning}>Запись недоступна</p>
        }
        return button;

    }


    render(){
        return (
            <div>
                {
                    !this.props.title ? <Loader type="page"/> :
                        <>
                            <div >
                                <CourseBackground title={this.props.title} preview={this.props.preview}
                                                  teachers={prepTeachersNames(this.props.teachers)}
                                />
                            </div>
                            <div className={css.buttonJoin}>
                                {this.button()}
                            </div>
                            <div className={`${css.aboutCourse} ${markCss["markdown-body"]}`}
                                dangerouslySetInnerHTML={{__html: markdown.toHTML(this.props.about)}}/>
                        </>

                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return {
        fetchCourseById: (id)=> {dispatch(fetchAboutCourseById(id))},
        setError: (error) => {dispatch(setError(error))},
        resetError: () => {dispatch(resetCoursesError())},
        resetCourse: () => {dispatch(resetCourse())},
        joinCourse: (id)=> dispatch(joinCourse(id)),
        resetRedirect: () => {dispatch(resetRedirect())},
        setAuthRedirect: (to) => {dispatch(setAuthRedirectTo(to))}
    }
}

function mapStateToProps(state){
    return {
        title: state.courses.course?.title,
        description: state.courses.course?.description,
        preview: state.courses.course?.preview,
        teachers: state.courses.course?.teachers,
        about: state.courses.course?.about,
        error: state.courses.error,
        id: state.courses.course?.id,
        loading: state.courses.loading,
        readyStage: state.auth.readyStage,
        grade: state.courses.grade,
        gradeLoading: state.courses.gradeLoading,
        token: !!state.auth.token,
        join: state.courses.course?.join,
        isMine: state.courses.course?.isMine,
        redirectTo: state.courses.redirectTo,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseAbout)