const EffectSpecial = require("./EffectSpecial");
const EffectColor = require("./EffectColor");

const hasEffect = (card, effectType) =>{
    for(let i=0; i<card.effects.length; i++){
        if(card.effects[i].effectType === effectType){
            return true;
        }
    }
    return false;
}
module.exports.hasEffect = hasEffect;

const validateCard = (playCard, topCard, selectedColor = null) =>{
    console.log("****************** validateCard: " + playCard.name);
    // early out with invalid params
    if(!playCard || !topCard){
        console.log("validateCard: need 2 cards to compare");
        return false;
    }


    // check special cards
    if(isJoker(playCard)){
        //console.log(playCard.name + " or " + topCard.name + " is no color value card");

        // TODO; color change,  +4
        return true;
    }
    /* cards are playable if
        1. same color or
        2. same value or
        3. one of them is special card
    */

    if(isJoker(topCard)){
        console.log("isJoker(topCard)");
        if(selectedColor){
            console.log("selectedColor: " + selectedColor);
            if(hasEffect(playCard, selectedColor)){
                console.log("played card has matching color");

                return true;        // play card color matches color selected by previous player
                                    // can another special card be played on top of another one?
            }
        }
    }

    let areSame = hasSameEffect(playCard, topCard, selectedColor);
    return areSame;
}
module.exports.validateCard = validateCard;

const isJoker = (card) => {
    return hasEffect(card, EffectSpecial.CHANGE_COLOR) ||
            hasEffect(card, EffectSpecial.TAKE_4);
}
module.exports.hasSpecialEffect = isJoker;

// helper
const hasSameEffect = (playCard, topCard, selectedColor) =>{
    let effect1;
    let effect2;

    for(let i=0; i<playCard.effects.length; i++){
        effect1 = playCard.effects[i];

        for(let j=0; j<topCard.effects.length; j++){
            effect2 = topCard.effects[j];

            if(effect1.effectType.toString() === effect2.effectType.toString()){
                //console.log("found identical effects:" + effect1.effectType);
                return true;
            }
        }
    }
    if(hasEffect(playCard, selectedColor)){
        console.log(playCard.name);
        console.log(playCard);
        console.log(selectedColor);
        console.log("lands here after playing first suitable card after color selection?");                 // lands here after playing first suitable card after color selection
        console.log(playCard.name);
        console.log(selectedColor);
        return true;
    }

    return false;
}