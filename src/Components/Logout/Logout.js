import React, {Component} from "react"
import {connect} from "react-redux";
import {logout} from "../../store/actions/auth";
import {Redirect} from "react-router-dom"
const VK = window.VK;
class Logout extends Component{

    componentDidMount() {
        this.props.logout();
        VK.Auth.logout((props)=> {

        })
    }

    render(){
        return (
            <Redirect to={'/signin'}/>
        )
    }
}

function mapDispatchToProps(dispatch){
    return {
        logout: () => dispatch(logout())
    }
}


export default connect(null, mapDispatchToProps)(Logout)
