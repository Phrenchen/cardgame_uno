const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CARD
const CardSchema = new Schema({
    effects: {
        type: Array,
        required: true
    },
    id: {
        type: Number,
        default: -1
    } 
});
module.exports = Card = mongoose.model("card", CardSchema);

// EFFECT
const EffectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: -1
    },
    validate: {
        type: Function,
        required: true
    }
});
module.exports = Effect = mongoose.model("effect", EffectSchema);