const express = require("express");
const effectRouter = express.Router();
const uuid = require("uuid");
// item model
const Effect = require("../../model/Effect");

// @route   GET api/items
// @desc    get all items
// @access  public
effectRouter.get("/", (req, res) => {
    Effect.find()                 // promise based
        .sort({effectType: -1})       // sort by date descendingly
        .then(items => res.json(items))
});

// @route   POST api/items
// @desc    create an item
// @access  public
effectRouter.post("/", (req, res) => {
    const newItem = new Effect({
        name: req.body.name,                // param
        id: uuid(),
        effectType: req.body.effectType     // param
    });

    newItem.save()          // promise based
        .then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    delete an item
// @access  public
effectRouter.delete("/:id", (req, res) => {
    Card.findById(req.params.id)
        .then( item => item.remove().then( () => res.json({success: true}) ) )
        .catch(err => {
            console.log(req);
            console.log(res);
            res.status(404).json({success: false})
        });
});


module.exports = effectRouter;
