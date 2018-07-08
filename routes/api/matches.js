const uuid = require("uuid");
const express = require("express");
const matchRouter = express.Router();
const Match = require("../../model/Match")
const Player = require("../../model/Player")
const Card = require("../../model/Card")
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const MathHelper = require("../../client/src/shared/MathHelper");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");
const InitDB = require("../../model/InitDB");
const MatchData = require("../../model/MatchData");




matchRouter.get("/", (req, res) => {
   // find all matches
   console.log("find all matches. called via manual hhtp request? should not be used ingame");
    Match.find()                 // promise based
        //.sort({id: -1})       // sort by date descendingly
        .then(players => res.json(players))
});

/**
 * CREATE A NEW MATCH.
 * it´s supermessy right now. clean it up!
 */
matchRouter.post("/", (req, res) => {
    let playerCount = req.body.playerCount;
    playerCount = 5;                                            // TODO: for now every match has 5 players
    let players = [];   // PlayerObjects. serialize? hmm
    let playerCardCount = 17;                                    // amount of hand cards for each player. default: 7
    let index;
    let card;

    let allCards = InitDB.getCardDeck();
    //console.log("allCards: " + allCards.length);             // should be 108
    
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
            index = MathHelper.getRandomInt(0, allCards.length-1);
            card = allCards.splice(index, 1)[0];    // retrieve card
            //console.log(card);
            player.cards.push( card );                          // move from deck to player hand
        }
        
        // DEBUG CARD INSERTING
        // add direction change cards to each player
        /*let changeDirectionCard = extractCardByType(allCards, EffectSpecial.CHANGE_DIRECTION);
        if(changeDirectionCard){
            player.cards.push(changeDirectionCard);
        }

        let skipCard = extractCardByType(allCards, EffectSpecial.SKIP);
        if(skipCard){
            player.cards.push(skipCard);
        }
        */

        // END OF DEBUG CARD INSERTING
    });

    let firstCard = pickFirstCard(allCards);                // removes firstCard from allCards array
    const match = new Match({                                   // create new match
        id: uuid(),
        players: players,
        playedCards: [firstCard],                           // add first card to stack
        cards: allCards,
        activePlayerID: players.length > 0 ? players[0].id : "no human players" // first player starts
    });

    match.save()                                                 //match.save...
        .then((pMatch) => {
            //console.log("saved match");
            MatchData.matches.push(pMatch);
            res.json(pMatch);                                   // return match to client
        });
})
   

// helper
function extractCardByType(cards, effectType){
    let card;

    for(let i=0; i<cards.length; i++){
        card = cards[i];
        
        if(PlayCardValidator.hasEffect(card, effectType)){
            cards.splice(i, 1);
            return card;
        }
    }
    return null;
}

function pickFirstCard(cards){
    let card;
    let firstCard = null;
    let randomIndex;
    
    while(!firstCard){
        randomIndex = MathHelper.getRandomInt(0, cards.length - 1);
        card = cards[randomIndex];

        if(PlayCardValidator.isColorValueCard(card)){
            firstCard = cards.splice(randomIndex, 1)[0];
        }
    }
    return firstCard;
}




module.exports = matchRouter;