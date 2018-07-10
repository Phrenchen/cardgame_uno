import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import roodReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
const store = createStore(roodReducer, 
    initialState, 
    compose(
        applyMiddleware(...middleware)//,
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()      // enable for debugging
    ));

export default store;