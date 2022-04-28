import React, {Component, useEffect, useState} from "react"
import {connect} from "react-redux";
import {fetchCourseById, fetchCourses, resetRedirect} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import CoursePlank from "./CoursePlank/CoursePlank";
import css from "./Courses.module.css"

function Courses(props){
    const [state, setState] = useState({
        initialLoad: true
    });

    async function initialLoad(){
        props.fetchCourses();
        setState({
            ...state,
            initialLoad: false,
        })
    }

    useEffect(()=> {
        if(props.readyStage){
            initialLoad();
        }
    }, [])

    useEffect(()=> {
        if(props.redirectTo){
            props.resetRedirect();
            props.history.push(props.redirectTo);
        }
        if(props.readyStage && state.initialLoad && !props.courses.courses){
            initialLoad();
        }
    }, [props.redirectTo, props.readyStage, props.initialLoad, props.courses.courses])


    function renderCourses(){
        if(props.courses.courses){
            return props.courses.courses.map(course => {
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

    return (
        <div className={css.Courses}>
            <h1>Курсы</h1>
            {props.courses.courses === null ?
                <Loader type="page" /> :

                renderCourses()
            }
        </div>

    )

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