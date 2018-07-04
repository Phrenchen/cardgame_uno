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
    firstPlayerID: {
        type: String,
        required: true
    },
    topCardID: {
        type: String,
        required: true
    }
});
module.exports = Match = mongoose.model("match", MatchSchema);