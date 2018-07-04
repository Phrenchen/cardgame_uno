import axios from "axios";
import {START_MATCH, SET_APP_STATE, SET_PLAYER_COUNT} from "../actions/types";
import { STATE_MATCH } from "../appStates/AppState";

export const startMatch = (playerIDs) => dispatch => {
    console.log("start match");

    // to server
    axios
        .post("api/matches", (playerIDs))
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


export const setPlayerCount = (count) => dispatch => {
    console.log("matchActions: send player count " + count + "to server");
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