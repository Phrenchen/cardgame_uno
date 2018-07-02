import axios from "axios";
import {START_MATCH} from "../actions/types";

export const startMatch = (playerIDs) => dispatch => {
    console.log("start match");
    console.log(playerIDs);

    axios
        .post("api/matches", (playerIDs))
        .then( (res) => {
            dispatch({
                type: START_MATCH,
                payload: res.data
            })
        });
};