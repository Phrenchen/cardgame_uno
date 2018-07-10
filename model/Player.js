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
    image: {
        type : String,
        default: ""
    },
    cards: {
        type: Array,
        default: []
    }
});
module.exports = Player = mongoose.model("player", PlayerSchema);
