import React from "react"
import css from "./Layout.module.css"
import {connect} from "react-redux";
import Header from "../../Components/Navigation/Header/Header";

class Layout extends React.Component{
    render() {
        return(
            <>
                <Header/>
                <div className={css.Layout}>
                    <main>
                        {
                            this.props.children
                        }
                    </main>
                </div>
            </>
        )
    }
}



export default connect(null)(Layout);