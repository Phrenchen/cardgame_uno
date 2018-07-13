import axios from "axios";
import {START_MATCH, SET_APP_STATE, CARD_PLAYED, PENALTIES_ACCEPTED} from "../actions/types";
import { STATE_MATCH, STATE_GAME_OVER } from "../appStates/AppState";
import ActionConsts from "../shared/ActionConsts";
import MatchHelper from "../shared/MatchHelper";

export const startMatch = () => dispatch => {
    axios
        .post("api/phrens_uno", {
            action:ActionConsts.START_MATCH
            })
            .then( (res) => {
                dispatch({
                    type: START_MATCH,
                    payload: res.data
                });
                // update redux state
                dispatch({
                    type: SET_APP_STATE,
                    payload: STATE_MATCH
                });
            });
};

export const showColorSelector = (cardID) => dispatch => {
    dispatch({
        type: ActionConsts.SELECT_COLOR,
        payload: cardID
    });
}

export const playCard = (pMatchID, pPlayerID, pCardID, selectedColor = null) => dispatch => {
    axios.post("api/phrens_uno/", {
            action:ActionConsts.PLAY_CARD,
            matchID: pMatchID,
            playerID: pPlayerID,
            cardID: pCardID,
            selectedColor: selectedColor
        })
        .then((res) =>{
            dispatch({
                type: CARD_PLAYED,
                payload: res.data
            });
            if(MatchHelper.getWinner(res.data)){
                dispatch({
                    type: SET_APP_STATE,
                    payload: STATE_GAME_OVER
                });
            }
        });
};

export const acceptPenalties = (matchID) => dispatch => {
    axios.post("api/phrens_uno", {
        action: ActionConsts.ACCEPT_PENALTIES,
        matchID: matchID
    })
    .then((res) =>{
        dispatch({
            type: PENALTIES_ACCEPTED,
            payload: res.data
        });
    });
}