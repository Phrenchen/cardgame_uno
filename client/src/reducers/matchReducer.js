import {START_MATCH} from "../actions/types";

const initialState = {
    players: [],
    cards: []
}

export default function(state = initialState, action){
    switch(action.type){
        case START_MATCH:
            return {
                players: action.payload.players,
                //cards: action.payload.cards
                cards: action.payload.cards         // weird parsing shit. clean up somewhere...server side? :/
            };
        default:
            return state;
    }
}