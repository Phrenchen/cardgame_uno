const uuid = require("uuid");
const express = require("express");
const matchRouter = express.Router();
const Match = require("../../model/Match")
const Player = require("../../model/Player")
const Card = require("../../model/Card")
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

matchRouter.post("/", (req, res) => {
    console.log("create new match");
    //console.log(req.body);
    //console.log(cardDeck);
    
    let playerIDs = req.body;
    let players = [];   // PlayerObjects. serialize? hmm
    let cards = [];

    Player.find()
        .then((allPlayers) =>{
            // find playerObjects matching to client request
            allPlayers.map((player) =>{
                if(playerIDs.indexOf(player.id) != -1){     // found one of the players
                    players.push(player);
                }
            });
        })
        .then(() => {
            Card.find()
                .then((allCards) => {
                    // distribute cards to players
                    // for each player
                    let playerCardCount = 7;
                    let index;
                    
        
                    players.map((player) =>{
                        for(let i=0; i<playerCardCount; i++){
                            index = getRandomInt(0, cardDeck.cardDeck.length-1);
                            let cardID = cardDeck.cardDeck.splice(index, 1);
                            let card = getCardByID(allCards, cardID);
                            player.cards.push( card );  // move from deck to player hand
                        }
                    });
                    
                    let stackCards = [];
                    console.log(cardDeck.cardDeck.length);
                    cardDeck.cardDeck.map((cardID) => {
                        stackCards.push(getCardByID(allCards, cardID));
                    });
                    console.log(stackCards);
                    const match = new Match({
                        id: uuid(),
                        players: players,
                        cards: stackCards
                    });
                    //match.save...
                    match.save()
                        .then((pMatch) => {
                            res.json(pMatch);
                        });
                })
        })
});

function getCardByID(allCards, cardID){
    let result = null;
    allCards.map((card) => {
        if(card.id == cardID){
            result = card;
        }
    });
    return result;
}

module.exports = matchRouter;