const express = require("express");
const playcardRouter = express.Router();
const Match = require("../../model/Match")
const Card = require("../../model/Card")
const PlayCardValidator = require("../../client/src/PlayCardValidator");

playcardRouter.post("/", (req, res) =>{
    //console.log("play card");
    //console.log(req.body);

    const playerID = req.body.playerID;
    const cardID = req.body.cardID;
    //console.log("playerID: " + playerID);

    // find match for player
    //Match.findOne({ "id": req.body.playerID }, (err, res) => {
    Match.find()
        .then((matches) =>{
            matches.map((match) => {
                // check players
                match.players.map((player) =>{
                    if(player.id === playerID){
                        //console.log("found match with player");
                        
                        Player.findOne({
                            "id": playerID
                        }, (err, activePlayer) =>{
                            const topCard = match.playedCards[match.playedCards.length-1]
                            const playCard = extractCardFromPlayer(activePlayer, cardID);
                            
                            if(PlayCardValidator.validateCard(playCard, topCard)){
                                match.playedCards.push(playCard);
                                console.log("validation equal in client and server...adding card to playedCards: " + match.playedCards.length);
                            }
                            else{
                                /* we removed the card from the hand deck, 
                                optimistically assuming client and server validation return same results.
                                using shared validation function.
                                
                                here we are to react to a validation error
                                */
                               console.log("PLAY CARD VALIDATION!!!! out of sync with client and server");
                               player.cards.push(playCard);     // re-add card to hand deck
                            }
                            
                            activePlayer.save()
                                .then((savedPlayer) =>{
                                    //saved active player
                                    
                                    let oldPlayer;
                                    // replace new player in match. THIS LOOKS WEIRD? check mongo doc...
                                    for(var x=0; x<match.players.length; x++){
                                        oldPlayer = match.players[x];

                                        if(oldPlayer.id === savedPlayer.id){
                                            match.players[x] = savedPlayer;
                                        }
                                    }
                                    
                                    // *****
                                    // TODO:
                                    // apply played card effect: 
                                    //  - change direction? 
                                    //  - add penalty cards to next player

                                    // *****
                                    let playerPointerIsMovingForward = true;      // 0, 1, ..., 4, 0, 1
                                    
                                    // set next player
                                    match.activePlayerID = getNextPlayerID(match.players, match.activePlayerID, playerPointerIsMovingForward);

                                    match.save()
                                    .then((savedMatch) => {
                                        res.json(savedMatch)                // match saved
                                    });
                                });
                        })
                    }
                })
            })
        })
        .catch(e =>{
            console.log("error updating match when playing a card: " + e);
        })
        ;
});

// helper
function getNextPlayerID(players, currentPlayerID, playerPointerIsMovingForward){
    // forwards:  0, 1, 2, 3, 4, 0, 1
    // backwards: 0, 4, 3, 2, 1, 0, 4
    let nextPlayerIndex;

    players.map((player, index) =>{
        if(player.id === currentPlayerID){
            console.log("found current player");

            nextPlayerIndex = playerPointerIsMovingForward ? 
                (index + 1) % players.length :                              // forward
                ((index - 1) >= 0) ? (index - 1) : players.length - 1;      // backwards
        }
    });

    console.log("next player index: " + nextPlayerIndex);
    return players[nextPlayerIndex].id;
}

function extractCardFromPlayer(player, cardID){
    let card;

    for(let j=0; j<player.cards.length; j++){
        card = player.cards[j];
        console.log(card.id);
        if(card.id === cardID){
            player.cards.splice(j, 1);
            console.log("************* extracting card ************* " + player.cards.length);

            return card;
        }
    }
    return null;
}

module.exports = playcardRouter;