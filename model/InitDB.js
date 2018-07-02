const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const EffectColor = require("./EffectColor");
const EffectValue = require("./EffectValue");
const EffectSpecial = require("./EffectSpecial");


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
                createCard(EffectColor.RED + value, [getEffectIdByType(effects, EffectColor.RED), getEffectIdByType(effects, EffectValue[index])], amount);
                createCard(EffectColor.GREEN + value, [getEffectIdByType(effects, EffectColor.GREEN), getEffectIdByType(effects, EffectValue[index])], amount);
                createCard(EffectColor.BLUE + value, [getEffectIdByType(effects, EffectColor.BLUE), getEffectIdByType(effects, EffectValue[index])], amount);
                createCard(EffectColor.YELLOW + value, [getEffectIdByType(effects, EffectColor.YELLOW), getEffectIdByType(effects, EffectValue[index])], amount);
            });

            // create specials

        })
}

function getEffectIdByType(effects, effectType){
    let id = -1;
    effects.map((effect) =>{
        if(effect.effectType === effectType){
            id = effect.id;
        }
    });
    return id;
}

createCard = (pName, pEffects, amount = 1) =>{
    for(let i=0; i<amount; i++){
        let card = new Card({
            name: pName,
            id: uuid(),
            effects: pEffects
        });
        
        card.save()
        .then( (card) => {
            //console.log("saved card: " + card.name);
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