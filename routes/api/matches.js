const uuid = require("uuid");
const express = require("express");
const matchRouter = express.Router();
const Match = require("../../model/Match")
const cardDeck = require("../../model/InitDB");

matchRouter.get("/", (req, res) => {
    /*console.log("------aadding player ---------");
    console.log("req: " + req);
    console.log("------------------------------");
    console.log(res);
    console.log("------------------------------");
    */
   
   // find all match
    Match.find()                 // promise based
        //.sort({id: -1})       // sort by date descendingly
        .then(players => res.json(players))
});

matchRouter.post("/", (req, res) => {
    console.log("create new match");
    console.log(req.body);
    console.log(cardDeck);
    const match = new Match({
        id: uuid(),
        players: req.body,
        cards: cardDeck
    });
    //match.save...
    match.save()
        .then((pMatch) => {
            res.json(pMatch);
        });

    /*let joinMatch = null;

    Match.find()
        .then((matches) => {
            console.log("found match for player id: " + req.body.playerID);
            console.log("has cards: " + cardDeck.length);
            matches.map((match) => {
                if(joinMatch == null && match.players.length < MAX_PLAYER_COUNT){
                    joinMatch = match;
                    joinMatch.players.push(req.body.playerID);
                    res.json(match);
                }
            })

            if(!joinMatch){
                // create new match
                match = new Match({
                    id: uuid(),
                    players: [],
                    cards: cardDeck
                });
                match.players.push(req.body.playerID);
                //match.save...
                match.save()
                    .then((pMatch) => {
                        res.json(pMatch);
                    });
            }
        });
    */
});

module.exports = matchRouter;