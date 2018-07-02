const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const EffectColor = require("./EffectColor");
const EffectValue = require("./EffectValue");
const EffectSpecial = require("./EffectSpecial");


cardDeck = [];            // id´s of all cards belonging to one deck. will be cloned to be used in a match
module.exports.cardDeck = cardDeck;

function initDB(){
    // 1. check if effects exist
    Effect.find()
        .then( effects => {
                if(effects.length == 0){
                    // add effects, cards will be created after effects have been stored
                    addEffectsToDB(); 
                }
            })
}
module.exports.initDB = initDB;


// CARDS
function addCardsToDB() {
    // get all effects from db 
    Effect.find()
        .then((effects) =>{
            //console.log("access to all effects: " + effects.length); 
            
            // for each value, use all colors
            // every color + value combination has 2 cards, exception: 0
            EffectValue.map((value, index) => {
                let amount = index > 0 ? 2 : 1;     // all values have 2 cards per color except for value = 0
                createCard(EffectColor.RED + value.toString(), [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectValue[index].toString())], amount, cardDeck);
                createCard(EffectColor.GREEN + value.toString(), [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectValue[index].toString())], amount, cardDeck);
                createCard(EffectColor.BLUE + value.toString(), [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectValue[index].toString())], amount, cardDeck);
                createCard(EffectColor.YELLOW + value.toString(), [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectValue[index].toString())], amount, cardDeck);
            });

            // create specials
            createCard(EffectSpecial.SKIP, [getEffectByType(effects, EffectSpecial.SKIP)], 8, cardDeck);
            createCard(EffectSpecial.TAKE_2, [getEffectByType(effects, EffectSpecial.TAKE_2)], 8, cardDeck);
            createCard(EffectSpecial.CHANGE_COLOR, [getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], 4, cardDeck);
            createCard(EffectSpecial.CHANGE_DIRECTION, [getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], 8, cardDeck);
            createCard(EffectSpecial.TAKE_4 + EffectSpecial.CHANGE_COLOR, [getEffectByType(effects, EffectSpecial.TAKE_4), getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], 4, cardDeck);
            
        })
}

function getEffectByType(effects, effectType){
    let result;
    effects.map((effect) =>{
        if(effect.effectType === effectType){
            result = effect;
        }
    });
    if(result == null){
        console.log("no effect found for type: " + effectType);
    }
    return result;
}

createCard = (pName, pEffects, amount = 1, resultIDs = null) =>{
    for(let i=0; i<amount; i++){
        let card = new Card({
            name: pName,
            id: uuid(),
            effects: pEffects
        });
        
        card.save()
        .then( (card) => {
            //console.log("saved card: " + card.name);
            if(resultIDs){
                resultIDs.push(card.id);
                //console.log("adding " + card.id + " to " + resultIDs.length);
            }
        });
    }
}

//------------------------------------------------------
// EFFECTS
let effectInProgressCounter = 0;

addEffectsToDB = () => {
    // color
    createEffect(EffectColor.RED);
    createEffect(EffectColor.GREEN);
    createEffect(EffectColor.BLUE);
    createEffect(EffectColor.YELLOW);
    
    // create cards with values 0-9
    let valueCount = EffectValue.length;
    EffectValue.map((value) => {
        createEffect(value);
    });

    // specials
    createEffect(EffectSpecial.TAKE_2);
    createEffect(EffectSpecial.TAKE_4);
    createEffect(EffectSpecial.SKIP);
    createEffect(EffectSpecial.CHANGE_COLOR);
    createEffect(EffectSpecial.CHANGE_DIRECTION);
}

createEffect = (eType) => {
    effectInProgressCounter++;

    let effect = new Effect({
        name: eType,
        id: uuid(),
        effectType: eType
    });
    
    effect.save()
        .then( (newEffect) => {
            effectInProgressCounter--;
            if(effectInProgressCounter <= 0){
                Card.find()
                    .then( cards => {
                        if(cards.length == 0){
                            // add cards
                            addCardsToDB();
                        }
                    });
            }
        });
}