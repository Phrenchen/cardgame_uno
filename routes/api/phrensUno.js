const express = require("express");
const phrensUnoRouter = express.Router();
const uuid = require("uuid");
const ActionConsts = require("../../client/src/shared/ActionConsts");
const InitDB = require("../../model/InitDB");
const MatchData = require("../../model/MatchData");
const MathHelper = require("../../client/src/shared/MathHelper");
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const matchData = require("../../model/MatchData");
const MatchHelper = require("../../client/src/shared/MatchHelper");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");
const Match = require("../../model/Match");
const Player = require("../../model/Player");

phrensUnoRouter.post("/", (req, res) =>{
    let action = req.body.action;

    switch(action){
        case ActionConsts.START_MATCH:
            startMatch(req, res);
            break;
        case ActionConsts.PLAY_CARD:
            playCard(req, res);
            break;
        case ActionConsts.ACCEPT_PENALTIES:
            acceptPenalties(req, res);
            break;
        default: console.log("could not process unknown command: " + action);
            res.json("could not process unknown command: " + action);
            break;
    }
});

// ACCEPT PENALTIES
const acceptPenalties = (req, res) => {
    const matchID = req.body.matchID;
    let match = matchData.getMatchByID(matchID);

    if(match){
        let player = MatchHelper.getActivePlayer(match);
        
        match.penalties.map((penalty) =>{
            penalty.cards.map((card) =>{
                player.cards.push(card);
            })
        })
        match.penalties = [];       // forget about penalties
        
        if(!MatchHelper.playerHasPlayableCards(match)){
            setNextPlayer(match, MatchHelper.getTopCard(match), true);
            applyPenaltyCheckNoValidCard(match);
        }
        saveMatchAndReturnToClient(match, res, false);
    }
    else{
        console.log("CREATING NEW MATCH! Could not accept penalties for unknown match. why is this?");
        startMatch(req, res);
    }
}

// PLAY CARD
const playCard = (req, res) =>{
    const matchID = req.body.matchID;
    const playerID = req.body.playerID;
    const cardID = req.body.cardID;
    let activePlayer;
    let topCard;
    let playCard;

    let match = matchData.getMatchByID(matchID);
    
    if(!match){
        let message = "no match could be found for your cardplay. here you have a new match";
        startMatch(req, res, message);
        return;
    }
    if(playerID != match.activePlayerID){
        match.message = "only the active player may play a card";
        res.json(match);
        return;
    }
    if(match.penalties.length > 0){
        match.message = "client needs to accept penalties";
        res.json(match);
        return;
    }
    //----------------------- EARLY OUT END ----------------------------------
    activePlayer = MatchHelper.getActivePlayer(match);
    topCard = MatchHelper.getTopCard(match);
    playCard = MatchHelper.extractCardFromPlayer(activePlayer, cardID);
    
    if(PlayCardValidator.validateCard(playCard, topCard)){
        match.playedCards.push(playCard);
        setNextPlayer(match, playCard, false);

        // PENALTY CARDS
        applyPenaltyTakeX(match, playCard, match.penalties);
        applyPenaltyCheckNoValidCard(match);
        
        // *** SAVE MATCH ***
        saveMatchAndReturnToClient(match, res, false);
    }
    else{
        // VALIDATION OUT OF SYNC
       console.log("PLAY CARD VALIDATION! out of sync with client and server");
       activePlayer.cards.push(playCard);     // re-add card to hand deck
       
       saveMatchAndReturnToClient(match, res, false);
    }
};
//---------------------------------------------

// privates
const applyPenaltyTakeX = (match, playCard, penaltySets) => {
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
}

const setNextPlayer = (match, playCard, ignoreSkip) =>{
    // set cursor direction
    match.movingPlayerCursorForward = PlayCardValidator.hasEffect(playCard, 
        EffectSpecial.CHANGE_DIRECTION) ? 
            !match.movingPlayerCursorForward : 
            match.movingPlayerCursorForward;

    // set next player
    
    let isSkipping = PlayCardValidator.hasEffect(playCard, 
                                 EffectSpecial.SKIP);

    if(!ignoreSkip){
        isSkipping = false;
    }
    match.activePlayerID = MatchHelper.getNextPlayerID(match.players, 
        match.activePlayerID, 
        match.movingPlayerCursorForward, 
        isSkipping);
}

const applyPenaltyCheckNoValidCard = (match) =>{
    if(!MatchHelper.playerHasPlayableCards(match)){
        match.penalties.push( getNoValidCardPenalty(match.cards) );
    }
}

const getNoValidCardPenalty = (cards) =>{
    let noChoicePenaltyCardSet = {
        id: uuid(),
        reason: "no playable card. take 1 extra",
        cards: []
    };

    let noChoicePenaltyCard = MatchHelper.getRandomCard(cards);
    if(noChoicePenaltyCard){
        noChoicePenaltyCardSet.cards.push(noChoicePenaltyCard);
    }
    
    return noChoicePenaltyCardSet;
}


const startMatch = (req, res, message = "") =>{
    //console.log("starting match");
    let playerCount = req.body.playerCount;
    playerCount = 5;                                            // TODO: for now every match has 5 players
    let allPlayers = InitDB.getPlayers();
    let selectedPlayers = [];
    let playerCardCount = 7;                                    // amount of hand cards for each player. default: 7
    let index;
    let card;

    let allCards = InitDB.getCardDeck();
    let randomPlayerIDs = MathHelper.getNRandomInts(0, allPlayers.length - 1, playerCount);
    
    for(let i=0; i<playerCount; i++){
        selectedPlayers.push( allPlayers[randomPlayerIDs[i]] );
    }

    // reassign ID to ensure uniquness
    selectedPlayers.map((player) =>{
        player.id = uuid();
        player.cards = [];
    });
        
    // distribute cards for each player
    selectedPlayers.map((player) =>{                                    // for ever player
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
        players: selectedPlayers,
        playedCards: [firstCard],                           // add first card to stack
        cards: allCards,
        activePlayerID: selectedPlayers.length > 0 ? selectedPlayers[0].id : "no human players" // first player starts
    });

    //TODO
    // validate activePlayer and add penalty card if no valid card in handdeck
    applyPenaltyCheckNoValidCard(match);    // no penalties is guaranteed after match creation
    
    match.message = message;
    saveMatchAndReturnToClient(match, res, true);
};

// helper
const saveMatchAndReturnToClient = (match, res, saveToTemporaryList) =>{
    match.save()
        .then((savedMatch) => {
            if(saveToTemporaryList){
                MatchData.matches.push(savedMatch);
            }
            res.json(savedMatch);                // send to client
        })
        .catch((res) =>{
            console.log("failed to save match. please refresh and start a new game. sorry about this :(");
        });
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

// DO NOT DELETE
// helper for debugging
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

module.exports = phrensUnoRouter;