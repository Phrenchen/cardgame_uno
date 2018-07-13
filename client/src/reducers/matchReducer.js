import {START_MATCH, GAME_OVER, SET_PLAYER_COUNT, CARD_PLAYED, PENALTIES_ACCEPTED} from "../actions/types";

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
        case PENALTIES_ACCEPTED:
        case CARD_PLAYED:
        case GAME_OVER:
        case START_MATCH:
            return {
                ...state,
                id: action.payload.id,
                playerCount: action.payload.playerCount,
                players: action.payload.players,
                cards: action.payload.cards,
                playedCards: action.payload.playedCards,
                penalties: action.payload.penalties,
                activePlayerID: action.payload.activePlayerID,
                selectedColor: action.payload.selectedColor
            };
        default:
            return state;
    }
}