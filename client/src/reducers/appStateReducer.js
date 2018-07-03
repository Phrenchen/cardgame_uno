import { PLAYER_SETUP } from "../appStates/AppState";
import { SET_APP_STATE } from "./../actions/types";

let initialState = {
    current: PLAYER_SETUP
}

function appState(state = initialState, action){
    let newState = {
        current: state.current
    };

    if(action.type == SET_APP_STATE){
        newState.current = action.value;
    }
    return newState;
}


export default appState; 