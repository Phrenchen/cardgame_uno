const express = require("express");
const phrensUnoRouter = express.Router();
const uuid = require("uuid");
const ActionConsts = require("../../client/src/shared/ActionConsts");
const InitDB = require("../../model/InitDB");
const MatchData = require("../../model/MatchData");
const MathHelper = require("../../client/src/shared/MathHelper");
const PlayCardValidator = require("../../client/src/shared/PlayCardValidator");
const MatchHelper = require("../../client/src/shared/MatchHelper");
const EffectSpecial = require("../../client/src/shared/EffectSpecial");
const Player = require("../../model/Player");
const Match = require("../../model/Match");

// read players
phrensUnoRouter.get("/", (req, res) => {
   // find all match
    Match.find()                 // promise based
        //.sort({id: -1})       // sort by date descendingly
        .then(players => res.json(players))
});

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

const startMatch = (req, res, message = "") =>{
    //console.log("starting match");
    let playerCount = req.body.playerCount;
    playerCount = 5;                                            // TODO: for now every match has 5 players
    let allPlayers = InitDB.getPlayers();
    let selectedPlayers = [];
    let playerCardCount = 7;                                    // amount of hand cards for each player. default: 7

    let allCards = InitDB.getCardDeck();
    let randomPlayerIDs = MathHelper.getNRandomInts(0, allPlayers.length - 1, playerCount);
    let player;

    for(let i=0; i<playerCount; i++){
        player = allPlayers[randomPlayerIDs[i]];
        player.matchScore = 0;
        selectedPlayers.push( player );
    }

    // reassign ID to ensure uniquness
    selectedPlayers.map((player) =>{
        player.id = uuid();
        player.cards = [];
    });
        
   let firstCard = pickFirstCard(allCards);                // removes firstCard from allCards array
   distributeHandCardsToPlayers(selectedPlayers, allCards, "random", playerCardCount, firstCard);
   //distributeHandCardsToPlayers(selectedPlayers, allCards, "FIRST_PLAYER_WINS", playerCardCount, firstCard);

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
    
    match.serverMessage = message;
    saveMatchAndReturnToClient(match, res, true);
};

const distributeHandCardsToPlayers = (players, cards, distributionMode, playerCardCount, topCard) => {
    let p;
    switch(distributionMode){
        case "FIRST_PLAYER_WINS":
            //console.log("first player wins");

            for(let i=0; i<players.length; i++){
                p = players[i];

                if(i==0){
                    // first player gets valid card
                    let validCard = MatchHelper.getValidCardTo(cards, topCard);
                    p.cards.push( validCard );
                    //distributeRandomCardsToPlayer(p, cards, playerCardCount-1);
                }
                else{
                    distributeRandomCardsToPlayer(p,cards, playerCardCount);
                }
            }
            break;
        default:
            //console.log("default random card distribution");
            players.map( (player) =>{                                    // for ever player
                distributeRandomCardsToPlayer(player, cards, playerCardCount);
                            // DEBUG CARD INSERTING
                            // add direction change cards to each player
                            
                            /*
                            let extraCard1 = extractCardByType(cards, EffectSpecial.TAKE_4);
                            if(extraCard1){
                                player.cards.push(extraCard1);
                            }
                            
                            let extraCard2 = extractCardByType(cards, EffectSpecial.CHANGE_COLOR);
                            if(extraCard2){
                                player.cards.push(extraCard2);
                            }
                            */
                            // END OF DEBUG CARD INSERTING
            });
            break;
        }
    }
    
    const distributeRandomCardsToPlayer = (player, cards, playerCardCount) =>{
        for(let i=0; i<playerCardCount; i++){                   // select 7 random cards
            index = MathHelper.getRandomInt(0, cards.length-1);
            card = cards.splice(index, 1)[0];    // retrieve card
            //console.log(card);
            player.cards.push( card );                          // move from deck to player hand
        }
    };

// ACCEPT PENALTIES
const acceptPenalties = (req, res) => {
    const matchID = req.body.matchID;
    let match = MatchData.getMatchByID(matchID);

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
        saveMatchAndReturnToClient(match, res);
    }
    else{
        console.log("failed finding match for id " + req.body.matchID);
        console.log("CREATING NEW MATCH! Could not accept penalties for unknown match. why is this?");
        startMatch(req, res);
    }
}

// PLAY CARD
const playCard = (req, res) =>{
    const matchID = req.body.matchID;
    const playerID = req.body.playerID;
    const cardID = req.body.cardID;
    const selectedColor = req.body.selectedColor;
    let activePlayer;
    let topCard;
    let playCard;
    
    let match = MatchData.getMatchByID(matchID);
    
    if(!match){
        let message = "no match could be found for your cardplay. here you have a new match";
        startMatch(req, res, message);
        return;
    }
    if(playerID != match.activePlayerID){
        match.serverMessage = "only the active player may play a card";
        res.json(match);
        return;
    }
    if(match.penalties.length > 0){
        match.serverMessage = "client needs to accept penalties";
        res.json(match);
        return;
    }
    //----------------------- EARLY OUT END ----------------------------------
    if(selectedColor){
        match.selectedColor = selectedColor;
    }
    activePlayer = MatchHelper.getActivePlayer(match);

    topCard = MatchHelper.getTopCard(match);
    playCard = MatchHelper.extractCard(activePlayer.cards, cardID);

    if(PlayCardValidator.validateCard(playCard, topCard, match.selectedColor)){
        match.playedCards.push(playCard);

        //TODO: check gameover. count player´s cards
        let winner = MatchHelper.getWinner(match);
        if(winner != null){
            //game over. we need additional match infos
            
            /* 
            should be the same anyways, 
            because the last active player played his / her last card.
            if winning conditions change, so to speak hmm
            */
            match.activePlayerID = winner.id;        
            match.serverMessage = winner.name + " has won!";
            
            MatchHelper.calculateScores(match);

            // debug log
            //match.players.map((player) =>{ console.log(player.matchScore); })
            
            saveMatchAndReturnToClient(match, res);     // send game over
            return;
        }

        setNextPlayer(match, playCard, false);

        // REMOVING CARDS FROM STACK
        // PENALTY CARDS
        applyPenaltyTakeX(match, playCard, match.penalties);
        applyPenaltyCheckNoValidCard(match);
        
        saveMatchAndReturnToClient(match, res);  // *** SAVE MATCH ***
    }
    else{
        // VALIDATION OUT OF SYNC
        console.log("PLAY CARD VALIDATION! out of sync with client and server");
        activePlayer.cards.push(playCard);     // re-add card to hand deck
       
        console.log(req.body.cardID);
        console.log(req.body.selectedColor);

        saveMatchAndReturnToClient(match, res);   // *** SAVE MATCH ***
    }
};
//------------------------------------------------------------------------

// private
const setNextPlayer = (match, playCard, ignoreSkip) =>{
    // set cursor direction
    match.movingPlayerCursorForward = PlayCardValidator.hasEffect(playCard, 
        EffectSpecial.CHANGE_DIRECTION) ? 
            !match.movingPlayerCursorForward : 
            match.movingPlayerCursorForward;

    // set next player
    
    let isSkipping = PlayCardValidator.hasEffect(playCard, 
                                 EffectSpecial.SKIP);

    if(ignoreSkip){
        isSkipping = false;
    }
    match.activePlayerID = MatchHelper.getNextPlayerID(match.players, 
        match.activePlayerID, 
        match.movingPlayerCursorForward, 
        isSkipping);
}

// create penalties
const applyPenaltyCheckNoValidCard = (match) =>{
    if(!MatchHelper.playerHasPlayableCards(match)){
        match.penalties.push( applyNoValidCardPenalty(match) );
    }
}

const applyNoValidCardPenalty = (match) =>{
    let noChoicePenaltyCardSet = {
        id: uuid(),
        reason: "no playable card. take 1 extra",
        cards: []
    };
    
    if( !MatchHelper.canSupplyStackCards(match, 1) ){
        console.log("1 match.cards is empty. recycling");
        MatchHelper.recyclePlayedCards(match);
    }
    noChoicePenaltyCardSet.cards.push( MatchHelper.extractRandomCard(match.cards) );
    
    return noChoicePenaltyCardSet;
}

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
        
        if( !MatchHelper.canSupplyStackCards(match, penaltyCardCount) ){
            console.log("2 match.cards is empty. recycling");
            MatchHelper.recyclePlayedCards(match);
        }
        for(let pc = 0; pc<penaltyCardCount; pc++){
            takeXPenaltyCardSet.cards.push( MatchHelper.extractRandomCard(match.cards) );
        }
        penaltySets.push(takeXPenaltyCardSet);
    }
}
// end create penalties

// helper
const saveMatchAndReturnToClient = (match, res, saveToTemporaryList = false) =>{
    if(saveToTemporaryList){
        MatchData.matches.push(match);
    }
    res.json(match);                // send to client
    
    /*
    // expensive operation.
    // let user manually save a match?
    match.save()
        .then((savedMatch) => {
        })
        .catch((res) =>{
            // ParallelSaveError: Can't save() the same doc multiple times in parallel
        });
    */
}

function pickFirstCard(cards){
    let card;
    let firstCard = null;
    let randomIndex;
    
    while(!firstCard){
        randomIndex = MathHelper.getRandomInt(0, cards.length - 1);
        card = cards[randomIndex];

        if(!PlayCardValidator.hasSpecialEffect(card)){
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