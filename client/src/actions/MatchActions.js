import axios from "axios";
import {START_MATCH, SET_APP_STATE, CARD_PLAYED, PENALTIES_ACCEPTED} from "../actions/types";
import { STATE_MATCH } from "../appStates/AppState";

export const startMatch = () => dispatch => {
    console.log("start match");

    // to server
    axios
        .post("api/matches")
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

export const playCard = (pPlayerID, pCardID) => dispatch => {
    axios.post("api/playcard/", {
            playerID: pPlayerID,
            cardID: pCardID
        })
        .then((res) =>{
            //console.log("server responded to played card");
            dispatch({
                type: CARD_PLAYED,
                payload: res.data
            });
        });
};

export const acceptPenalties = (matchID) => dispatch => {
    axios.post("api/acceptPenalties", {
        matchID: matchID
    })
    .then((res) =>{
        dispatch({
            type: PENALTIES_ACCEPTED,
            payload: res.data
        });
    });
}