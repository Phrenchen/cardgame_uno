const express = require("express");
const playcardRouter = express.Router();
const Match = require("../../model/Match")
const Card = require("../../model/Card")
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");

playcardRouter.post("/", (req, res) =>{
    const playerID = req.body.playerID;
    const cardID = req.body.cardID;
    let topCard;
    let playCard;

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
                            topCard = match.playedCards[match.playedCards.length-1]
                            playCard = extractCardFromPlayer(activePlayer, cardID);
                            
                            if(PlayCardValidator.validateCard(playCard, topCard)){
                                match.playedCards.push(playCard);
                                //console.log("validation equal in client and server...adding card to playedCards: " + match.playedCards.length);
                            }
                            else{
                                /* we removed the card from the hand deck, 
                                optimistically assuming client and server validation return same results.
                                using shared validation function.
                                
                                here we are to react to a validation error
                                */
                               console.log("PLAY CARD VALIDATION!!!! out of sync with client and server");
                               activePlayer.cards.push(playCard);     // re-add card to hand deck
                            }
                            
                            activePlayer.save()
                                .then((savedPlayer) =>{
                                    //saved active player
                                    
                                    let oldPlayer;
                                    let clonedPlayers = match.players.slice();

                                    // replace new player in match. THIS LOOKS WEIRD? check mongo doc...need to have it. otherwise...we forget things?
                                    for(var x=0; x<match.players.length; x++){
                                        oldPlayer = clonedPlayers[x];
                                        

                                        if(oldPlayer.id === savedPlayer.id){
                                            clonedPlayers[x] = savedPlayer;
                                        }
                                    }
                                    
                                    match.players = clonedPlayers;
                                    // *****
                                    // TODO:
                                    // apply played card effect: 
                                    //  - add penalty cards to next player

                                    // *****
                                    match.movingPlayerCursorForward = PlayCardValidator.hasEffect(playCard, EffectSpecial.CHANGE_DIRECTION) ? !match.movingPlayerCursorForward : match.movingPlayerCursorForward;
                                    let isSkipping = PlayCardValidator.hasEffect(playCard, EffectSpecial.SKIP);
                                    match.players = clonedPlayers;
                                    // set next player
                                    match.activePlayerID = getNextPlayerID(match.players, match.activePlayerID, match.movingPlayerCursorForward, isSkipping);

                                    match.save()
                                    .then((savedMatch) => {
                                        res.json(savedMatch);                // match saved
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
function getNextPlayerID(players, currentPlayerID, playerPointerIsMovingForward, isSkipping){
    // forwards:  0, 1, 2, 3, 4, 0, 1
    // backwards: 0, 4, 3, 2, 1, 0, 4
    let nextPlayerIndex;
    let moveCursorSteps = isSkipping ? 2 : 1;       // default is 1 (neighbor)
    
    players.map((player, index) =>{
        if(player.id === currentPlayerID){
            if(playerPointerIsMovingForward){
                // forwards
                nextPlayerIndex = (index + moveCursorSteps) % players.length;
            }
            else{
                // backwards
                if(index - moveCursorSteps >= 0){
                    nextPlayerIndex = index - moveCursorSteps;
                }
                else{
                    // wrap around
                    let wrapBy = index - moveCursorSteps;
                    nextPlayerIndex = players.length + wrapBy;
                }
            }
        }
    });

    //console.log("next player index: " + nextPlayerIndex);
    return players[nextPlayerIndex].id;
}

function extractCardFromPlayer(player, cardID){
    let card;

    for(let j=0; j<player.cards.length; j++){
        card = player.cards[j];
        if(card.id === cardID){
            player.cards.splice(j, 1);

            return card;
        }
    }
    return null;
}

module.exports = playcardRouter;