const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const EffectColor = require("./EffectColor");
const EffectValue = require("./EffectValue");
const EffectSpecial = require("./EffectSpecial");


function initDB(){
    // 1. create effects
    // 2. create cards (they have effects)
    Effect.find()
        .then( effects => {
                console.log("1");
                console.log("num effects in db: " + effects.length);
                
                if(effects.length == 0){
                    // add effects
                    addEffectsToDB(); 
                }
            })

/*
// add cards to db if they dont exist
Effect.find()
.then( effects => {
        console.log("1");
        console.log("num effects in db: " + effects.length);
        
        if(effects.length == 0){
            // add effects
            addEffectsToDB(); 
        }
    })
    .then( () =>{
        console.log("2");
        Card.find()
            .then( cards => {
                console.log("num cards in db: " + cards.length);
        
                if(cards.length == 0){
                    // add cards
                    addCardsToDB();
                }
            });
    });
*/
}
module.exports.initDB = initDB;


// CARDS
function addCardsToDB() {
    // get AAAALL the effects
    Effect.find()
        .then((effects) =>{
            console.log("access to all effects: " + effects.length); 
            
            // for each value, use all colors
            EffectValue.map((value, index) => {
                console.log("**--**");
                createCard(EffectColor.RED + value, [getEffectIdByType(effects, EffectColor.RED), getEffectIdByType(effects, EffectValue[index])]);
                
            });

        })
/*
    let valueCount = EffectValue.length;
    
*/
}

function getEffectIdByType(effects, effectType){
    let id = -1;
    effects.map((effect) =>{
        //console.log("---");
        //console.log(effect.effectType);
        if(effect.effectType === effectType){
            console.log("found effect");
            id = effect.id;
        }
    });
    return id;
}

createCard = (pName, pEffects) =>{
    let card = new Card({
        name: pName,
        id: uuid(),
        effects: pEffects
    });
    
    card.save()
        .then( (card) => {
            console.log("saved card: " + card.name);
        });
}


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
            //console.log("saved effect: " + newEffect.name);
            effectInProgressCounter--;

            if(effectInProgressCounter <= 0){
                //console.log("___ all effects have been stored ___")
                //console.log("CHECKING CARDS");
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