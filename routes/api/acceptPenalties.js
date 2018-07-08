const express = require("express");
const acceptPenaltiesRouter = express.Router();
const matchData = require("../../model/MatchData");
const MatchHelper = require("../../client/src/shared/MatchHelper");

acceptPenaltiesRouter.post("/", (req, res) =>{
    const matchID = req.body.matchID;

    //console.log("server accepting penalties for matchID: " + matchID);
    let match = matchData.getMatchByID(matchID);
    let player = MatchHelper.getPlayerByID(match.players, match.activePlayerID);

    match.penalties.map((penalty) =>{
        penalty.cards.map((card) =>{
            player.cards.push(card);
        })
    })
    match.penalties = [];       // forget about penalties

    match.save()
        .then((savedMatch) =>{
            res.json(savedMatch);
        });
});

module.exports = acceptPenaltiesRouter;