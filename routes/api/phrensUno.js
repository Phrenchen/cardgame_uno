const express = require("express");
const phrensUnoRouter = express.Router();
const ActionConsts = require("../../client/src/shared/ActionConsts");

phrensUnoRouter.post("/", (req, res) =>{
    let action = req.body.action;
    console.log("routing phrensUno: " + action);

    switch(action){
        case ActionConsts.START_MATCH:
            break;
        case ActionConsts.PLAY_CARD:
            break;
        case ActionConsts.ACCEPT_PENALTIES:
            break;
        default: console.log("could not process unknown command: " + action);
            break;
    }


    res.json("nice :)");
});


module.exports = phrensUnoRouter;