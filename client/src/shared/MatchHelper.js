const MathHelper = require("./MathHelper");
const PlayCardValidator = require("./PlayCardValidator");

const calculateScores = (match) =>{
    match.players.map((player) =>{
        let score = 0;

        player.cards.map((card) =>{
            score += card.score;
        });

        player.matchScore = score;
    });
}
module.exports.calculateScores = calculateScores;

const getWinner = (match) => {
    let result = null;

    match.players.map((player) =>{
        if(player.cards.length === 0){
            result = player;
        }
    });
    return result;
}
module.exports.getWinner = getWinner;
//------------------------------------------------------

const playerHasPlayableCards = (match) => {
    let result = false;
    let allCandidates = getActivePlayer(match).cards;
    let topCard = getTopCard(match);

    match.penalties.map((pSet) =>{
        allCandidates.concat(pSet.cards);
    });

    allCandidates.map((card) =>{
        if(PlayCardValidator.validateCard(card, topCard)){
            result = true;
        }
    });
    return result;
}
module.exports.playerHasPlayableCards = playerHasPlayableCards;

const getTopCard = (match) =>{
    return match.playedCards[match.playedCards.length-1];
}
module.exports.getTopCard = getTopCard;

const getActivePlayer = (match) => {
    return getPlayerByID(match.players, match.activePlayerID);
}
module.exports.getActivePlayer = getActivePlayer;

const getPlayerByID = (players, playerID) =>{
    for(let i=0; i<players.length; i++){
        if(players[i].id === playerID){
            return players[i];
        }
    }
    return null;
}
module.exports.getPlayerByID = getPlayerByID;

const extractRandomCard = (cards) =>{
    let randomIndex = MathHelper.getRandomInt(0, cards.length-1);
    return cards.splice(randomIndex, 1)[0];
}
module.exports.extractRandomCard = extractRandomCard;

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
}
module.exports.getNextPlayerID = getNextPlayerID;

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
}
module.exports.extractCard = extractCard;