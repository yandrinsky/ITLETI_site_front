import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "../Drawer/Drawer";
import {useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import css from "./Header.module.css"
function Header(props) {
    const [state, setState] = useState({menu: false});

    const toggleMenuHandler = () => {
        setState({
            menu: !state.menu,
        })
    }
    const menuCloseHandler = () =>{
        setState({
            menu: false,
        })
    }

    return (
        <>
            <Drawer
                isOpen={state.menu}
                onClose={menuCloseHandler}
                isAuthenticated={props.isAuthenticated}
            />

            <Box sx={{ flexGrow: 1 }} className={css.Header}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleMenuHandler.bind(this)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}
                            onClick={()=> {props.history.push("/")}}
                                    className={css.logo}
                        >
                            <div className={css.title}><span>IT</span>-<span>ЛЭТИ</span></div>
                        </Typography>
                        <Button color="inherit" className={css.name}>{props.name}</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>

    );
}

function mapStateToProps(state){
    return {
        isAuthenticated: !!state.auth.token,
        name: state.auth.name,
    }
}

export default withRouter(connect(mapStateToProps)(Header));