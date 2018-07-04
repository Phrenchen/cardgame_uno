const uuid = require("uuid");
const express = require("express");
const matchRouter = express.Router();
const Match = require("../../model/Match")
const Player = require("../../model/Player")
const Card = require("../../model/Card")
const {cardDeck} = require("../../model/InitDB");

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
    //console.log("create new match");
    //console.log(req.body);
    //console.log(cardDeck);
    
    let playerCount = req.body.playerCount;
    playerCount = 5;                                            // TODO: for now every match has 5 players
    let players = [];   // PlayerObjects. serialize? hmm
    let cards = [];
    let playerCardCount = 7;                                    // amount of hand cards for each player
    let index;

    console.log("match router. post: ");
    console.log(req);
    console.log(playerCount);

    Card.find()             // get all Cards (1 Deck)
        .then((allCards) => {
            cards = allCards;
            // distribute cards to players
            for(let i = 0; i<playerCount; i++){
                const newPlayer = new Player({
                    name: "Player " + (i+1),
                    id: uuid(),
                    cards: new Array()
                });
                players.push(newPlayer);
            }

            Player.insertMany(players, (err, result) => {
                //console.log("saved players");
            })
        })
        .then(() =>{                        // distribute cards
            players.map((player) =>{                                    // for ever player
                for(let i=0; i<playerCardCount; i++){                   // select 7 random cards
                    index = getRandomInt(0, cardDeck.length-1);
                    let cardID = cardDeck.splice(index, 1);    // remove from deck
                    let card = getCardByID(cards, cardID);           // retrieve card
                    player.cards.push( card );                          // move from deck to player hand
                }
                
                player.save((err, result) => {
                    //console.log("saved player");
                });
            });
            
            let stackCards = [];
            cardDeck.map((cardID) => {                         // add remaining cards to stack
                stackCards.push(getCardByID(cards, cardID));
            });
            
            const match = new Match({                                   // create new match
                id: uuid(),
                playerCount: -1,
                players: players,
                cards: stackCards,
                firstPlayerID: players.length > 0 ? players[0].id : "no human players",                           // first player starts
                topCardID: stackCards[0].id                             // first card is top card
            });
            
            match.save()                                                 //match.save...
                .then((pMatch) => {
                    //console.log("saved match: " + pMatch.id);
                    res.json(pMatch);                                   // return match to client
                });
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