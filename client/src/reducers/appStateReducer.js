import { STATE_SETUP } from "../appStates/AppState";
import { SET_APP_STATE } from "./../actions/types";

let initialState = {
    current: STATE_SETUP
}

function appState(state = initialState, action){
    let newState = {
        current: state.current
    };
    if(action.type == SET_APP_STATE){
        newState.current = (action.payload != undefined) ? action.payload : "no valid state for reducer";
    }
    return newState;
}


export default appState; 