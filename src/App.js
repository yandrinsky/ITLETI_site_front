
import './App.css';
import SignIn from "./Containers/SignIn/SignIn";
import {Route, Switch, withRouter} from "react-router-dom"
import SignUp from "./Containers/SignUp/SignUp";
import SwipeableTemporaryDrawer from "./Containers/Main/Main";
import Layout from "./hoc/Layout/Layout";
import Courses from "./Containers/Courses/Courses";
import {useHistory} from "react-router-dom"
import NotFound from "./Components/NotFound/NotFound";
import InDevelopment from "./Components/InDevelopment/InDevelopment";
import Logout from "./Components/Logout/Logout";
import React from "react"
import {connect} from "react-redux";
import {autoLogin, setReadyStage} from "./store/actions/auth";
import Course from "./Containers/Course/Course";
import Task from "./Containers/Task/Task";
import ERROR from "./Components/Error/ERROR";
import Homework from "./Containers/Homework/Homewrok";
export function Redirect(where){
    const history = useHistory();
    history.push(where);
}

class App extends React.Component{

    async componentDidMount() {
        console.log("APP did mount")
        await this.props.autoLogin();
        this.props.setReadyStage();
    }

    render(){
        const initialSwitch = (
            <Switch>
                <Route path={'/signup'} exact component={SignUp} />
                <Route path={'/signin'} exact component={SignIn} />
                <Route path={'/courses'} exact component={Courses} />
                <Route path={'/courses/about_:id'}  component={InDevelopment} />
                <Route path={'/courses/:id'}  component={Course} />
                <Route path={'/tasks/:id'}  component={Task} />
                <Route path={'/logout'} exact component={Logout} />
                <Route path={'/error'} exact component={ERROR} />
                <Route path={'/homework'} exact component={Homework} />
                <Route path={'/'} exact component={SwipeableTemporaryDrawer} />
                <Route component={NotFound}/>
            </Switch>
        )

        return (
            <>
                <Layout>
                    {initialSwitch}
                </Layout>
            </>
        );
    }

}

function mapDispatchToProps(dispatch){
    return {
        autoLogin: () => dispatch(autoLogin()),
        setReadyStage: ()=> dispatch(setReadyStage())
    }
}

function mapStateToProps(state){
    return {
        isAuthenticated: !!state.auth.token,
        roles: state.auth.roles,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));