const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
// TUTORIAL ITEM
const EffectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    effectType: {
        type: String,
        required: true
    }
});
module.exports = Effect = mongoose.model("effect", EffectSchema); 