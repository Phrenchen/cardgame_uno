import {START_MATCH} from "../actions/types";

const initialState = {
    players: [],
    cards: []
}

export default function(state = initialState, action){
    switch(action.type){
        case START_MATCH:
            console.log(action.payload);
            console.log(action.payload.cards);
            console.log(action.payload.cards.length);
            console.log(action.payload.cards[0]);
            console.log(action.payload.cards[0].cardDeck);
            return {
                players: action.payload.players,
                //cards: action.payload.cards
                cards: action.payload.cards[0].cardDeck         // weird parsing shit. clean up somewhere...server side? :/
            };
        default:
            return state;
    }
}