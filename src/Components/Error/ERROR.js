import React, {useEffect} from "react"
import css from "./Error.module.css"
import {connect} from "react-redux";
import {resetError} from "../../store/actions/error";
import {withRouter} from "react-router-dom";


function mapStateToProps(state){
    return {
        error: state.error.error,
    }
}
function mapDispatchToProps(dispatch){
    return {
        resetError: () => {dispatch(resetError())},
    }
}

const ERROR = (props) => {
    useEffect(() => {
        if(!props.error){
            props.history.push("/")
        }
        // returned function will be called on component unmount
        return () => {
            props.resetError();
        }
    }, [])

    return (
        <div>
            <h1 className={css.NotFound}>{props.error}</h1>
        </div>
    )
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ERROR));
