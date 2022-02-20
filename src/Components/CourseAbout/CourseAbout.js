import React, {Component} from "react"
import css from "./CourseAbout.module.css"
import {connect} from "react-redux";
import {
    fetchAboutCourseById,
    fetchCourseById,
    fetchCourseTasksById, gradeMeeting,
    resetCourse,
    resetCoursesError,
    setMeeting, shouldGradeMeeting, signupForMeeting, stopMeeting
} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import {resetError, setError} from "../../store/actions/error";
import Button from "../../Components/UI/Button/Button";
import {setHomeworkCourseId, setHomeworkUserStatus} from "../../store/actions/homework";
import CourseBackground from "../../Containers/Course/CourseBackground/CourseBackground";
import {markdown} from "markdown";

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
        if(nextProps.error){
            this.props.setError(nextProps.error);
            this.props.history.push("/error/")
        }
        if(nextProps.readyStage && this.state.initialLoad){
            this.initialLoad();
        }

        if(!this.props.grade && this.props.id && !this.state.getGrade){
            this.props.shouldGradeMeeting(this.props.id);
            this.setState({
                ...this.state,
                getGrade: true,
            })
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


    render(){
        return (
            <div>
                {
                    !this.props.title ? <Loader type="page"/> :
                        <>
                            <div >
                                <CourseBackground title={this.props.title} preview={this.props.preview}/>
                            </div>
                            <div className={css.aboutCourse}
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
        fetchTasks: (id) => {dispatch(fetchCourseTasksById(id))},
        setError: (error) => {dispatch(setError(error))},
        resetError: () => {dispatch(resetCoursesError())},
        resetCourse: () => {dispatch(resetCourse())},
        setHomeworkCourseId: (courseId) => {dispatch(setHomeworkCourseId(courseId))},
        setHomeworkUserStatus: (status) => {dispatch(setHomeworkUserStatus(status))},
        setMeeting: (course_id, title, content) => {dispatch(setMeeting(course_id, title, content))},
        stopMeeting: (course_id) => {dispatch(stopMeeting(course_id))},
        signupForMeeting: (course_id) => {dispatch(signupForMeeting(course_id))},
        shouldGradeMeeting: (course_id) => {dispatch(shouldGradeMeeting(course_id))},
        gradeMeeting: (course_id, mark, comment) => {dispatch(gradeMeeting(course_id, mark, comment))},
    }
}

function mapStateToProps(state){
    return {
        title: state.courses.course?.title,
        description: state.courses.course?.description,
        preview: state.courses.course?.preview,
        teachers: state.courses.course?.teachers,
        about: state.courses.course?.about,
        tasks: state.courses.tasks,
        meetings: state.courses.meetings,
        error: state.courses.error,
        role: state.courses.course?.role,
        id: state.courses.course?.id,
        meeting: state.courses.course?.meeting,
        loading: state.courses.loading,
        readyStage: state.auth.readyStage,
        grade: state.courses.grade,
        gradeLoading: state.courses.gradeLoading,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseAbout)