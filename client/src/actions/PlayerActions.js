import {ADD_PLAYER, ITEMS_LOADING, GET_PLAYERS, DELETE_ALL_PLAYERS} from "../actions/types";

import axios from "axios";

export const deleteAllPlayers = (player) => dispatch => {
    // for each player:
    let id;

    console.log(player.players);

    player.players.map((player) => {
        id = player.id;

        axios
            .delete("/api/players/?" + id)
            .then(res => dispatch ( 
                    dispatch({
                        type: DELETE_ALL_PLAYERS,
                        payload: id
                    })
                
            ))
        });
};

export const deletePlayer = (id) => dispatch => {
    axios
        .delete("/api/players/" + id)
        .then(res => dispatch ( 
            dispatch({
                type: DELETE_ALL_PLAYERS,
                payload: id
            })
        )
    );
}

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