import React from "react"
import css from "./CoursePlank.module.css"
import {server} from "../../../axios/server";
import Button from "../../../Components/UI/Button/Button";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {joinCourse} from "../../../store/actions/courses";


function CoursePlank(props) {

    let openLink = "/courses/about_" + props.id


    let onClick;
    if(!props.token){
        onClick = ()=> props.history.push("/signin")
    } else {
        onClick = () => props.joinCourse(props.id);
    }

    if(props.isMine){
        openLink = "/courses/" + props.id;
    }

    function openMore(){
        props.history.push(openLink);
    }

    function button(){
        let button;
        if(props.isMine){
            button = <p className={css.student}>Вы участник курса</p>
        } else if(props.join){
            button = <Button type="primary" marginReset={true} onClick={onClick}>Записаться</Button>
        } else{
            button =  <p className={css.warning}>Запись недоступна</p>
        }
        return button;

    }

    return (
        <div className={css.Course}>
            <div className={css.image}
                 style={{backgroundImage: `url("${server}${props.img}")`}}
                 onClick={openMore}
            />
            <div className={css.data}>
                <h3 className={css.title}
                    onClick={openMore}
                >{props.title}</h3>
                <p className={css.description}>{props.description}</p>
                {button()}
            </div>


        </div>
    )
}
function mapStateToProps(state){
    return {
        token: !!state.auth.token,
    }
}
function mapDispatchToProps(dispatch){
    return {
        joinCourse: (id)=> dispatch(joinCourse(id)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoursePlank));
