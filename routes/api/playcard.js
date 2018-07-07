const express = require("express");
const playcardRouter = express.Router();
const Match = require("../../model/Match")
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const MathHelper = require("../../client/src/shared/MathHelper");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");
const uuid = require("uuid");

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
                                    
                                    /* 
                                        need to add penalty cards?
                                            1. take 2 or take 4 effect on playCard?
                                            3. no playable card: 1 penalty card
                                            */
                                           let penaltyCardCount = 0;
                                           
                                           playCard.effects.map((effect) =>{
                                               // get amount of penalty cards from effect
                                               if(effect.effectType === EffectSpecial.TAKE_2){
                                                   penaltyCardCount = 2;
                                                }
                                                else if(effect.effectType === EffectSpecial.TAKE_4){
                                                    penaltyCardCount = 4;
                                                }
                                            });
                                            
                                            // PENALTY SET
                                            let penaltySets = [];

                                            if(penaltyCardCount > 0){
                                                let takeXPenaltyCardSet = {
                                                    id: uuid(),
                                                    reason: "take " + penaltyCardCount + " :)",
                                                    cards: []
                                                };
                                                
                                                for(let pc = 0; pc<penaltyCardCount; pc++){
                                                    /* no extraction here. 
                                                        player needs to accept penalty
                                                        cards are then transfered from match.cards to player.cards
                                                    
                                                    */
                                                    let randomCard = getRandomCard(match.cards);
                                                    if(randomCard){
                                                        takeXPenaltyCardSet.cards.push(randomCard);
                                                    }
                                                }

                                                penaltySets.push(takeXPenaltyCardSet);
                                            }
                                            // 2. validate player cards
                                            let nextPlayer = getPlayerByID(match.players, match.activePlayerID);
                                            let nextPlayerHasPlayableCards = false;
                                            
                                            nextPlayer.cards.map((card) =>{
                                                if(PlayCardValidator.validateCard(card, topCard)){
                                                    nextPlayerHasPlayableCards = true;
                                                }
                                            });
                                            
                                            if(!nextPlayerHasPlayableCards){
                                                // add 1 penalty card
                                                // no further check required.
                                                // current player can play a card if available
                                                // otherwise: nextPlayer
                                                //      -> trigger switch with seperate command
                                                let noChoicePenaltyCardSet = {
                                                    id: uuid(),
                                                    reason: "no playable card. take 1 extra",
                                                    cards: []
                                                };

                                                let noChoicePenaltyCard = getRandomCard(match.cards);
                                                if(noChoicePenaltyCard){
                                                    noChoicePenaltyCardSet.cards.push(noChoicePenaltyCard);
                                                }
                                                penaltySets.push(noChoicePenaltyCardSet);
                                            }
                                            console.log("penalty sets: " + penaltySets.length);
                                            //console.log(penaltySets[0]);
                                            match.penaltyCards = penaltySets;                                            
                                            
                                            // *** SAVE MATCH ***
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
function getPlayerByID(players, playerID){
    for(let i=0; i<players.length; i++){
        if(players[i].id === playerID){
            return players[i];
        }
    }
    return null;
}

function getRandomCard(cards){
    let randomIndex = MathHelper.getRandomInt(0, cards.length-1);
    return cards[randomIndex];
}

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