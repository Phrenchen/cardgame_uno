import {combineReducers} from "redux";
import matchReducer from "./matchReducer";
import appStateReducer from "./appStateReducer";


export default combineReducers({
    match: matchReducer,
    appState: appStateReducer
});