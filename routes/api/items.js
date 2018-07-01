const express = require("express");
const itemRouter = express.Router();

// item model
const Item = require("../../model/Item");

// @route   GET api/items
// @desc    get all items
// @access  public
itemRouter.get("/", (req, res) => {
    Item.find()                 // promise based
        .sort({date: -1})       // sort by date descendingly
        .then(items => res.json(items))
});

// @route   POST api/items
// @desc    create an item
// @access  public
itemRouter.post("/", (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save()          // promise based
        .then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    delete an item
// @access  public
itemRouter.delete("/:id", (req, res) => {
    Item.findById(req.params.id)
        .then( item => item.remove().then( () => res.json({success: true}) ) )
        .catch(err => {
            console.log(req);
            console.log(res);
            res.status(404).json({success: false})
        });
});


module.exports = itemRouter;
