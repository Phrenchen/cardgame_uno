const validateCard = (playCard, topCard) =>{
    if(!playCard || !topCard){
        console.log("validateCard: need 2 cards to compare");
        return false;
    }
    if(!isColorValueCard(playCard) || !isColorValueCard(topCard)){
        console.log(playCard.name + " or " + topCard.name + " is no color value card");
        return false;
    }
    /* cards are playable if
        1. same color or
        2. same value or
        3. one of them is special card
    */
    let areSame = hasSameEffect(topCard, playCard);
    console.log("areSame: " + areSame);
    return areSame;
}
module.exports.validateCard = validateCard;

const isColorValueCard = (card) => {
    if(!card){
        console.log("isColorValueCard: no card to check :(");
        return false;
    }
    for(let i=0; i< card.effects.length; i++){
        if(card.effects[i].effectType.indexOf("color") !== -1){
            return true;
        }
    }
    return false;
}
module.exports.isColorValueCard = isColorValueCard;

// helper
const hasSameEffect = (card1, card2) =>{
    let effect1;
    let effect2;

    for(let i=0; i<card1.effects.length; i++){
        effect1 = card1.effects[i];

        for(let j=0; j<card2.effects.length; j++){
            effect2 = card2.effects[j];

            if(effect1.effectType.toString() === effect2.effectType.toString()){
                console.log("found identical effects:" + effect1.effectType);
                return true;
            }
        }
    }

    return false;
}