import {ADD_PLAYER, ITEMS_LOADING, GET_PLAYERS} from "../actions/types";

import axios from "axios";

export const getPlayers = () => dispatch =>{
    dispatch(setItemsLoading());
    axios
        .get("/api/players")
        .then(res => 
            dispatch({
                type: GET_PLAYERS,
                payload: res.data
            }) 
        )

};

export const addPlayer = (player) => dispatch => {
    axios.post("api/players", (player))
        .then( (res) => {
            dispatch({
                type: ADD_PLAYER,
                payload: res.data
            })
        });
}

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};