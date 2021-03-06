import {
    AUTH_ACTIVE_REDIRECT,
    AUTH_LOGOUT, AUTH_RESET_LACK_OF_USERNAME,
    AUTH_RESET_REDIRECT,
    AUTH_RESET_REDIRECT_TO, AUTH_SET_LACK_OF_USERNAME,
    AUTH_SET_READY_STAGE,
    AUTH_SET_REDIRECT_TO,
    AUTH_SET_VK,
    AUTH_SET_VK_SESSION,
    COURSES_RESET_REDIRECT,
    RESET_SIGNIN_ERROR,
    SIGNIN_ERROR,
    SIGNIN_SUCCESS,
    TEST_MESSAGE_FAIL,
    TEST_MESSAGE_SUCCESS
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
    lackOfUsername: false,
    roles: [],
    needToRedirect: false,
    readyStage: false,
    allowMessages: null,
    redirectTo: null,
    vk: null, //Объект вк (id, name, surname, img///. Устанавливается сразу после авторизации в ВК
    testMessage: null, //Результат true/false. Получается с сервера, чтобы запросить права на отпраку сообщений
}


export default function authReducer(state = initialState, action){
    switch (action.type){

        case SIGNIN_SUCCESS:
            return {
                ...state,
                token: action.token,
                name: action.name,
                roles: action.roles,
                group: action.group,
                error: null,
                testMessage: null,
                lackOfUsername: false,
            }
        case AUTH_ACTIVE_REDIRECT:
            return {
                ...state,
                needToRedirect: true,
            }

        case SIGNIN_ERROR:
            return {
                ...state,
                error: action.error,
            }
        case RESET_SIGNIN_ERROR:
            return {
                ...state,
                error: null,
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
        case AUTH_RESET_REDIRECT_TO:
            return {
                ...state,
                redirectTo: false,
            }
        case AUTH_SET_REDIRECT_TO:
            return {
                ...state,
                redirectTo: action.redirectTo,
            }
        case AUTH_SET_READY_STAGE:
            return {
                ...state,
                readyStage: true,
            }
        case AUTH_SET_VK:
            return {
                ...state,
                vk: action.vk,
            }
        case AUTH_SET_VK_SESSION:
            return {
                ...state,
                vk_session: action.vk_session,
            }
        case AUTH_SET_LACK_OF_USERNAME:
            return {
                ...state,
                lackOfUsername: true,
            }
        case AUTH_RESET_LACK_OF_USERNAME:
            return {
                ...state,
                lackOfUsername: false,
            }
        case TEST_MESSAGE_FAIL:
            return {
                ...state,
                testMessage: false,
            }
        case TEST_MESSAGE_SUCCESS:
            return {
                ...state,
                testMessage: true,
            }
        default:
            return state
    }

}