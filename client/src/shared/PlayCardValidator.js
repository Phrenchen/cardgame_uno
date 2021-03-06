const EffectSpecial = require("./EffectSpecial");

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
    // early out with invalid params
    if(!playCard || !topCard){
        console.log("validateCard: need 2 cards to compare");
        throw new Error("need 2 cards to validate");
        return false;
    }

    if(isJoker(playCard)){
        return true;
    }

    if(isJoker(topCard)){
        if(selectedColor){
            if(hasEffect(playCard, selectedColor)){
                return true;        // play card color matches color selected by previous player
            }
        }
    }
    return hasSameEffect(playCard, topCard, selectedColor);
}
module.exports.validateCard = validateCard;

const isJoker = (card) => {
    return hasEffect(card, EffectSpecial.CHANGE_COLOR) ||
            hasEffect(card, EffectSpecial.TAKE_4);
}
module.exports.isJoker = isJoker;

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
    if(isJoker(topCard)){
        if(hasEffect(playCard, selectedColor)){
            return true;
        }
    }
    return false;
}