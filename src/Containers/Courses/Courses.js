import React, {Component} from "react"
import {connect} from "react-redux";
import {fetchCourseById, fetchCourses, resetRedirect} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import CoursePlank from "./CoursePlank/CoursePlank";
import css from "./Courses.module.css"

class Courses extends Component{


    state = {
        initialLoad: true,
    }

    async initialLoad(){
        this.props.fetchCourses();
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
        if(nextProps.redirectTo){
            this.props.resetRedirect();
            this.props.history.push(nextProps.redirectTo);
        }
        if(nextProps.readyStage && this.state.initialLoad){
            this.initialLoad();
        }
    }

    renderCourses(){
        if(this.props.courses.courses){
            return this.props.courses.courses.map(course => {
                return <CoursePlank
                    title={course.title}
                    description={course.description}
                    join={course.join}
                    img={course.preview}
                    id={course.id}
                    isMine={course.isMine}
                    key={course.id}
                />
            })
        } else {
            return <h1>Здесь пока ничего нет</h1>
        }


    }

    render(){
        return (
            <div className={css.Courses}>
                <h1>Курсы</h1>
                {this.props.courses.loading ?
                    <Loader type="page" /> :

                    this.renderCourses()
                }
            </div>

        )
    }
}

function mapStateToProps(state){
    return {
        courses: state.courses,
        redirectTo: state.courses.redirectTo,
        readyStage: state.auth.readyStage,
    }
}

function mapDispatchToProps(dispatch){
    return {
        fetchCourses: ()=> {dispatch(fetchCourses())},
        fetchCourseById: id => {dispatch(fetchCourseById(id))},
        resetRedirect: () => {dispatch(resetRedirect())}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Courses)