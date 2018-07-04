import axios from "axios";
import {START_MATCH, SET_APP_STATE} from "../actions/types";
import { STATE_MATCH } from "../appStates/AppState";

export const startMatch = (playerIDs) => dispatch => {
    console.log("start match");

    axios
        .post("api/matches", (playerIDs))
        .then( (res) => {
            dispatch({
                type: START_MATCH,
                payload: res.data
            });
            dispatch({
                type: SET_APP_STATE,
                payload: STATE_MATCH
            });
        });
};