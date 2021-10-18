import {React, Component} from 'react';

import {connect} from "react-redux";
import css from "./Main.module.css"

class Main extends Component{
    render(){
        return (
            <>
                <div className={css.Main}>
                    <h1>Здесь будет главная страница</h1>
                    <p>Но... Пока здесь ничего нет</p>
                </div>
            </>

        )
    }
}

function mapStateToProps(state){
    return {
        isAuthenticated: !!state.auth.token,
    }
}

export default connect(mapStateToProps, null)(Main)