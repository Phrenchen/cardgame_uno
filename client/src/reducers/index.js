import {combineReducers} from "redux";
import itemReducer from "./itemReducer";
import playerReducer from "./playerReducer";


export default combineReducers({
    item: itemReducer,       // add more reducers here
    players: playerReducer
});