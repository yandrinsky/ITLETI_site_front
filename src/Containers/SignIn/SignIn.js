import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {withRouter} from "react-router-dom";
import {NLink} from "../../Components/UI/NLink/Nlink";
import {connect} from "react-redux";

import {resetRedirect, signIn} from "../../store/actions/auth";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/">
                IT-LETI
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();



class  SignIn extends React.Component{

    state = {
        error: false,
    }

    messages(){
        if(this.props.error){
            return(
                <Typography component="h1" variant="h5" style={{color: "red"}}>
                    Неверный логин или пароль
                </Typography>
            )
        } else if(this.state.error){
            return (
                <Typography component="h1" variant="h5" style={{color: "red"}}>
                    Заполните все поля
                </Typography>
            )
        } else {
            return (
                <Typography component="h1" variant="h5">
                    Вход в аккаунт
                </Typography>
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.needToRedirect && !nextProps.error) {
            resetRedirect();
            nextProps.history.push('/');
        }
    }



    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        if(email && password){
            this.props.signIn(email, password);
        } else {
            this.setState({error: true})
        }
    };

    render(){
        return (
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://sun9-78.userapi.com/impg/BCxd-KtiFGzOCW9u0Xob26ePqRGkp4QwOON30A/-snmSXaTLxY.jpg?size=1079x1080&quality=96&sign=058ffa8797a0b30697c5c6e85534bb51&type=album)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {/*<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>*/}
                            {/*    /!*<LockOutlinedIcon />*!/*/}
                            {/*</Avatar>*/}
                            {this.messages()}
                            <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Войти
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <NLink to="#" variant="body2">
                                            Забыли пароль?
                                        </NLink>
                                    </Grid>
                                    <Grid item>
                                        <NLink to="/signup" variant="body2">
                                            {"Нет аккаунта? Зарегистрируйтесь"}
                                        </NLink>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        signIn: (username, password)=>{dispatch(signIn(username, password))},
        resetRedirect: () => {dispatch(resetRedirect())}
    }
}

function mapStateToProps(state){
    return {
        needToRedirect: state.auth.needToRedirect,
        error: state.auth.error,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));