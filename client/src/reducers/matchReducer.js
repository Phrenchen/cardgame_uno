import {START_MATCH, SET_PLAYER_COUNT, CARD_PLAYED} from "../actions/types";

const initialState = {
    id: "",
    playerCount: 1,
    players: [],
    cards: [],
    playedCards: [],
    activePlayerID: "",
    topCardID: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_PLAYER_COUNT:
            console.log("reducing match set player count: " + action.type);
            return {
                ...state,
                playerCount: action.payload
            }        
        case CARD_PLAYED:
            console.log("reducing card played: " + action.payload.players[0].cards.length);
        case START_MATCH:
            return {
                ...state,
                id: action.payload.id,
                playerCount: action.payload.playerCount,
                players: action.payload.players,
                cards: action.payload.cards,
                playedCards: action.payload.playedCards,
                activePlayerID: action.payload.activePlayerID,
                topCardID: action.payload.topCardID
            };
        default:
            return state;
    }
}