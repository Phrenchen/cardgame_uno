import {combineReducers} from "redux";
import playerReducer from "./playerReducer";
import matchReducer from "./matchReducer";
import appStateReducer from "./appStateReducer";


export default combineReducers({
    players: playerReducer,
    match: matchReducer,
    appState: appStateReducer
});