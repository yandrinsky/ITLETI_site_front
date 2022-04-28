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
import is from "is_js"
import {connect} from "react-redux";
import {registration, resetAuthRedirectTo, resetRedirect, resetSignInError, signIn} from "../../store/actions/auth";
import Loader from "../../Components/UI/Loader/Loader";
import css from "./SignUp.module.css"
import Popup from "../../Components/UI/Popup/Popup";

const VK = window.VK;

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


function messages(error, props, state){
    if(props.error){
        return(
            <Typography component="h1" variant="h5" style={{color: "red", marginBottom: 25}}>
                {props.error}
            </Typography>
        )
    } else if(error){
        return (
            <Typography component="h1" variant="h5" style={{color: "red", marginBottom: 25}}>
                {error}
            </Typography>
        )
    } else {
        return (
            <Typography component="h1" variant="h5" className={css.title}>
                {state.regMode? "Регистрация" : "Изменение"} аккаунта
            </Typography>
        )
    }
}

class SignUp extends React.Component{

    state = {
        error: null,
        tryingToSignUp: false,
        group: "",
        email: "",
        regMode: !this.props.lackOfUsername,
        popup: this.props.lackOfUsername,
    }

    componentDidMount() {
        this.props.resetSignInError();
        VK.Widgets.AllowMessagesFromCommunity("vk_send_message", {height: 30}, 206978384);
        VK.Observer.subscribe("widgets.allowMessagesFromCommunity.allowed", () => {
            this.props.register({
                name: this.state.first_name,
                surname: this.state.last_name,
                vk_id: this.state.id,
                vk_link: this.state.link,
                group: this.state.group,
            });
        })

        if(this.props.vk){
            this.setState({
                ...this.state,
                first_name: this.props.vk.first_name,
                last_name: this.props.vk.last_name,
                id: this.props.vk.id,
                link: this.props.vk.href,
            })
        } else {
            this.props.history.push("/signIn")
        }


    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.error){
            console.log("HERE");
            this.setState({...this.state, tryingToSignUp: false})
        }

        if (nextProps.needToRedirect && !nextProps.error) {
            this.props.resetRedirect();
            if(nextProps.redirectTo){
                this.props.resetAuthRedirectTo();
                nextProps.history.push(nextProps.redirectTo);
            } else{
                nextProps.history.push('/courses');
            }

        } else if(nextProps.vk) {
            this.setState({
                ...this.state,
                first_name: this.props.vk.first_name,
                last_name: this.props.vk.last_name,
                group: this.props.group,

            })
        } else if(nextProps.testMessage === false){


        } else {
            this.setState({...this.state, tryingToSignUp: false})
        }
    }

    handleGroup(e){
        this.setState({...this.state, error: null, group: e.target.value});
    }
    handleName(e){
        this.setState({...this.state, error: null, first_name: e.target.value});
    }
    handleSurname(e){
        this.setState({...this.state, error: null, last_name: e.target.value});
    }
    handleEmail(e){
        this.setState({...this.state, error: null, email: e.target.value});
    }
    handlePassword(e){
        this.setState({...this.state, error: null, password: e.target.value});
    }
    handlePassword2(e){
        this.setState({...this.state, error: null, password2: e.target.value});
    }
    handleUsername(e){
        this.setState({...this.state, error: null, username: e.target.value});
    }


    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        //const email = data.get('email');
        //const password = data.get('password');
        const group = this.state.group;
        const name = this.state.first_name;
        const surname = this.state.last_name;
        const password = this.state.password;
        const password2 = this.state.password2;
        const username = this.state.username;
        //const vk = data.get('vk');

        let upperThis = this;
        function setError(e){
            upperThis.setState({error: e});
        }

        if(group && name && surname && password && password2 && username){
            if(is.nan(Number(group))){
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
            } else if(this.state.password !== this.state.password2){
                setError("Пароли не совпадают")
                return;
            } else if(this.state.username && this.state.username.length < 4){
                setError("username слишком короткий")
                return;
            }

            setError(null);
            this.setState({...this.state, tryingToSignUp: true})
            console.log("tryingToSignUp: true");
            this.props.register({
                name: this.state.first_name,
                surname: this.state.last_name,
                vk_id: this.props.vk.id,
                vk_link: this.props.vk.href,
                group: this.state.group,
                password: this.state.password,
                username: this.state.username,
            });
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
                        <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 3 }}>
                        {this.props.testMessage === null ? <>
                            {messages(this.state.error, this.props, this.state)}

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
                                            onChange={this.handleName.bind(this)}
                                            value={this.state.first_name}
                                            disabled={this.props.lackOfUsername}
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
                                            onChange={this.handleSurname.bind(this)}
                                            value={this.state.last_name}
                                            disabled={this.props.lackOfUsername}
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
                                            onChange={this.handleGroup.bind(this)}
                                            value={this.state.group}
                                            disabled={this.props.lackOfUsername}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="username"
                                            label="username"
                                            name="username"
                                            onChange={this.handleUsername.bind(this)}
                                            value={this.state.username}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="password"
                                            label="password"
                                            name="password"
                                            onChange={this.handlePassword.bind(this)}
                                            value={this.state.password}
                                            type="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="password2"
                                            label="password"
                                            name="password2"
                                            onChange={this.handlePassword2.bind(this)}
                                            value={this.state.password2}
                                            type="password"
                                        />
                                    </Grid>
                                    {/*</Grid>*/}


                                </Grid>
                                {
                                    !this.state.tryingToSignUp ?
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            {this.state.regMode ? "Регистрация" : "Изменить"}
                                        </Button> :
                                        <Loader/>
                                }

                        </>
                            : null
                        }

                            <div className={this.props.testMessage === null ? css.hide : css.center}>
                                <h3>Разрешите отправку сообщений чтобы продолжить регистрацию</h3>
                                <Grid item xs={12}>
                                    <div id="vk_send_message" ref={this.vkSignInRef}/>
                                </Grid>
                            </div>

                        </Box>
                    </Box>
                    <Popup onAccept={()=> this.setState({...this.state, popup: false})}
                        onDeny={()=> this.setState({...this.state, popup: false})}
                           open={this.state.popup}
                    >
                        <h1>Изменение способа входа</h1>
                        <p><b>С вашим аккаунтом всё хорошо</b>, мы просто добавили новую возможность входа - по логину и
                            паролю. Вам необходимо задать логин и пароль, чтобы воспользоваться данной возможностью
                        </p>
                    </Popup>
                </Container>
            </ThemeProvider>
        );
    }

}
function mapDispatchToProps(dispatch){
    return {
        register: (username, password, group, vk, name, surname) => dispatch(registration(username, password, group, vk, name, surname)),
        resetSignInError: () => dispatch(resetSignInError()),
        resetRedirect: ()=> dispatch(resetRedirect()),
        resetAuthRedirectTo: ()=> dispatch(resetAuthRedirectTo()),
    }
}
function mapStateToProps(state){
    return {
        error: state.auth.error,
        needToRedirect: state.auth.needToRedirect,
        redirectTo: state.auth.redirectTo,
        vk: state.auth.vk,
        group: state.auth.group,
        testMessage: state.auth.testMessage,
        lackOfUsername: state.auth.lackOfUsername,
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));