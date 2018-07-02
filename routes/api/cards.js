const express = require("express");
const cardRouter = express.Router();
const uuid = require("uuid");
// item model
const Card = require("../../model/Card");

// @route   GET api/items
// @desc    get all items
// @access  public
cardRouter.get("/", (req, res) => {
    Card.find()                 // promise based
        .sort({name: -1})       // sort by date descendingly
        .then(items => res.json(items))
});

// @route   POST api/items
// @desc    create an item
// @access  public
cardRouter.post("/", (req, res) => {
    console.log("creating new card");
    const newItem = new Card({
        name: req.body.name,
        id: uuid()
    });

    newItem.save()          // promise based
        .then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    delete an item
// @access  public
cardRouter.delete("/:id", (req, res) => {
    Card.findById(req.params.id)
        .then( item => item.remove().then( () => res.json({success: true}) ) )
        .catch(err => {
            console.log(req);
            console.log(res);
            res.status(404).json({success: false})
        });
});


module.exports = cardRouter;
