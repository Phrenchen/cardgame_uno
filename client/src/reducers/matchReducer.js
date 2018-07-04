import {START_MATCH, SET_PLAYER_COUNT} from "../actions/types";

const initialState = {
    id: "",
    playerCount: 1,
    players: [],
    cards: [],
    firstPlayerID: "",
    topCardID: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_PLAYER_COUNT:
            return {
                ...state,
                playerCount: action.payload
            }        
        case START_MATCH:
            return {
                ...state,
                id: action.payload.id,
                players: action.payload.players,
                cards: action.payload.cards,
                firstPlayerID: action.payload.firstPlayerID,
                topCardID: action.payload.topCardID
            };
        default:
            return state;
    }
}