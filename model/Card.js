const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
// TUTORIAL ITEM
const CardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    effects:{
        type: Array,
        default: []
    }
});
module.exports = Card = mongoose.model("card", CardSchema); 