const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        default: "-1"
    },
    cards: {
        type: Array,
        required: true
    }
});
module.exports = Player = mongoose.model("player", PlayerSchema);
