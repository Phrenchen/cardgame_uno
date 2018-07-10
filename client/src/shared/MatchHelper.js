const MathHelper = require("./MathHelper");

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

const getRandomCard = (cards) =>{
    let randomIndex = MathHelper.getRandomInt(0, cards.length-1);
    return cards[randomIndex];
}

module.exports.getRandomCard = getRandomCard;

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

const extractCardFromPlayer = (player, cardID) =>{
    let card;

    for(let j=0; j<player.cards.length; j++){
        card = player.cards[j];
        if(!card){
            console.log("trying to extract null from player.cards. check where we insert to player.cards");
        }
        if(card.id === cardID){
            player.cards.splice(j, 1);

            return card;
        }
    }
    return null;
}
module.exports.extractCardFromPlayer = extractCardFromPlayer;