import {
    AUTH_LOGOUT,
    AUTH_RESET_REDIRECT,
    AUTH_SET_READY_STAGE,
    SIGNIN_ERROR,
    SIGNIN_SUCCESS
} from "../actions/actionTypes";


const randomName = () =>{
    const names =  [
        "Ленивец", "Обезьяна", "Броненосец", "Опоссум", "Слон",
        "Жираф", "Лемур", "Носорог", "Крокодил", "Бегемот", "Колибри",
        "Фламинго", "Павлин", "Анаконда", "Игуана", "Пиранья", "Муравей",
        "Бабочка"
    ]
    return names[Math.ceil(Math.random() * (names.length - 1))]
}

const initialState = {
    token: null,
    name: randomName(),
    error: null,
    roles: [],
    needToRedirect: false,
    readyStage: false,
}


export default function authReducer(state = initialState, action){
    switch (action.type){

        case SIGNIN_SUCCESS:
            return {
                ...state,
                token: action.token,
                name: action.name,
                roles: action.roles,
                needToRedirect: true,
                error: null,
            }
        case SIGNIN_ERROR:
            return {
                ...state,
                error: action.error,
            }
        case AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                name: randomName(),
                roles: [],
                error: null,
                needToRedirect: false,
            }
        case AUTH_RESET_REDIRECT:
            return {
                ...state,
                needToRedirect: false,
            }
        case AUTH_SET_READY_STAGE:
            return {
                ...state,
                readyStage: true,
            }
        default:
            return state
    }

}