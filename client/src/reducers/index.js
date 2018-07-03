import {combineReducers} from "redux";
import itemReducer from "./itemReducer";
import playerReducer from "./playerReducer";
import matchReducer from "./matchReducer";
import appStateReducer from "./appStateReducer";


export default combineReducers({
    item: itemReducer,       // add more reducers here
    players: playerReducer,
    match: matchReducer,
    appState: appStateReducer
});