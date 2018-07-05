const express = require("express");
const playcardRouter = express.Router();
const Match = require("../../model/Match")
const Card = require("../../model/Card")
const validateCard = require("../../shared/PlayCardValidator");

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
                            //console.log("found player: " + activePlayer);
                            const topCard = match.playedCards[match.playedCards.length-1]
                            
                            // find handcard from player
                            console.log(activePlayer.cards.length);
                            const playCard = extractCardFromPlayer(activePlayer, cardID);
                            console.log(activePlayer.cards.length);
                            //console.log("found topcard: " + topCard.name);
                            //console.log("found playcard: " + playCard.name);
                            if(validateCard(playCard, topCard)){
                                //removeCardFromPlayer(match, playerID, )
                                match.playedCards.push(playCard);
                                console.log("added card to playedCards: " + match.playedCards.length);
                                //console.log("player has remaining cards: " + player.cards.length);
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
                                    console.log("saved active player: " + savedPlayer.cards.length);
                                    let oldPlayer;
                                    // replace new player in match. THIS LOOKS WEIRD? check mongo doc...
                                    for(var x=0; x<match.players.length; x++){
                                        oldPlayer = match.players[x];

                                        if(oldPlayer.id === savedPlayer.id){
                                            match.players[x] = savedPlayer;
                                        }
                                    }

                                    match.save()          // promise based
                                    .then((savedMatch) => {
                                        console.log("updated match: " + match.players[0].cards.length);
                                        console.log("savedPlayer: " + savedPlayer.cards.length);
                                        res.json(savedMatch)
                                    });
                                });
                        })
                    }
                })
            })
        })
        .catch(e =>{
            console.log("error: " + e);
        })
        ;
});

// helper
function extractCardFromPlayer(player, cardID){
    let card;
    
    for(let j=0; j<player.cards.length; j++){
        card = player.cards[j];
        
        if(card.id === cardID){
            console.log("************* extracting card ************* " + player.cards.length);
            
            player.cards.splice(j, 1);
            console.log("************* extracting card ************* " + player.cards.length);

            return card;
        }
    }
    return null;
}

module.exports = playcardRouter;