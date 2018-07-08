const express = require("express");
const acceptPenaltiesRouter = express.Router();

acceptPenaltiesRouter.post("/", (req, res) =>{
    const playerID = req.body.playerID;

    console.log("server accepting penalties for player: " + playerID);
    // retrieve match with player
})

module.exports = acceptPenaltiesRouter;