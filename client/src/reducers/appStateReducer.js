import { STATE_START } from "../appStates/AppState";
import { SET_APP_STATE } from "./../actions/types";

let initialState = {
    current: STATE_START
}

function appState(state = initialState, action){
    switch(action.type){
        case SET_APP_STATE:
            return {
                ...state,
                current: (action.payload !== undefined) ? action.payload : "no valid state for reducer"
            };
        default: return state;
    }
}


export default appState; 