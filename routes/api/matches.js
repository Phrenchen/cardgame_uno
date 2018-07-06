const uuid = require("uuid");
const express = require("express");
const matchRouter = express.Router();
const Match = require("../../model/Match")
const Player = require("../../model/Player")
const Card = require("../../model/Card")
const PlayCardValidator = require("../../client/src/PlayCardValidator");

matchRouter.get("/", (req, res) => {
   // find all matches
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
    //console.log(cardDeck);
    
    let playerCount = req.body.playerCount;
    playerCount = 5;                                            // TODO: for now every match has 5 players
    let players = [];   // PlayerObjects. serialize? hmm
    let cards = [];
    let playerCardCount = 7;                                    // amount of hand cards for each player. default: 7
    let index;
    let card;

    Card.find()             // get all Cards (1 Deck)
        .then((allCards) => {
            cards = allCards;
            // create new players
            for(let i = 0; i<playerCount; i++){
                const newPlayer = new Player({
                    name: "Player " + (i+1),
                    id: uuid(),
                    cards: new Array()
                });
                players.push(newPlayer);
            }
            
            // distribute cards for each player
            players.map((player) =>{                                    // for ever player
                for(let i=0; i<playerCardCount; i++){                   // select 7 random cards
                    index = getRandomInt(0, allCards.length-1);
                    card = allCards.splice(index, 1)[0];    // retrieve card
                    //console.log(card);
                    player.cards.push( card );                          // move from deck to player hand
                }
            });
            
            
            
            Player.insertMany(players, (err, result) => {
                //console.log("inserted all players.");
                let firstCard = pickFirstCard(allCards);                // removes firstCard from allCards array
                const match = new Match({                                   // create new match
                    id: uuid(),
                    players: result,
                    playedCards: [firstCard],                           // add first card to stack
                    cards: allCards,
                    activePlayerID: players.length > 0 ? players[0].id : "no human players" // first player starts
                });
    
                match.save()                                                 //match.save...
                    .then((pMatch) => {
                        console.log("saved match");
                        res.json(pMatch);                                   // return match to client
                    });
            })
        })
    });
   

// helper
function pickFirstCard(cards){
    let card;
    let firstCard = null;
    let randomIndex;
    
    while(!firstCard){
        randomIndex = getRandomInt(0, cards.length - 1);
        card = cards[randomIndex];

        if(PlayCardValidator.isColorValueCard(card)){
            firstCard = cards.splice(randomIndex, 1)[0];
        }
    }
    return firstCard;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = matchRouter;