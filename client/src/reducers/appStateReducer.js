import { STATE_START } from "../appStates/AppState";
import { SET_APP_STATE } from "./../actions/types";
import AppState from "../appStates/AppState";
let initialState = {
    current: STATE_START
}

function appState(state = initialState, action){
    switch(action.type){
        case SET_APP_STATE:
            let message;

            switch(action.payload){
                case AppState.STATE_START:
                    message = "start a game with 5 local players.\ncurrently all games are played with open cards.\nwork in progress :)";
                    break;
                case AppState.STATE_MATCH:
                    message = "you need to accept penalty cards before playing a card.";
                    break;
                default:
                    message  = "default halp!";
                    break;

            }
            console.log("help message: " + message);

            return {
                ...state,
                current: (action.payload !== undefined) ? action.payload : "no valid state for reducer",
                helpMessage: message
            };
        default: return state;
    }
}


export default appState; 