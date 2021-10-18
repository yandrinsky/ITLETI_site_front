import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {withRouter} from "react-router-dom";
import {NLink} from "../../Components/UI/NLink/Nlink";
import is from "is_js"
import {connect} from "react-redux";
import {registration, resetRedirect} from "../../store/actions/auth";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();


function messages(error, props){
    if(props.error){
        return(
            <Typography component="h1" variant="h5" style={{color: "red"}}>
                Пользователь уже существует
            </Typography>
        )
    } else if(error){
        return (
            <Typography component="h1" variant="h5" style={{color: "red"}}>
                {error}
            </Typography>
        )
    } else {
        return (
            <Typography component="h1" variant="h5">
                Регистрация аккаунта
            </Typography>
        )
    }
}

class SignUp extends React.Component{

    state = {
        error: null,
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.needToRedirect && !nextProps.error) {
            resetRedirect();
            nextProps.history.push('/');
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        const email = data.get('email');
        const password = data.get('password');
        const group = data.get('group');
        const name = data.get('name');
        const surname = data.get('surname');
        const vk = data.get('vk');

        let upperThis = this;
        function setError(e){
            upperThis.setState({error: e});
        }

        if(email && password && group && name && surname && vk){
            if(password.length < 6){
                setError("Пароль не может быть менее 6 символов");
                return
            } else if(!is.email(email)){
                setError("Почта указана неверно");
                return;
            } else if(is.nan(Number(group))){
                setError("Группа указана неверно")
                return;
            } else if(String(group).length !== 4){
                setError("Номер группы должен иметь 4 цифры")
                return;
            } else if(name.length < 2){
                setError("Имя не может быть менее 2 букв")
                return;
            } else if(surname.length < 2){
                setError("Фамилия не может быть менее 2 букв")
                return;
            } else if(!is.url(vk)){
                setError("Ссылка на vk неверна")
                return;
            }
            setError(null);
            this.props.register(email, password, group, vk, name, surname);


        } else {
            setError("Заполните все поля");
        }
    };
    render(){
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {messages(this.state.error, this.props)}
                        <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Имя"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Фамилия"
                                        name="surname"
                                        autoComplete="lname"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="group"
                                        label="Группа"
                                        name="group"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="vk"
                                        label="Ссылка на vk.com"
                                        name="vk"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Пароль"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Регистрация
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <NLink to="/signin">
                                        Уже есть аккаут? Войдите
                                    </NLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }

}
function mapDispatchToProps(dispatch){
    return {
        register: (username, password, group, vk, name, surname) => dispatch(registration(username, password, group, vk, name, surname)),
    }
}
function mapStateToProps(state){
    return {
        error: state.auth.error,
        needToRedirect: state.auth.needToRedirect,
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));