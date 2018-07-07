import {START_MATCH, SET_PLAYER_COUNT, CARD_PLAYED} from "../actions/types";

const initialState = {
    id: "",
    playerCount: 1,
    players: [],
    cards: [],
    playedCards: [],
    activePlayerID: ""
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
            //console.log("reducing card played: " + action.payload.players[0].cards.length);
        case START_MATCH:
            //console.log("reducing match start: ");
            return {
                ...state,
                id: action.payload.id,
                playerCount: action.payload.playerCount,
                players: action.payload.players,
                cards: action.payload.cards,
                playedCards: action.payload.playedCards,
                penalties: action.payload.penalties,
                activePlayerID: action.payload.activePlayerID
            };
        default:
            return state;
    }
}