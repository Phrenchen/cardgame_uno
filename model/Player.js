const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    id: {
        type: String,
        default: "-1"
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type : String,
        default: ""
    },
    cards: {
        type: Array,
        default: []
    },
    matchScore: {
        type: Number,
        default: 0
    },
    isHumanPlayer: {
        type:Boolean,
        default: false
    }
    //TODO: totalScore, if multiple a game consists of multiple matches 
});
module.exports = Player = mongoose.model("player", PlayerSchema);
