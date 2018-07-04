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


/**
 * CREATE A NEW MATCH.
 * it´s supermessy right now. clean it up!
 */
matchRouter.post("/", (req, res) => {
    console.log("create new match");
    //console.log(req.body);
    //console.log(cardDeck);
    
    let playerIDs = req.body;
    let players = [];   // PlayerObjects. serialize? hmm
    let cards = [];

    Player.find()                   // get all players from DB
        .then((allPlayers) =>{
            // find playerObjects matching to client request
            allPlayers.map((player) =>{                     // find player participating in match (list of playerIDs from client)
                if(playerIDs.indexOf(player.id) != -1){     
                    players.push(player);                   // add a participating player
                }
            });
        })
        .then(() => {
            Card.find()             // get all Cards (1 Deck)
                .then((allCards) => {
                    // distribute cards to players
                    let playerCardCount = 7;                                    // amount of hand cards for each player
                    let index;
                    
                    players.map((player) =>{                                    // for ever player
                        for(let i=0; i<playerCardCount; i++){                   // select 7 random cards
                            index = getRandomInt(0, cardDeck.cardDeck.length-1);
                            let cardID = cardDeck.cardDeck.splice(index, 1);    // remove from deck
                            let card = getCardByID(allCards, cardID);           // retrieve card
                            player.cards.push( card );                          // move from deck to player hand
                        }
                    });
                    
                    let stackCards = [];
                    cardDeck.cardDeck.map((cardID) => {                         // add remaining cards to stack
                        stackCards.push(getCardByID(allCards, cardID));
                    });

                    const match = new Match({                                   // create new match
                        id: uuid(),
                        players: players,
                        cards: stackCards,
                        firstPlayerID: players[0].id,                           // first player starts
                        topCardID: stackCards[0].id                             // first card is top card
                    });
                   
                    match.save()                                                 //match.save...
                        .then((pMatch) => {
                            console.log("saved match: " + pMatch.id);
                            res.json(pMatch);                                   // return match to client
                        });
                })
        })
});

// helper
function getCardByID(allCards, cardID){
    let result = null;
    allCards.map((card) => {
        if(card.id == cardID){
            result = card;
        }
    });
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = matchRouter;