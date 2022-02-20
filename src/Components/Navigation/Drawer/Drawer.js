import React, {Component} from "react"
import {NavLink} from "react-router-dom";
import css from "./Drawer.module.css"
import Backdrop from "../../UI/Backdrop/Backdrop";


class Drawer extends Component{

    renderLinks(links){
        return links.map((link, index)=>{
            return (
                <li key={index}>
                    <NavLink
                        to={link.to}
                        exact={link.exact}
                        activeClass={css.active}
                        onClick={this.props.onClose}
                    >
                        {link.label}

                    </NavLink>
                </li>
            )
        })
    }

    render() {

        const cls = [css.Drawer]

        if(!this.props.isOpen){
            cls.push(css.close)
        }

        const links = [
            // {to: '/', label: 'Главная', exact: true},
            {to: '/courses', label: 'Курсы', exact: true},
        ]

        if(this.props.isAuthenticated){
            links.push({to: '/logout', label: 'Выйти', exact: false})
        } else {
            links.push({to: '/signin', label: 'Войти', exact: false})
        }

        return(
            <>
                <nav className={cls.join(" ")}>
                    <ul>
                        {this.renderLinks(links)}
                    </ul>
                </nav>
                {
                    this.props.isOpen ? <Backdrop onClick={this.props.onClose}/> : null
                }

            </>

        )
    }
}

export default Drawer