const validateCard = (match, playCard, topCard) =>{
    // match: are all cards involved?

    if(!playCard || !topCard){
        return false;
    }
    const activeEffects = topCard.effects;
    //console.log("active effects: " + activeEffects);
    const effectsToApply = playCard.effects;
    //console.log("playCard effects: " + effectsToApply);

    let sameColor = isColor(topCard) && isColor(playCard);
    let sameValue = false;
    let sameSpecialEffect = false;

    return sameColor || sameValue || sameSpecialEffect;
}
module.exports = validateCard;

const isColor = (card) =>{
    let effect;
    for(let i=0; i<card.effects.length; i++){
        effect = card.effects[i];
        if(effect.effectType.indexOf("color") != null ){
            return true;
        }
    }
    return false;
}
module.exports = isColor;