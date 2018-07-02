const uuid = require("uuid");
const express = require("express");
const playerRouter = express.Router();

// player model
const Player = require("../../model/Player");


// @route   GET api/players
// @desc    get all players
// @access  public
playerRouter.get("/", (req, res) => {
    /*console.log("------aadding player ---------");
    console.log("req: " + req);
    console.log("------------------------------");
    console.log(res);
    console.log("------------------------------");
    */
    Player.find()                 // promise based
        //.sort({id: -1})       // sort by date descendingly
        .then(players => res.json(players))
});

// @route   POST api/players
// @desc    add player
// @access  public
playerRouter.post("/", (req, res) => {
    const newPlayer = new Player({
        name: req.body.name,
        id: uuid(),
        cards: new Array()
    });

    newPlayer.save()
        .then( (player) => {
            res.json(player);
        });

});

// @route   DELETE api/players/:id
// @desc    delete an item
// @access  public
playerRouter.delete("/:id", (req, res) => {
    Player.findById(req.params.id)
        .then(player => player.remove().then(() => res.json({success: true})))
        .catch(err => {
            //console.log(req);
            //console.log(res);
            res.status(404).json({success: false})
        });
});

module.exports = playerRouter;