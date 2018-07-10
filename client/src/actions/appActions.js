import {SET_APP_STATE} from "../actions/types";

export function setAppState(value){
    return {
        type: SET_APP_STATE,
        payload: value
    };
}