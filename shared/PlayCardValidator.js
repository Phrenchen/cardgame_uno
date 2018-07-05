const validateCard = (playCard, topCard) =>{
    if(!playCard || !topCard){
        return false;
    }
    const activeEffects = topCard.effects;
    //console.log("active effects: " + activeEffects);
    const effectsToApply = playCard.effects;
    //console.log("playCard effects: " + effectsToApply);

    return true;
}

module.exports = validateCard;