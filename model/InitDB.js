const uuid = require("uuid");
const Card = require("./Card");
const Effect = require("./Effect");
const Player = require("./Player");
const EffectValue = require("./EffectValue");
const EffectColor = require("./../client/src/shared/EffectColor");
const EffectSpecial = require("./../client/src/shared/EffectSpecial");
const PlayCardValidator = require("./../client/src/shared/PlayCardValidator");

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
        imageUrl: "/images/the_ninja.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Dr. Surprise",
        imageUrl: "/images/dr_surprise.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Captain Obvious",
        imageUrl: "/images/captain_obvious.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Mr. Mustache",
        imageUrl: "/images/mr_mustache.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Sir Has-A-Plan",
        imageUrl: "/images/sir_has_a_plan.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Missy Suspicious",
        imageUrl: "/images/missy_suspicious.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "The Demon",
        imageUrl: "/images/the_demon.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Innocence",
        imageUrl: "/images/innocence.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Her Majesty II",
        imageUrl: "/images/her_majesty.png"
    }));

    players.push( new Player({
        id: uuid(),
        name: "Bat Cat",
        imageUrl: "/images/batcat.png"
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
                cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectValue[index].toString())], EffectValue[index], amount) );
                cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectValue[index].toString())], EffectValue[index], amount) );
                cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectValue[index].toString())], EffectValue[index], amount) );
                cards = cards.concat( createCard(value.toString(), [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectValue[index].toString())], EffectValue[index], amount) );
            });
            
            // create specials
            // TAKE 2
            let take2Score = 20;
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.TAKE_2)], take2Score, 2, "images/take2.png") );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.TAKE_2)], take2Score, 2, "images/take2.png") );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.TAKE_2)], take2Score, 2, "images/take2.png") );
            cards = cards.concat( createCard("+2", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.TAKE_2)], take2Score, 2, "images/take2.png") );
            
            // SKIP
            let skipScore = 20;
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.SKIP)], skipScore, 2, "images/skip.png") );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.SKIP)], skipScore, 2, "images/skip.png") );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.SKIP)], skipScore, 2, "images/skip.png") );
            cards = cards.concat( createCard("skip", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.SKIP)], skipScore, 2, "images/skip.png") );

            // CHANGE DIRECTION 
            let changeDirectionScore = 20;
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.RED), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], changeDirectionScore, 2, "images/change_direction.png") );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.GREEN), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], changeDirectionScore, 2, "images/change_direction.png") );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.BLUE), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], changeDirectionScore, 2, "images/change_direction.png") );
            cards = cards.concat( createCard("<=>", [getEffectByType(effects, EffectColor.YELLOW), getEffectByType(effects, EffectSpecial.CHANGE_DIRECTION)], changeDirectionScore, 2, "images/change_direction.png") );

            // SELECT COLOR
            let selectColorScore = 50;
            cards = cards.concat( createCard("change color", [getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], selectColorScore, 4, "images/select_color.png") );

            // SELECT COLOR + TAKE 4
            let selectColorTake4Score = 50;
            cards = cards.concat( createCard("+4, change color", [getEffectByType(effects, EffectSpecial.TAKE_4), getEffectByType(effects, EffectSpecial.CHANGE_COLOR)], selectColorTake4Score, 4, "images/take4.png") );
            
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


function calculateSortOrder(effects){
    let sortOrder = -1;
    // 1. colors: black, red, green, blue, yellow
    let colorOrders = {
        [EffectColor.BLACK]: 5,
        [EffectColor.RED]: 4,
        [EffectColor.GREEN]: 3,
        [EffectColor.BLUE]: 2,
        [EffectColor.YELLOW]: 1,
    };

    for(let i=0; i<effects.length; i++){
        if(colorOrders[effects[i].effectType] ){
            sortOrder = colorOrders[effects[i].effectType];
            break;
        }
    }
    if(sortOrder === -1){           // cards with "no" color are black
        sortOrder = colorOrders[EffectColor.BLACK];
    }
    return sortOrder;
}

createCard = (pName, pEffects, score, amount = 1, imageUrl = null) =>{
    let cards = [];
    let card;
    let sortOrder;

    for(let i=0; i<amount; i++){
        sortOrder = calculateSortOrder(pEffects);

        card = new Card({
            name: pName,
            id: uuid(),
            effects: pEffects,
            score: score,
            imageUrl: imageUrl,
            sortOrder: sortOrder
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