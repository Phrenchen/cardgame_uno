import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import roodReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
const store = createStore(roodReducer, 
    initialState, 
    compose(
        applyMiddleware(...middleware)
        
        // enable for debugging. will fail in all browsers without debugging extension
        
        // this does not work with the F5 VCS debugger
        //,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()      
    ));

export default store;