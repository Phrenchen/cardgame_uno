const MathHelper = require("./MathHelper");
const PlayCardValidator = require("./PlayCardValidator");
const EffectSpecial = require("./EffectSpecial");
const EffectColor = require("./EffectColor");

const calculateScores = (match) =>{
    match.players.map((player) =>{
        let score = 0;

        player.cards.map((card) =>{
            score += card.score;
        });

        player.matchScore = score;
    });
}; module.exports.calculateScores = calculateScores;

const sortCards = (cards =>{
    cards.sort((a,b) =>{
        if(a.sortOrder < b.sortOrder){
            return 1;
        }
        else if(a.sortOrder > b.sortOrder){
            return -1;
        }
        return 0;
    });
}); module.exports.sortCards = sortCards;

const getHumanPlayers = (match) =>{
    return match.players.filter((player) => player.isHumanPlayer);
}; module.exports.getHumanPlayers = getHumanPlayers;

const hasHumanPlayers = (match) =>{
    return getHumanPlayers(match).length > 0;
}; module.exports.hasHumanPlayers = hasHumanPlayers;

const activePlayerIsHuman = (match) =>{
    return getActivePlayer(match).isHumanPlayer;
}; module.exports.activePlayerIsHuman = activePlayerIsHuman;


const getRandomValidCardFromActivePlayer = (match) =>{
    // active player
    let player = getActivePlayer(match);
    let topCard = getTopCard(match);
    // cards
    let validCards = player.cards.filter((card) =>{
        return PlayCardValidator.validateCard(card, topCard, match.selectedColor);
    });

    let randomID = MathHelper.getRandomInt(0, validCards.length-1);
    return validCards[randomID];
}; module.exports.getRandomValidCardFromActivePlayer = getRandomValidCardFromActivePlayer;


const getCardByID = (cards, id) =>{
    let card;
    for(let i=0; cards.length; i++){
        card = cards[i];
        if(card.id === id){
            return card;
        }
    }
    console.log("no card found in: " + cards.length);
    return null;
}; module.exports.getCardByID = getCardByID;


const getWinner = (match) => {
    let result = null;

    match.players.map((player) =>{
        if(player.cards.length === 0){
            result = player;
        }
    });
    return result;
}; module.exports.getWinner = getWinner;

//------------------------------------------------------
const getValidCardTo = (cards, topCard) =>{
    let card;

    for(let i=0; i<cards.length; i++){
        card = cards[i];

        if(PlayCardValidator.validateCard(card, topCard)){
            return cards.splice(i, 1)[0];
        }
    }
}; module.exports.getValidCardTo = getValidCardTo;


const playerHasPlayableCards = (match) => {
    let allCandidates = getActivePlayer(match).cards;
    let topCard = getTopCard(match);
    let card;

    match.penalties.map((pSet) =>{
        allCandidates = allCandidates.concat(pSet.cards);
    });

    for(let i=0; i<allCandidates.length; i++){
        card = allCandidates[i];

        if(PlayCardValidator.validateCard(card, topCard, match.selectedColor)){
            return true;
        }
    }
    return false;
}; module.exports.playerHasPlayableCards = playerHasPlayableCards;

const getColor = (card) =>{
    let effect;
    
    for(let i=0; i<card.effects.length; i++){
        effect = card.effects[i];

        switch(effect.effectType){
            case EffectColor.RED:
            case EffectColor.GREEN:
            case EffectColor.BLUE:
            case EffectColor.YELLOW:
                let effectType = effect.effectType;
                return effectType.split("_")[1];    // color_[name]
        }
    }
    return "black;"
}; module.exports.getColor = getColor;

const getTopCard = (match) =>{
    return match.playedCards[match.playedCards.length-1];
}; module.exports.getTopCard = getTopCard;

const getActivePlayer = (match) => {
    return getPlayerByID(match.players, match.activePlayerID);
}; module.exports.getActivePlayer = getActivePlayer;

const getPlayerByID = (players, playerID) =>{
    for(let i=0; i<players.length; i++){
        if(players[i].id === playerID){
            return players[i];
        }
    }
    return null;
}; module.exports.getPlayerByID = getPlayerByID;

const extractRandomCard = (cards) =>{
    let randomIndex = MathHelper.getRandomInt(0, cards.length-1);
    return cards.splice(randomIndex, 1)[0];
}; module.exports.extractRandomCard = extractRandomCard;

const getNextPlayerID = (players, currentPlayerID, playerPointerIsMovingForward, isSkipping) => {
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
}; module.exports.getNextPlayerID = getNextPlayerID;

const extractCard = (cards, cardID = "-1") =>{
    let card;
    if(cardID === "-1"){
        card = extractRandomCard(cards);
    }
    else{
        for(let j=0; j<cards.length; j++){
            card = cards[j];
            
            if(card.id === cardID){
                cards.splice(j, 1);
                return card;
            }
        }
    }
    return null;
}; module.exports.extractCard = extractCard;

const canSupplyStackCards = (match, requiredCardCount) =>{
    return match.cards.length >= requiredCardCount;
}; module.exports.canSupplyStackCards = canSupplyStackCards;

const recyclePlayedCards = (match) =>{
    // last card in match.playedCards stays in stack
    match.cards = match.playedCards.splice(0, match.playedCards.length - 2);
}; module.exports.recyclePlayedCards = recyclePlayedCards;

const isColorChanger = (card) =>{
    return PlayCardValidator.hasEffect(card, EffectSpecial.CHANGE_COLOR) ||
        PlayCardValidator.hasEffect(card, EffectSpecial.TAKE_4);
}; module.exports.isColorChanger = isColorChanger;