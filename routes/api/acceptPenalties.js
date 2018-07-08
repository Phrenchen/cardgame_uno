const express = require("express");
const acceptPenaltiesRouter = express.Router();
const Match = require("../../model/Match");
const Player = require("../../model/Player");


acceptPenaltiesRouter.post("/", (req, res) =>{
    const matchID = req.body.matchID;

    //console.log("server accepting penalties for matchID: " + matchID);
    // retrieve match with player

    Match.findOne({id:matchID})
        .then((match) =>{
            //console.log("found match: " + match.penalties.length);
            Player.findOne({id:match.activePlayerID})
                .then((player) =>{
                    //console.log("found player");
                    // add all penalty cards to player.cards
                    match.penalties.map((penalty) =>{
                        penalty.cards.map((card) =>{
                            //console.log("add penalty card to player: " + player.cards.length);
                            player.cards.push(card);
                        })
                    })
                    match.penalties = [];       // forget about penalties

                    player.save()
                        .then((savedPlayer) =>{
                            let clonedPlayers = match.players.slice();

                                    // replace new player in match. THIS LOOKS WEIRD? check mongo doc...need to have it. otherwise...we forget things?
                                    for(var x=0; x<match.players.length; x++){
                                        oldPlayer = clonedPlayers[x];
                                        

                                        if(oldPlayer.id === savedPlayer.id){
                                            clonedPlayers[x] = savedPlayer;
                                        }
                                    }
                                    
                                    match.players = clonedPlayers;

                                    match.save()
                                        .then((savedMatch) =>{
                                            res.json(savedMatch);
                                        });
                        });
                });
        });
})

module.exports = acceptPenaltiesRouter;