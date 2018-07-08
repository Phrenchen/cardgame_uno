const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const EffectColor = require("./EffectColor");
const EffectValue = require("./EffectValue");
const EffectSpecial = require("./../client/src/shared/EffectSpecial");

var cards = [];

module.exports.InitDB2 = this;

const getCarddeck = () =>{
    return cards.slice();   // return copy of card deck
}
module.exports.getCardDeck = getCarddeck;

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
            
            // for each value, use all colors
            // every color + value combination has 2 cards, exception: 0
            EffectValue.map((value, index) => {
                let amount = index > 0 ? 2 : 1;     // all values have 2 cards per color except for value = 0
                /*
                cards = cards.concat( createCard(EffectColor.RED + value.toString(), [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectValue[index].toString())], amount) );
                cards = cards.concat( createCard(EffectColor.GREEN + value.toString(), [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectValue[index].toString())], amount) );
                cards = cards.concat( createCard(EffectColor.BLUE + value.toString(), [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectValue[index].toString())], amount) );
                cards = cards.concat( createCard(EffectColor.YELLOW + value.toString(), [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectValue[index].toString())], amount) );
                */
               cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectValue[index].toString())], amount) );
               cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectValue[index].toString())], amount) );
               cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectValue[index].toString())], amount) );
               cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectValue[index].toString())], amount) );
            });
            
            // create specials
            // TAKE 2
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.TAKE_2)], 2) );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.TAKE_2)], 2) );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.TAKE_2)], 2) );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.TAKE_2)], 2) );
            
            // SKIP
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.SKIP)], 2) );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.SKIP)], 2) );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.SKIP)], 2) );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.SKIP)], 2) );

            // CHANGE DIRECTION 
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], 2) );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], 2) );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], 2) );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], 2) );

            // SELECT COLOR
            cards = cards.concat( createCard("change color", [getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], 4) );

            // SELECT COLOR + TAKE 4
            cards = cards.concat( createCard("+4, change color", [getEffectByType(effects, EffectSpecial.TAKE_4), getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], 4) );
            
            Card.insertMany(cards, (err, result) => {
                //console.log("inserted cards: " + cards.length);
            })
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

createCard = (pName, pEffects, amount = 1) =>{
    let cards = [];

    for(let i=0; i<amount; i++){
        let card = new Card({
            name: pName,
            id: uuid(),
            effects: pEffects
        });
       cards.push(card);
    }
    //console.log("created " + cards.length + " cards");
    return cards;
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