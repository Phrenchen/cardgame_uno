const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const MatchSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    cards: {
        type: Array,
        required: true
    },
    playedCards: {
        type: Array,
        required: true
    },
    activePlayerID: {
        type: String,
        required: true
    },
    movingPlayerCursorForward: {
        type: Boolean,
        default: true
    },
    penalties: {
        type: Array,
        default: []
    },
    serverMessage: {
        type: String,
        default: ""
    },
    colorSelectorCardID:{
        type:String,
        default: ""
    },
    selectedColor: {
        type: String,
        default: ""
    }
});
module.exports = Match = mongoose.model("match", MatchSchema);