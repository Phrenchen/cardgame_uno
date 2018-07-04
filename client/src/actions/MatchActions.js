import axios from "axios";
import {START_MATCH, SET_APP_STATE, SET_PLAYER_COUNT} from "../actions/types";
import { STATE_MATCH } from "../appStates/AppState";

export const startMatch = (playerCount) => dispatch => {
    console.log("start match with " + playerCount + " players");

    // to server
    axios
        .post("api/matches/?", (playerCount))
        .then( (res) => {
            //console.log("matches response: ");
            //console.log(res);
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


export const setPlayerCount = (count) => dispatch => {
    //console.log("matchActions: save player count " + count);
    dispatch({
        type: SET_PLAYER_COUNT,
        payload: count
    });
    /*
    // to server
    axios
        .post("api/matches", (count))
        .then( (res) => {
            dispatch({
                type: SET_PLAYER_COUNT,
                payload: res.data
            });
        });
    */
};