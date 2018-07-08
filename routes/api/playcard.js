const express = require("express");
const playcardRouter = express.Router();
const Match = require("../../model/Match")
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const MathHelper = require("../../client/src/shared/MathHelper");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");
const uuid = require("uuid");
const matchData = require("../../model/MatchData");
const MatchHelper = require("../../client/src/shared/MatchHelper");

playcardRouter.post("/", (req, res) =>{
    const matchID = req.body.matchID;
    const playerID = req.body.playerID;
    const cardID = req.body.cardID;
    let topCard;
    let playCard;

    let match = matchData.getMatchByID(matchID);
    
    if(!match){
        console.log("found no match for id: " + matchID);
        return;
    }

    // only activePlayer may play a card
    if(playerID != match.activePlayerID){
        console.log("only the active player may play a card");
        return;
    }
    
    if(match.penalties.length > 0){
        console.log("client needs to accept penalties");
        //TODO: add hint what went wrong?
        res.json(match);
    }
    
    let activePlayer = MatchHelper.getPlayerByID(match.players, match.activePlayerID);

    topCard = match.playedCards[match.playedCards.length-1]
    playCard = MatchHelper.extractCardFromPlayer(activePlayer, cardID);
    
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
    //----------------
    // set cursor direction
    match.movingPlayerCursorForward = PlayCardValidator.hasEffect(playCard, EffectSpecial.CHANGE_DIRECTION) ? 
                                        !match.movingPlayerCursorForward : 
                                        match.movingPlayerCursorForward;
            
    
    // set next player
    let isSkipping = PlayCardValidator.hasEffect(playCard, EffectSpecial.SKIP);
    match.activePlayerID = MatchHelper.getNextPlayerID(match.players, match.activePlayerID, match.movingPlayerCursorForward, isSkipping);
    
    //----------------
    // PENALTY CARDS
    // define penalty card count by card effect
    let penaltyCardCount = 0;
    let penaltySets = [];
    
    playCard.effects.map((effect) =>{
        // get amount of penalty cards from effect
        if(effect.effectType === EffectSpecial.TAKE_2){
            penaltyCardCount = 2;
        }
        else if(effect.effectType === EffectSpecial.TAKE_4){
            penaltyCardCount = 4;
        }
    });

    // add penalty caused by card effects
    if(penaltyCardCount > 0){
        let takeXPenaltyCardSet = {
            id: uuid(),
            reason: "take " + penaltyCardCount + " :)",
            cards: []
        };
        
        for(let pc = 0; pc<penaltyCardCount; pc++){
            let randomCard = MatchHelper.getRandomCard(match.cards);
            if(randomCard){
                takeXPenaltyCardSet.cards.push(randomCard);
            }
        }

        penaltySets.push(takeXPenaltyCardSet);
    }
    
    // 2. validate player cards
    let nextPlayer = MatchHelper.getPlayerByID(match.players, match.activePlayerID);
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

        let noChoicePenaltyCard = MatchHelper.getRandomCard(match.cards);
        if(noChoicePenaltyCard){
            noChoicePenaltyCardSet.cards.push(noChoicePenaltyCard);
        }
        penaltySets.push(noChoicePenaltyCardSet);
    }
    console.log("penalty sets: " + penaltySets.length);
    //console.log(penaltySets[0]);
    match.penalties = penaltySets;                                            
    
    // *** SAVE MATCH ***
    match.save()
        .then((savedMatch) => {
            res.json(savedMatch);                // match saved
        });
    });

module.exports = playcardRouter;