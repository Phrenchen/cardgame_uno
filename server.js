const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const matches = require("./routes/api/matches");
const playcard = require("./routes/api/playcard");
const acceptPenalties = require("./routes/api/acceptPenalties");

const app = express();

const {initDB} = require("./model/InitDB");

// body parser middleware
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

//mongoose.connection.dropCollection();
mongoose.connection.dropDatabase(); // <---- DROP DATA!

// connect to db
mongoose
    .connect(db)
    .then(() => console.log("mongoDB connected") )
    .catch(() => console.log("err"))


// use routes
//app.use("/api/items", items);
//app.use("/api/cards", cards);
//app.use("/api/players", players);
//app.use("/api/effects", effects);
app.use("/api/matches", matches);
app.use("/api/playcard", playcard);
app.use("/api/acceptPenalties", acceptPenalties);

// serve static assets if we are in production
if(process.env.NODE_ENV === "production"){
    // set static folder
    app.use(express.static("client/build"));

    app.get("*", () =>{
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server started on port " + port));

initDB();
