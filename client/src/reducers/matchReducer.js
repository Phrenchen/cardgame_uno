import {START_MATCH, SET_PLAYER_COUNT, CARD_PLAYED, PENALTIES_ACCEPTED} from "../actions/types";
import { GAME_OVER } from "../shared/ActionConsts";

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
        case GAME_OVER:
            console.log("reducing game over");
        case PENALTIES_ACCEPTED:
        case CARD_PLAYED:
        case START_MATCH:
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