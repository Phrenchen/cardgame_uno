import {START_MATCH} from "../actions/types";

const initialState = {
    id: "",
    players: [],
    cards: [],
    firstPlayerID: "",
    topCardID: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case START_MATCH:
            return {
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