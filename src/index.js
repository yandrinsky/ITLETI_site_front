import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./store/reducers/rootReducer";
import thunk from "redux-thunk";

//dev
// const composeEnhancers =
//     typeof window === 'object' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//         window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         }) : compose;
//
// const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
//production
const store = createStore(rootReducer, applyMiddleware(thunk))

let app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

ReactDOM.render(
    app,
  document.getElementById('root')
);
