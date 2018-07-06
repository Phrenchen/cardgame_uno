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
    }
});
module.exports = Match = mongoose.model("match", MatchSchema);