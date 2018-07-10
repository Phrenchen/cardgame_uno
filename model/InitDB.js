const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const Player = require("./Player");
const EffectColor = require("./EffectColor");
const EffectValue = require("./EffectValue");
const EffectSpecial = require("./../client/src/shared/EffectSpecial");

var cards = [];
var players = [];

const getCarddeck = () =>{
    return cards.slice();   // return copy of card deck
}
module.exports.getCardDeck = getCarddeck;

const getPlayers = () =>{
    return players.slice();
}
module.exports.getPlayers = getPlayers;


function initDB(){
    // 1. check if effects exist
    Effect.find()
        .then( effects => {
                if(effects.length === 0){
                    // add effects, cards will be created after effects have been stored
                    addEffectsToDB(); 
                }
            })

    // check if players exist
    Player.find()
        .then((players) =>{
            if(players.length === 0){
                addPlayersToDB();
            }
        })


}
module.exports.initDB = initDB;

// PLAYERS
function addPlayersToDB(){
    //TODO: create players
    players.push( new Player({
        id: uuid(),
        name: "The Ninja",
        image: "images/the_ninja.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Dr. Surprise",
        image: "images/dr_surprise.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Captain Obvious",
        image: "images/captain_obvious.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Colonel Custard",
        image: "images/colonel_custard.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Sir Has-A-Plan",
        image: "images/sir_has_a_plan.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Missy Suspicious",
        image: "images/missy_suspicious.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "The Demon",
        image: "images/the_demon.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Innocence",
        image: "images/innocence.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Her Majesty II",
        image: "images/her_majesty_ii.png"
    }));

    Player.insertMany(players, (err, result) =>{
        //console.log("inserted players: " + result.length);
    });
}

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
    let effects = [];
    // color
    effects.push( createEffect(EffectColor.RED) );
    effects.push( createEffect(EffectColor.GREEN) );
    effects.push( createEffect(EffectColor.BLUE) );
    effects.push( createEffect(EffectColor.YELLOW) );
    
    // create cards with values 0-9
    let valueCount = EffectValue.length;
    EffectValue.map((value) => {
        effects.push( createEffect(value) );
    });

    // specials
    effects.push( createEffect(EffectSpecial.TAKE_2) );
    effects.push( createEffect(EffectSpecial.TAKE_4) );
    effects.push( createEffect(EffectSpecial.SKIP) );
    effects.push( createEffect(EffectSpecial.CHANGE_COLOR) );
    effects.push( createEffect(EffectSpecial.CHANGE_DIRECTION) );

    Effect.insertMany(effects, (err, result) =>{
        //console.log("saved effects, adding cards, now");
        addCardsToDB();
    });
}

createEffect = (eType) => {
    effectInProgressCounter++;

    let effect = new Effect({
        name: eType,
        id: uuid(),
        effectType: eType
    });
    return effect;
}