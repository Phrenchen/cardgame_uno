const express = require("express");
const router = express.Router();
const uuid = require("uuid");

// player model
const Player = require("../../model/Player");


// @route   GET api/items
// @desc    get all items
// @access  public
router.get("/", (req, res) => {
    /*console.log("------------------------------");
    console.log("req: " + req);
    console.log("------------------------------");
    console.log(res);
    console.log("------------------------------");
    */
    Player.find()                 // promise based
        //.sort({id: -1})       // sort by date descendingly
        .then(items => res.json(items))
});

router.post("/", (req, res) => {
    const newPlayer = new Player({
        name: req.body.name,
        id: uuid(),
        cards: new Array()
    });

    newPlayer.save()
        .then( (player) => {
            console.log("saving player: " + player);
            res.json(player);
        });
});

module.exports = router;